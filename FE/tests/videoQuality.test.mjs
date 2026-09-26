import { test } from 'node:test';
import assert from 'node:assert/strict';
import { connectVideoQuality } from '../src/utils/videoQuality.ts';

// 실제 파일 디코딩은 브라우저에서 검증하고, 여기서는 로딩·탐색 이벤트 순서의 경합을 재현한다.
class Media extends EventTarget {
  constructor(doc) {
    super();
    Object.assign(this, {
      ownerDocument: doc, src: 'https://site.test/preview.mp4', currentTime: 42,
      duration: 120, readyState: 4, paused: false, ended: false, seeking: false,
      playbackRate: 1.5, volume: 0.4, muted: true, dataset: {}, loads: [], error: null,
    });
  }
  load() {
    this.loads.push(this.src);
    this.readyState = 0; this.paused = true; this.currentTime = 0; this.error = null;
  }
  play() { this.paused = false; this.dispatchEvent(new Event('play')); return Promise.resolve(); }
  pause() {
    if (this.paused) return;
    this.paused = true; this.dispatchEvent(new Event('pause'));
  }
  closest() { return true; }
  metadata() { this.readyState = 1; this.dispatchEvent(new Event('loadedmetadata')); }
  frame() { this.seeking = false; this.readyState = 4; this.dispatchEvent(new Event('seeked')); }
}
globalThis.HTMLVideoElement = Media;

function fixture(t, fullSrc = '/hd.mp4') {
  const doc = new EventTarget();
  Object.assign(doc, { baseURI: 'https://site.test/', fullscreenElement: null });
  const video = new Media(doc);
  doc.videos = [video];
  doc.querySelectorAll = () => doc.videos;
  let failures = 0;
  const cleanup = connectVideoQuality(video, { src: '/preview.mp4', fullSrc }, () => failures++);
  t.after(cleanup);
  const fullscreen = active => { doc.fullscreenElement = active ? video : null; doc.dispatchEvent(new Event('fullscreenchange')); };
  const loaded = () => { video.metadata(); video.frame(); };
  return { doc, video, fullscreen, loaded, cleanup, failures: () => failures };
}

test('고화질은 전체화면에서만 요청하고 재생 위치·속도·음량을 왕복 보존', t => {
  const f = fixture(t), v = f.video;
  assert.deepEqual(v.loads, []);
  f.fullscreen(true);
  assert.match(v.src, /hd.mp4$/);
  f.loaded();
  assert.equal(v.currentTime, 42); assert.equal(v.paused, false);
  assert.equal(v.playbackRate, 1.5); assert.equal(v.volume, 0.4); assert.equal(v.muted, true);
  v.currentTime = 61;
  f.fullscreen(false); f.loaded();
  assert.match(v.src, /preview.mp4$/); assert.equal(v.currentTime, 61); assert.equal(v.paused, false);
});

test('일시정지 상태 및 영상 끝 위치를 유지', t => {
  const f = fixture(t), v = f.video;
  v.paused = true; v.currentTime = 120; v.ended = true;
  f.fullscreen(true); f.loaded();
  assert.equal(v.currentTime, 120); assert.equal(v.paused, true);
});

test('고화질 로딩 중 빠른 진입·종료·재진입에서도 0초로 돌아가지 않음', t => {
  const f = fixture(t);
  f.fullscreen(true); f.fullscreen(false); f.fullscreen(true); f.loaded();
  assert.match(f.video.src, /hd.mp4$/); assert.equal(f.video.currentTime, 42); assert.equal(f.video.paused, false);
});

test('고화질 오류는 같은 시점의 경량본으로 복귀하고 같은 세션에서 재시도하지 않음', t => {
  const f = fixture(t), v = f.video;
  f.fullscreen(true);
  v.error = { code: 4 }; v.dispatchEvent(new Event('error')); f.loaded();
  assert.match(v.src, /preview.mp4$/); assert.equal(v.currentTime, 42); assert.equal(v.paused, false);
  assert.equal(f.failures(), 0);
  f.fullscreen(false); f.fullscreen(true);
  assert.equal(v.loads.length, 2);
  v.error = { code: 4 }; v.dispatchEvent(new Event('error'));
  assert.equal(f.failures(), 1);
});

