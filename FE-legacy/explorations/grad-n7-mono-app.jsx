/* 방식 7 · 흑백 라인아트 서사시 (Monochrome Epic)
   자동 재생 · 인터랙션 최소 · 손 스냅으로 시작하는 한 편의 영상 */

const { useMemo } = React;
const G = window.GRAD;

const INK = '#1A1A18';
const PAPER = '#F7F7F5';

const FF = {
  kr: '"Gowun Batang", serif',
  la: '"Playfair Display", serif',
  sans: '"Pretendard", -apple-system, sans-serif'
};

// ── 모션 헬퍼 3개 (이 밖의 easing/transform 금지) ──
const MOTION = {
  // 등장: 아래에서 올라오며 페이드
  enter: (T, start, dur = 0.9) => {
    const k = animate({ from: 0, to: 1, start, end: start + dur, ease: Easing.easeOutCubic })(T);
    return { opacity: k, transform: `translateY(${(1 - k) * 26}px)` };
  },
  // 선 그리기: 0→1 진행도
  draw: (T, start, dur = 1.1) =>
    animate({ from: 0, to: 1, start, end: start + dur, ease: Easing.easeInOutQuad })(T),
  // 팝: 살짝 넘겼다 안착
  pop: (T, start, dur = 0.6) =>
    animate({ from: 0, to: 1, start, end: start + dur, ease: Easing.easeOutBack })(T)
};

const W = 720, H = 1280;

// ── 공통: 그려지는 path ──
function Stroke({ d, p = 1, w = 7, dash = 900, cap = 'round', opacity = 1, fill = 'none' }) {
  return (
    <path d={d} fill={fill} stroke={INK} strokeWidth={w}
      strokeLinecap={cap} strokeLinejoin="round"
      strokeDasharray={dash} strokeDashoffset={dash * (1 - clamp(p, 0, 1))}
      opacity={opacity} />
  );
}

// ── 손 스냅: 첨부된 8프레임 시퀀스 ──
// 1 = 작은 점 → 8 = 활짝 펼친 손 + 스냅 마크.
const SNAP_FRAMES = [1, 2, 3, 4, 5, 6, 7, 8].map(n => `assets/snap-${n}.png`);

// 모든 프레임을 항상 마운트해두고 opacity 로만 전환 (export 시 로딩 지연 없음)
function SnapSequence({ p, size = 300, hold = true }) {
  const k = clamp(p, 0, 1);
  const n = SNAP_FRAMES.length;
  // 마지막 프레임에 도달하면 그대로 유지
  const idx = hold
    ? Math.min(n - 1, Math.floor(k * n))
    : Math.floor(k * n) % n;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {SNAP_FRAMES.map((src, i) => (
        <img key={src} src={src} alt="" style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', objectFit: 'contain',
          opacity: i === idx ? 1 : 0
        }} />
      ))}
    </div>
  );
}

