/* ─────────────────────────────────────────────────────────
   전체화면 영상 화질 · 같은 플레이어에서 재생 상태를 보존하며 소스 전환
   ───────────────────────────────────────────────────────── */

type SafariVideo = HTMLVideoElement & {
  webkitDisplayingFullscreen?: boolean;
  webkitPresentationMode?: string;
};
type SafariDocument = Document & { webkitFullscreenElement?: Element | null };
type Playback = { time: number; playing: boolean; rate: number; volume: number; muted: boolean };
type Transition = { playback: Playback; positioned: boolean };

/** 네이티브 컨트롤을 유지한다. 고화질 주소는 전체화면에 들어갈 때만 요청한다. */
export function connectVideoQuality(
  video: SafariVideo,
  sources: { src: string; fullSrc?: string },
  onFailure: () => void,
) {
  const doc = video.ownerDocument as SafariDocument;
  const absolute = (src: string) => {
    try { return new URL(src, doc.baseURI).href; }
    catch { return src; } // 잘못된 환경 변수도 브라우저의 영상 오류·폴백 경로로 처리한다.
  };
  const preview = absolute(sources.src);
  const full = sources.fullSrc ? absolute(sources.fullSrc) : undefined;
  let selected = video.src;
  let nativeFullscreen = Boolean(video.webkitDisplayingFullscreen);
  let fullFailed = false;
  let pending: Transition | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;

  const snapshot = (): Playback => ({
    time: Number.isFinite(video.currentTime) ? video.currentTime : 0,
    playing: !video.paused && !video.ended,
    rate: video.playbackRate, volume: video.volume, muted: video.muted,
  });
  const clearTimer = () => { clearTimeout(timer); timer = undefined; };

  const switchSource = (target: string) => {
    if (disposed || selected === target) return;
    // 빠르게 진입·종료하면 아직 로드 중인 영상의 0초 대신 마지막 재생 위치를 이어받는다.
    const playback = pending?.playback ?? snapshot();
    clearTimer();
    pending = { playback: { ...playback }, positioned: false };
    selected = target;
    video.dataset.videoQuality = target === full ? 'hd' : 'preview';
    video.src = target;
    video.load();
    if (target === full) {
      timer = setTimeout(() => {
        fullFailed = true;
        switchSource(preview);
      }, 15_000);
    }
  };

  const restore = () => {
    const transition = pending;
    if (!transition || video.readyState < 1 || video.src !== selected) return;
    const saved = transition.playback;
    if (!transition.positioned) {
      transition.positioned = true;
      video.playbackRate = saved.rate;
      video.volume = saved.volume;
      video.muted = saved.muted;
      // 두 변환본의 마지막 프레임 경계가 조금 달라도 유효한 구간 안으로 이동한다.
      const end = Number.isFinite(video.duration) ? video.duration : saved.time;
      const time = Math.max(0, Math.min(saved.time, end));
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
    if (saved.playing && !anotherIsPlaying) {
      // 소스 재교체의 AbortError나 브라우저 자동재생 제한은 오류 화면으로 바꾸지 않는다.
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const updateFullscreen = () => {
    const element = doc.fullscreenElement ?? doc.webkitFullscreenElement;
    const fullscreen = Boolean(
      (element && (element === video || element.contains(video))) ||
      nativeFullscreen || video.webkitPresentationMode === 'fullscreen',
    );
    switchSource(fullscreen && full && !fullFailed ? full : preview);
  };
  const beginFullscreen = () => { nativeFullscreen = true; updateFullscreen(); };
  const endFullscreen = () => { nativeFullscreen = false; updateFullscreen(); };
  const presentationChanged = () => {
    nativeFullscreen = video.webkitPresentationMode === 'fullscreen';
    updateFullscreen();
  };
  const error = () => {
    if (!video.error) return;
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
    if (other === video || !(other instanceof HTMLVideoElement) || !other.closest('[data-role="video-slot"]')) return;
    // 로딩 중인 플레이어는 이미 paused다. 예약된 자동 재개 의도도 취소해야 소리가 겹치지 않는다.
    if (pending) pending.playback.playing = false;
    video.pause();
  };
  const pause = () => {
    if (pending && pending.positioned && video.readyState >= 2) pending.playback.playing = false;
  };
  const play = () => { if (pending) pending.playback.playing = true; };
  const settingsChanged = () => {
    if (!pending || !pending.positioned) return;
    pending.playback.rate = video.playbackRate;
    pending.playback.volume = video.volume;
    pending.playback.muted = video.muted;
  };

  const events: [EventTarget, string, EventListener][] = [
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
  doc.addEventListener('play', anotherVideoStarted, true);
  video.dataset.videoQuality = 'preview';
  updateFullscreen();
  if (video.error) error();
  return () => {
    disposed = true;
    clearTimer();
    pending = undefined;
    events.forEach(([target, name, listener]) => target.removeEventListener(name, listener));
    doc.removeEventListener('play', anotherVideoStarted, true);
    video.pause();
  };
}
