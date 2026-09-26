/* ─────────────────────────────────────────────────────────
   영상 로딩과 전체화면 화질 · 선택한 영상만 연결하고 재생 상태를 보존
   ───────────────────────────────────────────────────────── */

type SafariVideo = HTMLVideoElement & {
  webkitDisplayingFullscreen?: boolean;
  webkitPresentationMode?: string;
};
type SafariDocument = Document & { webkitFullscreenElement?: Element | null };
type Playback = { time: number; playing: boolean; rate: number; volume: number; muted: boolean };
type Transition = { playback: Playback; positioned: boolean };
export type VideoController = { start: () => void; dispose: () => void };

/** 처음에는 src를 연결하지 않는다. start는 사용자 클릭 안에서 호출해 모바일 재생 권한을 유지한다. */
export function connectVideoQuality(
  video: SafariVideo,
  sources: { src: string; fullSrc?: string },
  onFailure: () => void,
  onSuspend: () => void = () => {},
): VideoController {
  const doc = video.ownerDocument as SafariDocument;
  const absolute = (src: string) => {
    try { return new URL(src, doc.baseURI).href; }
    catch { return src; } // 잘못된 환경 변수도 브라우저의 영상 오류·폴백 경로로 처리한다.
  };
  const preview = absolute(sources.src);
  const full = sources.fullSrc ? absolute(sources.fullSrc) : undefined;
  let selected: string | undefined = video.getAttribute('src') ? video.src : undefined;
  let nativeFullscreen = Boolean(video.webkitDisplayingFullscreen);
  let fullFailed = false;
  let pending: Transition | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  let saved: Playback | undefined;

  const snapshot = (): Playback => ({
    time: Number.isFinite(video.currentTime) ? video.currentTime : 0,
    playing: !video.paused && !video.ended,
    rate: video.playbackRate, volume: video.volume, muted: video.muted,
  });
  const clearTimer = () => { clearTimeout(timer); timer = undefined; };

  const switchSource = (target: string, playback = pending?.playback ?? snapshot()) => {
    if (disposed || selected === target) return;
    // 빠르게 진입·종료하면 아직 로드 중인 영상의 0초 대신 마지막 재생 위치를 이어받는다.
    clearTimer();
    pending = { playback: { ...playback }, positioned: false };
    selected = target;
    video.dataset.videoQuality = target === full ? 'hd' : 'preview';
    // 선택한 영상은 일시정지 상태의 화질 전환에서도 첫 프레임을 읽을 수 있어야 한다.
    video.preload = 'metadata';
    video.src = target;
    video.load();
    if (target === full) {
      timer = setTimeout(() => {
        fullFailed = true;
        switchSource(preview);
      }, 15_000);
    }
  };

  const suspend = () => {
    if (!selected) return;
    saved = { ...(pending?.playback ?? snapshot()), playing: false };
    if (video.ended) saved.time = 0;
    clearTimer();
    pending = undefined;
    selected = undefined;
    // pause만으로는 브라우저의 추가 버퍼링을 막지 못한다. URL을 해제하고 로드를 중단한다.
    video.pause();
    video.removeAttribute('src');
    video.preload = 'none';
    video.load();
    video.dataset.videoQuality = 'idle';
    onSuspend();
  };

  const restore = () => {
    const transition = pending;
    if (!transition || video.readyState < 1 || video.src !== selected) return;
    const playback = transition.playback;
    if (!transition.positioned) {
      transition.positioned = true;
      video.playbackRate = playback.rate;
      video.volume = playback.volume;
      video.muted = playback.muted;
      // 두 변환본의 마지막 프레임 경계가 조금 달라도 유효한 구간 안으로 이동한다.
      const end = Number.isFinite(video.duration) ? video.duration : playback.time;
      const time = Math.max(0, Math.min(playback.time, end));
      if (Math.abs(video.currentTime - time) > 0.05) {
        video.currentTime = time;
        return;
      }
    }
    if (video.seeking || video.readyState < 2) return;
    clearTimer();
    pending = undefined;
    // 다른 영상의 play 이벤트가 아직 큐에 있어도 이미 시작된 재생을 빼앗지 않는다.
    const anotherIsPlaying = [...doc.querySelectorAll<HTMLVideoElement>('[data-role="video-slot"] video')]
      .some((other) => other !== video && !other.paused);
    // 사용자가 방금 누른 play 이벤트가 늦게 전달되어도 현재 재생 의도를 덮어쓰지 않는다.
    if ((playback.playing || !video.paused) && !anotherIsPlaying && doc.visibilityState !== 'hidden') {
      // 소스 재교체의 AbortError나 브라우저 자동재생 제한은 오류 화면으로 바꾸지 않는다.
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const fullscreenSource = () => {
    const element = doc.fullscreenElement ?? doc.webkitFullscreenElement;
    const fullscreen = Boolean(
      (element && (element === video || element.contains(video))) ||
      nativeFullscreen || video.webkitPresentationMode === 'fullscreen',
    );
    return fullscreen && full && !fullFailed ? full : preview;
  };
  const updateFullscreen = () => {
    if (selected) switchSource(fullscreenSource());
  };
  const beginFullscreen = () => { nativeFullscreen = true; updateFullscreen(); };
  const endFullscreen = () => { nativeFullscreen = false; updateFullscreen(); };
  const presentationChanged = () => {
    nativeFullscreen = video.webkitPresentationMode === 'fullscreen';
    updateFullscreen();
  };
  const error = () => {
    if (!selected || !video.error) return;
    if (selected === full) {
      // 고화질만 실패한 경우에도 영상 전체가 준비 안내로 사라지지 않게 한다.
      fullFailed = true;
      switchSource(preview);
    } else {
      clearTimer();
      pending = undefined;
      onFailure();
    }
  };
  const anotherVideoStarted = (event: Event) => {
    const other = event.target;
    if (other === video || !(other instanceof HTMLVideoElement) || !other.closest('[data-role="video-slot"]') || other.paused) return;
    // 로딩 중인 플레이어는 이미 paused다. 예약된 자동 재개 의도도 취소해야 소리가 겹치지 않는다.
    suspend();
  };
  const visibilityChanged = () => { if (doc.visibilityState === 'hidden') suspend(); };
  const pause = () => {
    if (video.paused && pending && pending.positioned && video.readyState >= 2) pending.playback.playing = false;
  };
  const play = () => { if (!video.paused && pending) pending.playback.playing = true; };
  const settingsChanged = () => {
    if (!pending || !pending.positioned) return;
    pending.playback.rate = video.playbackRate;
    pending.playback.volume = video.volume;
    pending.playback.muted = video.muted;
  };

  const events: [EventTarget, string, EventListener][] = [
    [doc, 'visibilitychange', visibilityChanged],
    [doc, 'fullscreenchange', updateFullscreen],
    [doc, 'webkitfullscreenchange', updateFullscreen],
    [video, 'webkitbeginfullscreen', beginFullscreen],
    [video, 'webkitendfullscreen', endFullscreen],
    [video, 'webkitpresentationmodechanged', presentationChanged],
    [video, 'loadedmetadata', restore], [video, 'loadeddata', restore],
    [video, 'canplay', restore], [video, 'seeked', restore],
    [video, 'error', error], [video, 'pause', pause], [video, 'play', play],
    [video, 'volumechange', settingsChanged], [video, 'ratechange', settingsChanged],
  ];
  events.forEach(([target, name, listener]) => target.addEventListener(name, listener));
  doc.defaultView?.addEventListener('pagehide', suspend);
  doc.addEventListener('play', anotherVideoStarted, true);
  video.dataset.videoQuality = selected ? 'preview' : 'idle';
  updateFullscreen();
  if (video.error) error();
  return {
    start: () => {
      if (disposed || doc.visibilityState === 'hidden') return;
      if (!selected) switchSource(fullscreenSource(), { ...(saved ?? snapshot()), playing: true });
      // 클릭 안에서 즉시 play()해야 iPhone에서도 첫 클릭으로 소리와 함께 시작할 수 있다.
      const requested = pending;
      void video.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'NotAllowedError' && pending === requested && pending) {
          pending.playback.playing = false;
        }
      });
    },
    dispose: () => {
      disposed = true;
      clearTimer();
      pending = undefined;
      events.forEach(([target, name, listener]) => target.removeEventListener(name, listener));
      doc.defaultView?.removeEventListener('pagehide', suspend);
      doc.removeEventListener('play', anotherVideoStarted, true);
      video.pause();
      if (selected) {
        selected = undefined;
        video.removeAttribute('src');
        video.load();
      }
    },
  };
}