test('고화질 로딩 제한 시간 이후 경량본으로 복귀', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture(t);
  f.fullscreen(true); t.mock.timers.tick(15_000); f.loaded();
  assert.match(f.video.src, /preview.mp4$/); assert.equal(f.video.currentTime, 42);
});

test('전환 대기 중 다른 영상 재생은 예약된 자동 재개도 취소', t => {
  const f = fixture(t);
  f.fullscreen(true);
  const event = new Event('play');
  Object.defineProperty(event, 'target', { value: new Media(f.doc) });
  f.doc.dispatchEvent(event);
  f.loaded();
  assert.equal(f.video.currentTime, 42); assert.equal(f.video.paused, true);
});

test('다른 영상의 play 이벤트가 아직 전달되지 않아도 재생을 빼앗지 않음', t => {
  const f = fixture(t); f.fullscreen(true);
  const other = new Media(f.doc); f.doc.videos.push(other);
  f.loaded();
  assert.equal(f.video.paused, true); assert.equal(other.paused, false);
});

test('Safari 네이티브 전체화면 및 presentation mode 변경 처리', t => {
  const f = fixture(t), v = f.video;
  v.dispatchEvent(new Event('webkitbeginfullscreen')); f.loaded();
  assert.match(v.src, /hd.mp4$/);
  v.dispatchEvent(new Event('webkitendfullscreen')); f.loaded();
  assert.match(v.src, /preview.mp4$/);
  v.webkitPresentationMode = 'fullscreen'; v.dispatchEvent(new Event('webkitpresentationmodechanged')); f.loaded();
  assert.match(v.src, /hd.mp4$/);
  v.webkitPresentationMode = 'picture-in-picture'; v.dispatchEvent(new Event('webkitpresentationmodechanged')); f.loaded();
  assert.match(v.src, /preview.mp4$/);
});

test('다른 영상이나 브라우저 전체화면에서는 화질을 바꾸지 않음', t => {
  const f = fixture(t);
  f.doc.fullscreenElement = { contains: () => false };
  f.doc.dispatchEvent(new Event('fullscreenchange'));
  assert.deepEqual(f.video.loads, []);
});

test('고화질 주소가 없으면 기존 영상 유지', t => {
  const f = fixture(t, ''); f.fullscreen(true);
  assert.deepEqual(f.video.loads, []);
});

test('잘못된 고화질 URL이 페이지를 중단시키지 않고 경량본으로 복귀', t => {
  const f = fixture(t, 'https://['); f.fullscreen(true);
  f.video.error = { code: 4 }; f.video.dispatchEvent(new Event('error')); f.loaded();
  assert.match(f.video.src, /preview.mp4$/); assert.equal(f.video.currentTime, 42);
  assert.equal(f.failures(), 0);
});

test('리스너 연결 이전에 발생한 경량본 오류도 안내로 처리', t => {
  const doc = new EventTarget();
  Object.assign(doc, { baseURI: 'https://site.test/', fullscreenElement: null });
  const v = new Media(doc); v.error = { code: 4 };
  let failures = 0;
  t.after(connectVideoQuality(v, { src: '/preview.mp4' }, () => failures++));
  assert.equal(failures, 1);
});

test('정리 후 늦게 온 이벤트와 타이머가 영상을 다시 재생하지 않음', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture(t); f.fullscreen(true); f.cleanup();
  f.loaded(); f.fullscreen(false); t.mock.timers.tick(30_000);
  assert.equal(f.video.paused, true); assert.equal(f.video.loads.length, 1);
});

test('플레이어가 제거되면 진행 중인 재생도 멈춤', t => {
  const f = fixture(t); assert.equal(f.video.paused, false);
  f.cleanup(); assert.equal(f.video.paused, true);
});