// ── 사람 (라인아트 · 어깨/라펠/손 포함) ──
function Figure({ x = 0, y = 0, s = 1, arms = 0, cap = false, opacity = 1, p = 1 }) {
  const a = clamp(arms, 0, 1);
  const eL = { x: 24 - a * 6, y: 118 - a * 54 };
  const eR = { x: 76 + a * 6, y: 118 - a * 54 };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      {/* 머리 */}
      <Stroke d="M50 30 C60 30 67 38 67 48 C67 59 60 67 50 67 C40 67 33 59 33 48 C33 38 40 30 50 30 Z" p={p} w={6} dash={170} />
      {/* 목 */}
      <Stroke d="M44 66 L44 76 M56 66 L56 76" p={p} w={5} dash={40} />
      {/* 어깨 + 몸통 (재킷 실루엣) */}
      <Stroke d="M44 76 C30 80 22 92 21 108 L24 152 L76 152 L79 108 C78 92 70 80 56 76" p={p} w={6} dash={330} />
      {/* 라펠 */}
      <Stroke d="M44 76 L50 96 L56 76" p={clamp(p * 1.4 - 0.25, 0, 1)} w={5} dash={70} />
      <Stroke d="M50 96 L50 150" p={clamp(p * 1.4 - 0.35, 0, 1)} w={4} dash={60} opacity={0.7} />
      {/* 팔 */}
      <Stroke d={`M27 96 C${20 - a * 4} ${106 - a * 10} ${eL.x} ${eL.y - 8} ${eL.x} ${eL.y}`} p={p} w={6} dash={130} />
      <Stroke d={`M73 96 C${80 + a * 4} ${106 - a * 10} ${eR.x} ${eR.y - 8} ${eR.x} ${eR.y}`} p={p} w={6} dash={130} />
      {/* 손 (마디 표현) */}
      {[eL, eR].map((e, i) => (
        <g key={i}>
          <Stroke d={`M${e.x} ${e.y} a6 6 0 1 0 0.1 0`} p={clamp(p * 1.5 - 0.3, 0, 1)} w={5} dash={45} />
          <Stroke d={`M${e.x - 4} ${e.y - 5} L${e.x - 6 - a * 3} ${e.y - 12 - a * 5}`} p={clamp(p * 1.5 - 0.45, 0, 1)} w={4} dash={22} />
          <Stroke d={`M${e.x + 3} ${e.y - 5} L${e.x + 5 + a * 3} ${e.y - 12 - a * 5}`} p={clamp(p * 1.5 - 0.5, 0, 1)} w={4} dash={22} />
        </g>
      ))}
      {/* 다리 */}
      <Stroke d="M34 152 L31 212" p={p} w={6} dash={70} />
      <Stroke d="M66 152 L69 212" p={p} w={6} dash={70} />
      {/* 신발 */}
      <Stroke d="M31 212 L20 216" p={clamp(p * 1.5 - 0.5, 0, 1)} w={5} dash={20} />
      <Stroke d="M69 212 L80 216" p={clamp(p * 1.5 - 0.55, 0, 1)} w={5} dash={20} />
      {/* 학사모 */}
      {cap && (
        <g>
          <Stroke d="M20 26 L50 14 L80 26 L50 38 Z" p={p} w={5} dash={150} />
          <Stroke d="M50 38 L50 44" p={p} w={4} dash={16} />
          <Stroke d="M74 30 L78 52" p={clamp(p * 1.4 - 0.3, 0, 1)} w={4} dash={30} />
          <Stroke d="M78 52 a4 4 0 1 0 0.1 0" p={clamp(p * 1.4 - 0.45, 0, 1)} w={4} dash={30} />
        </g>
      )}
    </g>
  );
}

// ── 타이틀 카드 (와이프 리빌) ──
function TitleCard({ T, at, kr, la, sub, size = 68 }) {
  const w = MOTION.draw(T, at, 1.3);
  const out = animate({ from: 0, to: 1, start: at + 2.4, end: at + 3.1, ease: Easing.easeInQuad })(T);
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 18, opacity: 1 - out
    }}>
      {la && (
        <div style={{
          fontFamily: FF.la, fontSize: 22, letterSpacing: 8, color: INK,
          textTransform: 'uppercase',
          clipPath: `inset(0 ${(1 - clamp(w * 1.4, 0, 1)) * 100}% 0 0)`
        }}>{la}</div>
      )}
      <div style={{
        fontFamily: FF.kr, fontSize: size, fontWeight: 700, color: INK,
        letterSpacing: -2, lineHeight: 1.15, textAlign: 'center',
        whiteSpace: 'pre-line',
        clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`
      }}>{kr}</div>
      {sub && (
        <div style={{
          fontFamily: FF.kr, fontSize: 26, color: INK, opacity: 0.62,
          clipPath: `inset(0 ${(1 - clamp(w * 1.15 - 0.2, 0, 1)) * 100}% 0 0)`
        }}>{sub}</div>
      )}
    </div>
  );
}

// ═══════ 01 SNAP — 점에서 주먹으로, 올라가며 손을 펼친다 ═══════
function SceneSnap({ T, CUES }) {
  const c = CUES.Snap;
  // 프레임 진행: 점(8) → 주먹(6~5) → 펼침(1)
  const seqEarly = animate({ from: 0, to: 0.55, start: c + 0.15, end: c + 1.35, ease: Easing.easeOutCubic })(T);
  const seqSnap  = animate({ from: 0, to: 0.45, start: c + 1.6, end: c + 2.05, ease: Easing.easeOutBack })(T);
  const seq = clamp(seqEarly + seqSnap, 0, 1);
  const rise = animate({ from: 0, to: 1, start: c + 0.3, end: c + 1.9, ease: Easing.easeOutCubic })(T);
  const exit = animate({ from: 0, to: 1, start: c + 3.05, end: c + 3.5, ease: Easing.easeInQuad })(T);

  const hand = (side) => {
    const size = 460;
    const cx = W / 2 + side * (128 - rise * 22);
    const cy = 900 - rise * 330;
    const rot = side * (16 - rise * 12);
    return (
      <div style={{
        position: 'absolute',
        left: cx - size / 2, top: cy - size / 2,
        transform: `rotate(${rot}deg) scaleX(${side})`,
        transformOrigin: 'center'
      }}>
        <SnapSequence p={seq} size={size} />
      </div>
    );
  };

  return (
    <Shot from={c} to={c + 3.55}>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit }}>
        {hand(-1)}
        {hand(1)}
      </div>
    </Shot>
  );
}

// ═══════ 02 TITLE ═══════
function SceneTitle({ T, CUES }) {
  return (
    <Shot from={CUES.Title} to={CUES.Begin + 0.2}>
      <TitleCard T={T} at={CUES.Title + 0.2}
        la={G.meta.cohortEn} kr={'아멘 제자\n17기 졸업'} sub={G.meta.tagline} size={76} />
    </Shot>
  );
}

// ═══════ 03 BEGIN — 문이 열리고 들어선다 ═══════
function SceneBegin({ T, CUES }) {
  const c = CUES.Begin;
  const door = MOTION.draw(T, c + 0.3, 1.2);
  const swing = animate({ from: 0, to: 1, start: c + 1.3, end: c + 2.3, ease: Easing.easeInOutCubic })(T);
  const walkIn = animate({ from: 0, to: 1, start: c + 1.9, end: c + 3.4, ease: Easing.easeOutCubic })(T);
  const cap = MOTION.enter(T, c + 2.6);
  const out = animate({ from: 0, to: 1, start: c + 4.0, end: c + 4.5, ease: Easing.easeInQuad })(T);

  return (
    <Shot from={c} to={c + 4.55}>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* 바닥 */}
          <Stroke d={`M60 900 L${W - 60} 900`} p={door} w={6} dash={620} />
          {/* 문틀 */}
          <Stroke d="M250 900 L250 380 L470 380 L470 900" p={door} w={8} dash={1200} />
          {/* 열리는 문짝 */}
          <g transform={`translate(250 640) scale(${1 - swing * 0.82} 1) translate(-250 -640)`} opacity={1 - swing * 0.35}>
            <Stroke d="M250 890 L250 392 L462 392 L462 890 Z" p={door} w={6} dash={1400} />
            <Stroke d="M430 640 a10 10 0 1 0 0.1 0" p={clamp(door * 1.4 - 0.4, 0, 1)} w={5} dash={70} />
          </g>
          {/* 문 안의 빛 */}
          <g opacity={swing * 0.5}>
            <Stroke d="M300 900 L360 400" p={swing} w={3} dash={520} />
            <Stroke d="M420 900 L390 400" p={swing} w={3} dash={520} />
          </g>
          {/* 들어서는 사람 */}
          <g transform={`translate(${180 + walkIn * 180} ${744}) scale(1.15)`} opacity={walkIn}>
            <Figure p={clamp(walkIn * 1.6, 0, 1)} arms={0.06} cap />
          </g>
        </svg>
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 190, textAlign: 'center', ...cap
        }}>
          <div style={{ fontFamily: FF.kr, fontSize: 40, color: INK, letterSpacing: -1, fontWeight: 700 }}>
            한 사람이 문을 열었습니다
          </div>
        </div>
      </div>
    </Shot>
  );
}

// ═══════ 04 LEARN — 책이 펼쳐지고 말씀이 채워진다 ═══════
function SceneLearn({ T, CUES }) {
  const c = CUES.Learn;
  const open = animate({ from: 0, to: 1, start: c + 0.25, end: c + 1.5, ease: Easing.easeOutCubic })(T);
  const lines = MOTION.draw(T, c + 1.3, 2.0);
  const glow = MOTION.pop(T, c + 2.9, 0.8);
  const cap = MOTION.enter(T, c + 2.4);
  const out = animate({ from: 0, to: 1, start: c + 4.1, end: c + 4.6, ease: Easing.easeInQuad })(T);

  return (
    <Shot from={c} to={c + 4.65}>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* 책 */}
          <g transform={`translate(${W / 2} 640)`}>
            {/* 책등 (항상 보이는 세로 두 줄) */}
            <Stroke d="M-9 -4 L-9 128" p={open} w={7} dash={140} />
            <Stroke d="M9 -4 L9 128" p={open} w={7} dash={140} />
            {/* 왼쪽 페이지 — 정점을 책등 왼쪽으로 */}
            <Stroke d={`M-9 -4 L${-52 - open * 208} ${26 + open * 16} L${-52 - open * 208} ${150} L-9 128 Z`} p={open} w={8} dash={900} />
            {/* 오른쪽 페이지 — 정점을 책등 오른쪽으로 */}
            <Stroke d={`M9 -4 L${52 + open * 208} ${26 + open * 16} L${52 + open * 208} ${150} L9 128 Z`} p={open} w={8} dash={900} />
            {/* 페이지 두께 */}
            <Stroke d={`M${-52 - open * 208} 150 L${-46 - open * 200} 158 L-9 134`} p={clamp(open * 1.4 - 0.3, 0, 1)} w={5} dash={260} opacity={0.65} />
            <Stroke d={`M${52 + open * 208} 150 L${46 + open * 200} 158 L9 134`} p={clamp(open * 1.4 - 0.3, 0, 1)} w={5} dash={260} opacity={0.65} />
            {/* 글줄 */}
            {[0, 1, 2, 3, 4].map(i => {
              const k = clamp(lines * 1.5 - i * 0.14, 0, 1);
              const y = 44 + i * 20;
              return (
                <g key={i}>
                  <Stroke d={`M${-40 - open * 176} ${y + 2} L${-20} ${y + 8}`} p={k} w={4} dash={210} opacity={0.8} />
                  <Stroke d={`M${20} ${y + 8} L${40 + open * 176} ${y + 2}`} p={k} w={4} dash={210} opacity={0.8} />
                </g>
              );
            })}
          </g>
          {/* 위에서 내리는 빛 */}
          <g opacity={glow * 0.55}>
            {[-1, 0, 1].map(i => (
              <Stroke key={i} d={`M${W / 2 + i * 90} 250 L${W / 2 + i * 46} 600`} p={glow} w={4} dash={400} />
            ))}
          </g>
        </svg>
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 210, textAlign: 'center', ...cap
        }}>
          <div style={{ fontFamily: FF.kr, fontSize: 40, color: INK, letterSpacing: -1, fontWeight: 700 }}>
            말씀 앞에 앉았습니다
          </div>
        </div>
      </div>
    </Shot>
  );
}

// ═══════ 05 TOGETHER — 손들이 모인다 ═══════
function SceneTogether({ T, CUES }) {
  const c = CUES.Together;
  const gather = animate({ from: 0, to: 1, start: c + 0.3, end: c + 2.4, ease: Easing.easeInOutCubic })(T);
  const ring = MOTION.draw(T, c + 2.2, 0.9);
  const cap = MOTION.enter(T, c + 2.7);
  const out = animate({ from: 0, to: 1, start: c + 4.1, end: c + 4.6, ease: Easing.easeInQuad })(T);

  const hands = [
    { a: -150, d: 330 }, { a: -95, d: 300 }, { a: -35, d: 320 },
    { a: 35, d: 305 }, { a: 95, d: 325 }, { a: 150, d: 300 }
  ];

  return (
    <Shot from={c} to={c + 4.65}>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* 모인 원 */}
          <g opacity={ring * 0.85}>
            <Stroke d={`M${W / 2} 492 a 172 172 0 1 0 0.1 0`} p={ring} w={6} dash={1130} />
          </g>
        </svg>

        {/* 사방에서 모여드는 손 (첨부 프레임) */}
        {hands.map((h, i) => {
          const k = clamp(gather * 1.3 - i * 0.06, 0, 1);
          const dist = h.d * (1 - k) + 140;
          const rad = (h.a * Math.PI) / 180;
          const size = 250;
          const cx = W / 2 + Math.sin(rad) * dist;
          const cy = 644 - Math.cos(rad) * dist * 0.78;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: cx - size / 2, top: cy - size / 2,
              transform: `rotate(${h.a * 0.6}deg) scaleX(${h.a < 0 ? -1 : 1})`,
              transformOrigin: 'center',
              opacity: clamp(k * 1.5, 0, 1)
            }}>
              <SnapSequence p={0.62 + k * 0.38} size={size} />
            </div>
          );
        })}

        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 200, textAlign: 'center', ...cap
        }}>
          <div style={{ fontFamily: FF.kr, fontSize: 40, color: INK, letterSpacing: -1, fontWeight: 700 }}>
            혼자가 아니었습니다
          </div>
        </div>
      </div>
    </Shot>
  );
}

// ═══════ 06 TRIAL — 비를 맞으며 버틴다 ═══════
function SceneTrial({ T, CUES }) {
  const c = CUES.Trial;
  const rain = MOTION.draw(T, c + 0.2, 1.0);
  const lean = animate({ from: 0, to: 1, start: c + 0.8, end: c + 2.2, ease: Easing.easeInOutSine })(T);
  const stand = animate({ from: 0, to: 1, start: c + 2.4, end: c + 3.4, ease: Easing.easeOutBack })(T);
  const cap = MOTION.enter(T, c + 2.5);
  const out = animate({ from: 0, to: 1, start: c + 3.6, end: c + 4.1, ease: Easing.easeInQuad })(T);

  const drops = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    x: 60 + ((i * 137) % (W - 120)),
    y: 180 + ((i * 211) % 520),
    l: 40 + ((i * 53) % 46),
    o: 0.35 + ((i * 31) % 50) / 100
  })), []);

  return (
    <Shot from={c} to={c + 4.15}>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* 비 */}
          {drops.map((d, i) => {
            const k = clamp(rain * 1.6 - (i % 8) * 0.06, 0, 1);
            const fall = ((T - c) * 320 + i * 70) % 700;
            return (
              <Stroke key={i} d={`M${d.x} ${d.y + fall} L${d.x - 12} ${d.y + fall + d.l}`}
                p={k} w={3} dash={110} opacity={d.o * k * (1 - lean * 0.25)} />
            );
          })}
          {/* 바닥 */}
          <Stroke d={`M50 960 L${W - 50} 960`} p={rain} w={6} dash={640} />
          {/* 버티는 사람 — 기울다가 다시 선다 */}
          <g transform={`translate(${W / 2} 800) rotate(${lean * 11 - stand * 11}) scale(1.5) translate(-50 -156)`}>
            <Figure p={1} arms={stand * 0.18} cap />
          </g>
        </svg>
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 190, textAlign: 'center', ...cap
        }}>
          <div style={{ fontFamily: FF.kr, fontSize: 40, color: INK, letterSpacing: -1, fontWeight: 700 }}>
            흔들려도 다시 섰습니다
          </div>
        </div>
      </div>
    </Shot>
  );
}

// ═══════ 07 NAMES — 이름이 하나씩 ═══════
function SceneNames({ T, CUES }) {
  const c = CUES.Names;
  const head = MOTION.enter(T, c + 0.2);
  const roster = G.roster;
  const out = animate({ from: 0, to: 1, start: c + 4.5, end: c + 5.0, ease: Easing.easeInQuad })(T);

  return (
    <Shot from={c} to={c + 5.05}>
      <div style={{
        position: 'absolute', inset: 0, padding: '0 58px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', opacity: 1 - out
      }}>
        <div style={{ textAlign: 'center', ...head }}>
          <div style={{ fontFamily: FF.la, fontSize: 20, letterSpacing: 7, color: INK, opacity: 0.55 }}>
            THE GRADUATES
          </div>
          <div style={{
            marginTop: 10, fontFamily: FF.kr, fontSize: 52, fontWeight: 700,
            color: INK, letterSpacing: -1.5
          }}>{roster.length}명의 이름</div>
        </div>
        <div style={{
          marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '18px 12px', width: '100%'
        }}>
          {roster.map((nm, i) => {
            const k = MOTION.pop(T, c + 0.9 + i * 0.075, 0.5);
            return (
              <div key={i} style={{
                textAlign: 'center', fontFamily: FF.kr, fontSize: 27,
                fontWeight: 700, color: INK, letterSpacing: -0.5,
                opacity: clamp(k, 0, 1),
                transform: `scale(${0.7 + clamp(k, 0, 1) * 0.3})`
              }}>{nm}</div>
            );
          })}
        </div>
        <div style={{
          marginTop: 40, width: 120, height: 2, background: INK,
          opacity: MOTION.draw(T, c + 3.3, 0.6) * 0.4,
          transform: `scaleX(${MOTION.draw(T, c + 3.3, 0.6)})`
        }} />
        <div style={{
          marginTop: 22, textAlign: 'center', fontFamily: FF.kr,
          fontSize: 26, color: INK, opacity: MOTION.draw(T, c + 3.6, 0.7) * 0.7
        }}>{G.awayNote}</div>
      </div>
    </Shot>
  );
}

// ═══════ 08 FINALE — 손이 다시 펼쳐진다 ═══════
function SceneFinale({ T, CUES, total }) {
  const c = CUES.Finale;
  const rise = animate({ from: 0, to: 1, start: c + 0.2, end: c + 1.4, ease: Easing.easeOutCubic })(T);
  const spread = animate({ from: 0, to: 1, start: c + 1.2, end: c + 1.9, ease: Easing.easeOutBack })(T);
  const burst = MOTION.draw(T, c + 1.5, 0.7);
  const words = MOTION.enter(T, c + 2.0, 1.1);
  const fade = animate({ from: 0, to: 1, start: total - 0.55, end: total, ease: Easing.easeInQuad })(T);

  const hand = (side) => {
    const size = 400;
    const cx = W / 2 + side * (138 - rise * 18);
    const cy = 600 - rise * 80;
    const rot = side * (22 - rise * 12);
    return (
      <div style={{
        position: 'absolute',
        left: cx - size / 2, top: cy - size / 2,
        transform: `rotate(${rot}deg) scaleX(${side})`,
        transformOrigin: 'center'
      }}>
        <SnapSequence p={clamp(rise * 0.55 + spread * 0.45 + burst * 0.15, 0, 1)} size={size} />
      </div>
    );
  };

  return (
    <Shot from={c} to={total + 0.1}>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - fade }}>
        {hand(-1)}
        {hand(1)}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 250,
          textAlign: 'center', ...words
        }}>
          <div style={{
            fontFamily: FF.la, fontSize: 20, letterSpacing: 7,
            color: INK, opacity: 0.55
          }}>{G.meta.cohortEn}</div>
          <div style={{
            marginTop: 14, fontFamily: FF.kr, fontSize: 60, fontWeight: 700,
            color: INK, letterSpacing: -2, lineHeight: 1.2
          }}>
            이제, 여기서<br />다시 시작합니다
          </div>
          <div style={{
            marginTop: 20, fontFamily: FF.kr, fontSize: 26,
            color: INK, opacity: 0.6
          }}>{G.closing.sign}</div>
        </div>
      </div>
    </Shot>
  );
}

// ═══════ 러닝 워터마크 (항상 렌더) ═══════
function Watermark({ T, total }) {
  const inK = animate({ from: 0, to: 1, start: 0.4, end: 1.4, ease: Easing.easeOutCubic })(T);
  const outK = animate({ from: 0, to: 1, start: total - 0.5, end: total, ease: Easing.easeInQuad })(T);
  return (
    <div style={{
      position: 'absolute', top: 44, left: 0, right: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      opacity: (inK - outK) * 0.42
    }}>
      <span style={{ width: 22, height: 1, background: INK }} />
      <span style={{
        fontFamily: FF.la, fontSize: 15, letterSpacing: 6, color: INK
      }}>{G.meta.org}</span>
      <span style={{ width: 22, height: 1, background: INK }} />
    </div>
  );
}

// ═══════ 진행 게이지 ═══════
function Progress({ T, total }) {
  return (
    <div style={{
      position: 'absolute', bottom: 52, left: 58, right: 58,
      height: 1, background: 'rgba(26,26,24,0.14)'
    }}>
      <div style={{
        height: '100%', width: `${clamp(T / total, 0, 1) * 100}%`, background: INK
      }} />
    </div>
  );
}

// ═══════ 하나의 트리 ═══════
function Piece() {
  const { T, CUES, authoredTotal } = useComposition();
  return (
    <div data-screen-label={`${Math.floor(T)}s`} style={{
      position: 'absolute', inset: 0, background: PAPER, overflow: 'hidden'
    }}>
      <SceneSnap T={T} CUES={CUES} />
      <SceneTitle T={T} CUES={CUES} />
      <SceneBegin T={T} CUES={CUES} />
      <SceneLearn T={T} CUES={CUES} />
      <SceneTogether T={T} CUES={CUES} />
      <SceneTrial T={T} CUES={CUES} />
      <SceneNames T={T} CUES={CUES} />
      <SceneFinale T={T} CUES={CUES} total={authoredTotal} />
      <Watermark T={T} total={authoredTotal} />
      <Progress T={T} total={authoredTotal} />
    </div>
  );
}

function MonoApp() {
  const [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <>
      <CompositionStage
        width={W} height={H}
        scenes={window.OM_SCENES}
        playback={window.OM_PLAYBACK}
        bg={PAPER}>
        <Piece />
      </CompositionStage>
      <TweaksPanel title="Tweaks">
        <TweakSection title="편집">
          <TweakToggle label="Motion editor"
            value={tweaks.motionEditor}
            onChange={(v) => setTweak('motionEditor', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MonoApp />);
