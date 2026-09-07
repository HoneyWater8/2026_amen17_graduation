/* 방식 6 · 캐릭터 횡스크롤 여정 (Side-scroll Journey)
   캐릭터는 좌측 하단 고정 · 배경/랜드마크가 옆으로 지나감
   첫 화면: 자동 "아멘" → 터치 한 번으로 여정 시작 */

const { useState, useEffect, useRef } = React;
const G = window.GRAD;

const C = {
  bg: '#FBE05A', bgWarm: '#FFEE9C', bgSky: '#BFE6F5',
  ink: '#3A3226', inkSoft: '#7A6E5C',
  skin: '#F6C9C2', skinDk: '#E9B2AA',
  shirt: '#FFFFFF', shirtSh: '#E8E8E8',
  pants: '#3D6FA6', pantsDk: '#2E5A8A',
  hair: '#6B4A3A',
  green: '#7BC47F', greenDk: '#5FA968', red: '#EF6F5E', blue: '#5AA9E6',
  brown: '#B98D5F', gray: '#4A4A52'
};
const CF = {
  han: '"Black Han Sans", "Pretendard", sans-serif',
  sans: '"Pretendard", -apple-system, sans-serif'
};

const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, i0, i1) => cl((p - i0) / (i1 - i0));
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeBack = t => 1 + 2.2 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);

const SPAN = 9;          // 월드 길이 (화면 개수)
const CHAR_AT = 23;      // 캐릭터 좌측 위치 (%)
const FOCUS = 64;        // 랜드마크가 도착하는 위치 (%)

// ═══════════ 캐릭터 ═══════════
function Kid({ w = 120, armsUp = 0, walk = 0, blink = 0, cap = false,
  shirt = C.shirt, pants = C.pants, hair = C.hair }) {
  const swing = Math.sin(walk * Math.PI * 2);
  const down = 1 - armsUp;
  const bob = Math.abs(swing) * 2.2 * down;
  return (
    <svg width={w} height={w * 1.6} viewBox="0 0 100 160" style={{ display: 'block', overflow: 'visible' }}>
      <g transform={`translate(0 ${-bob})`}>
        {/* 다리 */}
        <g transform={`rotate(${swing * 22} 44 100)`}>
          <rect x="37" y="98" width="14" height="52" rx="7" fill={pants}/>
          <ellipse cx="44" cy="150" rx="9" ry="6" fill={pants}/>
        </g>
        <g transform={`rotate(${-swing * 22} 58 100)`}>
          <rect x="51" y="98" width="14" height="52" rx="7" fill={C.pantsDk}/>
          <ellipse cx="58" cy="150" rx="9" ry="6" fill={C.pantsDk}/>
        </g>

        {/* 뒤팔 (내린 상태) */}
        <g opacity={down} transform={`rotate(${-swing * 14 - 20} 70 76)`}>
          <rect x="64" y="72" width="13" height="42" rx="6.5" fill={C.skinDk}/>
        </g>

        {/* 몸통 */}
        <ellipse cx="50" cy="80" rx="31" ry="29" fill={shirt}/>
        <path d="M50 51 a31 29 0 0 1 31 29 a31 29 0 0 1 -8 20 a31 29 0 0 0 -23 -49 Z"
          fill={C.shirtSh} opacity="0.55"/>
        <path d="M25 95 q25 14 50 0 l0 8 q-25 12 -50 0 Z" fill={pants}/>

        {/* 앞팔 (내린 상태) */}
        <g opacity={down} transform={`rotate(${swing * 14 + 20} 30 76)`}>
          <rect x="23" y="72" width="13" height="42" rx="6.5" fill={C.skin}/>
        </g>

        {/* 머리 */}
        <circle cx="50" cy="34" r="20" fill={C.skin}/>
        <path d="M50 14 a20 20 0 0 1 20 20 a20 20 0 0 1 -3 10 a20 20 0 0 0 -17 -30 Z"
          fill={C.skinDk} opacity="0.4"/>
        <path d="M32 26 q2-16 18-16 q16 0 18 14 q-4-6 -12-7 q4 5 2 9 q-6-9 -18-6 q-6 2 -8 6 Z" fill={hair}/>
        <path d="M68 24 q6 2 5 10 q-1 5 -4 6 q2-9 -1-16 Z" fill={hair}/>
        <ellipse cx="43" cy="34" rx="2" ry={2 * (1 - blink)} fill={C.ink}/>
        <ellipse cx="55" cy="34" rx="2" ry={2 * (1 - blink)} fill={C.ink}/>
        <path d={armsUp > 0.5 ? 'M44 41 q6 8 12 0 q-6 5 -12 0 Z' : 'M45 41 q5 5 10 0'}
          stroke={C.ink} strokeWidth="1.6" fill={armsUp > 0.5 ? C.ink : 'none'} strokeLinecap="round"/>

        {/* 만세 팔 (위로 뻗음) — 별도 지오메트리 */}
        <g opacity={armsUp}>
          <g transform={`rotate(-26 30 76)`}>
            <rect x="23" y="22" width="13" height="56" rx="6.5" fill={C.skin}/>
          </g>
          <g transform={`rotate(26 70 76)`}>
            <rect x="64" y="22" width="13" height="56" rx="6.5" fill={C.skinDk}/>
          </g>
        </g>

        {/* 학사모 */}
        {cap && (
          <g>
            <path d="M50 8 L74 17 L50 26 L26 17 Z" fill={C.gray}/>
            <rect x="46" y="20" width="8" height="5" rx="1" fill={C.gray}/>
            <path d="M72 18 L72 30" stroke={C.red} strokeWidth="2"/>
            <circle cx="72" cy="31" r="2.5" fill={C.red}/>
          </g>
        )}
      </g>
    </svg>
  );
}

function MiniKid({ w = 44, i = 0, walk = 0 }) {
  const shirts = [C.shirt, '#FFE0E0', '#E0F0FF', '#E8F5E0', '#FFF3D6'];
  const pantsC = [C.pants, C.pantsDk, '#5A7FA8', '#2E5A8A'];
  const hairC = [C.hair, '#4A3428', '#8A6547', '#5C4033'];
  return <Kid w={w} walk={walk + i * 0.13}
    shirt={shirts[i % shirts.length]} pants={pantsC[i % pantsC.length]} hair={hairC[i % hairC.length]}/>;
}

// ═══════════ 말풍선 ═══════════
function Bubble({ text, show, size = 26 }) {
  const k = easeBack(cl(show));
  return (
    <div style={{
      position: 'absolute', left: '50%', bottom: '100%', marginBottom: 10,
      width: 'max-content', transform: `translateX(-50%) scale(${k})`,
      transformOrigin: 'bottom center', opacity: cl(show * 2), pointerEvents: 'none'
    }}>
      <div style={{
        position: 'relative', background: '#fff', color: C.ink,
        padding: '11px 20px', borderRadius: 999, whiteSpace: 'nowrap',
        fontFamily: CF.han, fontSize: size, letterSpacing: -1,
        boxShadow: '0 5px 0 rgba(0,0,0,0.10)'
      }}>
        {text}
        <span style={{
          position: 'absolute', left: '50%', bottom: -9, transform: 'translateX(-50%)',
          width: 0, height: 0, borderLeft: '9px solid transparent',
          borderRight: '9px solid transparent', borderTop: '10px solid #fff'
        }}/>
      </div>
    </div>
  );
}

// ═══════════ 배경 부품 ═══════════
function Cloud({ s = 1 }) {
  return (
    <svg width={70 * s} height={34 * s} viewBox="0 0 70 34">
      <ellipse cx="22" cy="22" rx="18" ry="12" fill="#fff"/>
      <ellipse cx="42" cy="18" rx="20" ry="14" fill="#fff"/>
      <ellipse cx="56" cy="24" rx="13" ry="9" fill="#fff"/>
    </svg>
  );
}
function Tree({ s = 1, tone = C.green }) {
  return (
    <svg width={44 * s} height={70 * s} viewBox="0 0 44 70">
      <rect x="19" y="40" width="6" height="30" rx="3" fill={C.brown}/>
      <circle cx="22" cy="26" r="18" fill={tone}/>
      <circle cx="12" cy="34" r="11" fill={tone} opacity="0.85"/>
      <circle cx="32" cy="34" r="11" fill={tone} opacity="0.85"/>
    </svg>
  );
}
function Bush({ s = 1 }) {
  return (
    <svg width={50 * s} height={26 * s} viewBox="0 0 50 26">
      <ellipse cx="14" cy="18" rx="13" ry="9" fill={C.greenDk}/>
      <ellipse cx="30" cy="15" rx="15" ry="11" fill={C.green}/>
      <ellipse cx="42" cy="19" rx="9" ry="7" fill={C.greenDk}/>
    </svg>
  );
}

// 패널 (랜드마크 공통 보드)
function Board({ children, bg = '#fff', color = C.ink, w = 250, tilt = 0 }) {
  return (
    <div style={{
      width: w, background: bg, color,
      border: `3px solid ${C.ink}`, borderRadius: 10, padding: '13px 15px',
      boxShadow: '0 6px 0 rgba(0,0,0,0.13)', transform: `rotate(${tilt}deg)`
    }}>{children}</div>
  );
}
function Post({ h = 46 }) {
  return <div style={{ width: 11, height: h, background: C.brown, borderRadius: 4, margin: '0 auto' }}/>;
}
function LmLabel({ children, color = C.red }) {
  return <div style={{
    fontFamily: CF.sans, fontSize: 9.5, fontWeight: 800, letterSpacing: 2, color
  }}>{children}</div>;
}

// ═══════════ 랜드마크들 ═══════════
function LmSign() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Board w={232}>
        <LmLabel>DATE</LmLabel>
        <div style={{ marginTop: 3, fontFamily: CF.han, fontSize: 25, letterSpacing: -1, whiteSpace: 'nowrap' }}>
          {G.when.dateDisplay}
        </div>
        <div style={{ marginTop: 1, fontFamily: CF.sans, fontSize: 11.5, color: C.inkSoft, fontWeight: 600 }}>
          {G.when.dayKo} · {G.when.time}
        </div>
      </Board>
      <div style={{ marginTop: 9 }}>
        <Board w={232} bg={C.blue} color="#fff" tilt={-2}>
          <LmLabel color="rgba(255,255,255,.85)">PLACE</LmLabel>
          <div style={{ marginTop: 2, fontFamily: CF.han, fontSize: 19, letterSpacing: -0.6 }}>
            {G.where.name}
          </div>
          <div style={{ marginTop: 1, fontFamily: CF.sans, fontSize: 11, fontWeight: 600, opacity: 0.92 }}>
            {G.where.detail}
          </div>
        </Board>
      </div>
      <Post h={54}/>
    </div>
  );
}

function LmTV({ near }) {
  const [cur, setCur] = useState(0);
  const v = G.videos[cur];
  return (
    <div style={{ textAlign: 'center' }}>
      {/* 안테나 */}
      <svg width="90" height="32" viewBox="0 0 90 34" style={{ display: 'block', margin: '0 auto -4px' }}>
        <path d="M45 34 L18 4" stroke={C.gray} strokeWidth="3" strokeLinecap="round"/>
        <path d="M45 34 L72 6" stroke={C.gray} strokeWidth="3" strokeLinecap="round"/>
        <circle cx="18" cy="4" r="4" fill={C.red}/>
        <circle cx="72" cy="6" r="4" fill={C.red}/>
      </svg>
      <div style={{
        width: 242, background: '#F2E4C8', border: `4px solid ${C.ink}`,
        borderRadius: 14, padding: 11, boxShadow: '0 8px 0 rgba(0,0,0,0.14)'
      }}>
        <div data-role="video-slot" data-video-key={v.key} style={{
          position: 'relative', width: '100%', aspectRatio: '4 / 3',
          background: near > 0.4 ? '#1A1A22' : '#8A8A94',
          border: `3px solid ${C.ink}`, borderRadius: 8, overflow: 'hidden',
          transition: 'background .35s ease'
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: near * 0.15, pointerEvents: 'none',
            background: 'repeating-linear-gradient(180deg,#fff 0 1px,transparent 1px 4px)'
          }}/>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center', opacity: cl((near - 0.4) / 0.4)
          }}>
            <div>
              <div style={{
                width: 44, height: 44, margin: '0 auto', borderRadius: '50%', background: C.red,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'chPulse 2.4s ease-in-out infinite'
              }}>
                <svg width="13" height="15" viewBox="0 0 18 20"><path d="M2 1 L17 10 L2 19 Z" fill="#fff"/></svg>
              </div>
              <div style={{
                marginTop: 8, fontFamily: CF.sans, fontSize: 9.5, fontWeight: 800,
                letterSpacing: 2, color: '#fff', opacity: 0.9
              }}>PLAY</div>
              <div style={{ marginTop: 2, fontFamily: CF.sans, fontSize: 9, color: '#fff', opacity: 0.5 }}>
                {G.videoNote}
              </div>
            </div>
          </div>
        </div>
        {/* 채널 */}
        <div className="gs-scroll" style={{ display: 'flex', gap: 5, overflowX: 'auto', marginTop: 9 }}>
          {G.videos.map((x, i) => (
            <button key={x.key} onClick={() => setCur(i)} style={{
              flex: '0 0 auto', padding: '5px 9px', cursor: 'pointer',
              background: i === cur ? C.ink : '#fff', color: i === cur ? '#fff' : C.ink,
              border: `2px solid ${C.ink}`, borderRadius: 999,
              fontFamily: CF.sans, fontSize: 9.5, fontWeight: 800, whiteSpace: 'nowrap'
            }}>{x.label}</button>
          ))}
        </div>
        <div style={{ marginTop: 6, fontFamily: CF.han, fontSize: 14, color: C.ink, letterSpacing: -0.4 }}>
          {v.sub}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 30px' }}>
        {[0, 1].map(i => <div key={i} style={{ width: 12, height: 16, background: C.ink, borderRadius: '0 0 5px 5px' }}/>)}
      </div>
    </div>
  );
}

function LmPhoto({ idx }) {
  const ph = G.photos[idx];
  const tints = [C.bgSky, '#FFE0DC', '#E4F5DE', '#FFF1CC'];
  return (
    <div style={{ textAlign: 'center' }} data-role="photo-slot" data-photo-index={idx}>
      <Board w={148} tilt={idx % 2 ? 2.5 : -2.5}>
        <div style={{
          aspectRatio: '4 / 3', borderRadius: 5, background: tints[idx % 4],
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontFamily: CF.han, fontSize: 16, color: C.ink, opacity: 0.35 }}>{ph.tag}</span>
        </div>
        <div style={{
          marginTop: 5, fontFamily: CF.sans, fontSize: 10, fontWeight: 700, color: C.ink
        }}>{ph.caption}</div>
      </Board>
      <Post h={40}/>
    </div>
  );
}

function LmMilestone({ idx }) {
  const t = G.timeline[idx];
  return (
    <div style={{ textAlign: 'center' }}>
      <Board w={176} bg={t.now ? C.red : '#fff'} color={t.now ? '#fff' : C.ink} tilt={idx % 2 ? 1.5 : -1.5}>
        <LmLabel color={t.now ? 'rgba(255,255,255,.9)' : C.blue}>{t.period}</LmLabel>
        <div style={{ marginTop: 2, fontFamily: CF.han, fontSize: 17, letterSpacing: -0.5 }}>{t.title}</div>
        <div style={{
          marginTop: 1, fontFamily: CF.sans, fontSize: 10.5, fontWeight: 600,
          color: t.now ? 'rgba(255,255,255,.9)' : C.inkSoft
        }}>{t.desc}</div>
      </Board>
      {/* 깃발 */}
      <svg width="26" height="46" viewBox="0 0 26 46" style={{ display: 'block', margin: '0 auto' }}>
        <rect x="11" y="0" width="3" height="46" rx="1.5" fill={C.brown}/>
        <path d="M14 3 L26 8 L14 14 Z" fill={t.now ? C.red : C.blue}/>
      </svg>
    </div>
  );
}

function LmCrowd({ near }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Board w={252}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
          <span style={{ fontFamily: CF.han, fontSize: 30, color: C.red, lineHeight: 1 }}>
            {G.roster.length}
          </span>
          <span style={{ fontFamily: CF.han, fontSize: 17, letterSpacing: -0.7 }}>명 졸업</span>
        </div>
        <div style={{
          marginTop: 7, display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 3
        }}>
          {G.roster.map((nm, i) => (
            <div key={i} style={{
              padding: '5px 0', textAlign: 'center', background: C.bgWarm,
              border: `1.5px solid ${C.ink}`, borderRadius: 4,
              fontFamily: CF.sans, fontSize: 9, fontWeight: 800, color: C.ink,
              letterSpacing: -0.4, whiteSpace: 'nowrap',
              opacity: cl(near * 3 - i * 0.02, 0, 1),
              transform: `scale(${lerp(0.82, 1, cl(near * 3 - i * 0.02))})`
            }}>{nm}</div>
          ))}
        </div>
      </Board>
      <div style={{ marginTop: 9 }}>
        <Board w={252} bg={C.blue} color="#fff" tilt={1.5}>
          <LmLabel color="rgba(255,255,255,.9)">WITH US IN HEART</LmLabel>
          <div style={{ marginTop: 1, fontFamily: CF.han, fontSize: 14, letterSpacing: -0.5, marginBottom: 7 }}>
            {G.awayNote}
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            {G.away.map((a, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                paddingBottom: 3,
                borderBottom: i < G.away.length - 1 ? '1px solid rgba(255,255,255,.32)' : 'none'
              }}>
                <span style={{ fontFamily: CF.sans, fontSize: 11.5, fontWeight: 800 }}>{a.name}</span>
                <span style={{ fontFamily: CF.sans, fontSize: 9.5, fontWeight: 700, opacity: 0.9 }}>{a.reason}</span>
              </div>
            ))}
          </div>
        </Board>
      </div>
    </div>
  );
}

function LmFinale({ near }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Board w={230} bg={C.bgWarm}>
        <LmLabel>Closing</LmLabel>
        <div style={{ marginTop: 6 }}>
          {G.closing.lines.map((l, i) => (
            <div key={i} style={{
              minHeight: l === '' ? 9 : 'auto',
              fontFamily: CF.sans, fontSize: 12.5, fontWeight: 600, lineHeight: 1.8,
              color: C.ink, opacity: cl(near * 1.6 - i * 0.08)
            }}>{l}</div>
          ))}
        </div>
        <div style={{
          marginTop: 12, paddingTop: 9, borderTop: `2px dashed ${C.ink}33`,
          fontFamily: CF.han, fontSize: 14, color: C.red, letterSpacing: -0.4
        }}>{G.closing.sign}</div>
      </Board>
    </div>
  );
}

// 랜드마크 배치 (at: 0~1 월드 위치)
const LANDMARKS = [
  { at: 0.04, y: 'mid',  render: () => <LmSign/> },
  { at: 0.12, y: 'mid',  render: (n) => <LmTV near={n}/> },
  { at: 0.22, y: 'high', render: () => <LmPhoto idx={0}/> },
  { at: 0.28, y: 'mid',  render: () => <LmPhoto idx={1}/> },
  { at: 0.34, y: 'high', render: () => <LmPhoto idx={2}/> },
  { at: 0.40, y: 'mid',  render: () => <LmPhoto idx={3}/> },
  { at: 0.46, y: 'high', render: () => <LmPhoto idx={4}/> },
  { at: 0.52, y: 'mid',  render: () => <LmPhoto idx={5}/> },
  { at: 0.58, y: 'low',  render: () => <LmMilestone idx={0}/> },
  { at: 0.63, y: 'top',  render: () => <LmMilestone idx={1}/> },
  { at: 0.68, y: 'low',  render: () => <LmMilestone idx={2}/> },
  { at: 0.73, y: 'top',  render: () => <LmMilestone idx={3}/> },
  { at: 0.78, y: 'low',  render: () => <LmMilestone idx={4}/> },
  { at: 0.83, y: 'top',  render: () => <LmMilestone idx={5}/> },
  { at: 0.91, y: 'panel', render: (n) => <LmCrowd near={n}/> },
  { at: 1.00, y: 'panel', render: (n) => <LmFinale near={n}/> }
];

// y 밴드 → bottom 값 / z-index
const Y_BAND = {
  low:   { bottom: '20%', z: 4 },
  mid:   { bottom: '24%', z: 4 },
  high:  { bottom: '38%', z: 3 },
  top:   { bottom: '46%', z: 3 },
  panel: { center: true, z: 9 }
};

// 배경 소품
const PROPS = [
  { at: 0.03, k: 'tree', s: 0.9 }, { at: 0.11, k: 'bush', s: 1 },
  { at: 0.16, k: 'tree', s: 0.7 }, { at: 0.26, k: 'bush', s: 0.8 },
  { at: 0.30, k: 'tree', s: 1 },   { at: 0.42, k: 'bush', s: 0.9 },
  { at: 0.48, k: 'tree', s: 0.8 }, { at: 0.55, k: 'bush', s: 1.1 },
  { at: 0.60, k: 'tree', s: 0.95 },{ at: 0.70, k: 'bush', s: 0.85 },
  { at: 0.75, k: 'tree', s: 0.75 },{ at: 0.83, k: 'bush', s: 1 },
  { at: 0.90, k: 'tree', s: 0.9 }, { at: 0.97, k: 'bush', s: 0.9 }
];
const CLOUDS = [
  { at: 0.02, top: '9%', s: 0.9 }, { at: 0.14, top: '16%', s: 0.7 },
  { at: 0.28, top: '7%', s: 1 },   { at: 0.44, top: '14%', s: 0.8 },
  { at: 0.58, top: '10%', s: 0.9 },{ at: 0.74, top: '18%', s: 0.75 },
  { at: 0.90, top: '8%', s: 1 }
];

// ═══════════ 인트로 오버레이 ═══════════
function Intro({ onStart, blink }) {
  const [t, setT] = useState(0);          // 0→1 자동 진행
  const [gone, setGone] = useState(false);
  useEffect(() => {
    let t0 = null;
    let raf;
    const tick = (now) => {
      if (t0 === null) t0 = now;          // 체러 보이는 순간부터 계산
      const k = cl((now - t0) / 1600);
      setT(k);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const rise = easeOut(seg(t, 0.12, 0.62));
  const say = seg(t, 0.42, 0.68);
  const title = easeOut(seg(t, 0.55, 0.9));
  const hint = easeOut(seg(t, 0.86, 1));

  const start = () => {
    if (gone) return;
    setGone(true);
    setTimeout(onStart, 520);
  };

  return (
    <div onClick={start} style={{
      position: 'absolute', inset: 0, zIndex: 60, cursor: 'pointer',
      background: C.bg, overflow: 'hidden',
      transform: gone ? 'translateX(-100%)' : 'none',
      transition: 'transform .52s cubic-bezier(.5,0,.3,1)'
    }}>
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: 290, height: 290, borderRadius: '50%', background: C.bgWarm, opacity: 0.7
      }}/>
      <div style={{ position: 'absolute', left: '7%', top: '11%' }}><Cloud s={0.9}/></div>
      <div style={{ position: 'absolute', right: '6%', top: '7%' }}><Cloud s={1.05}/></div>

      {/* 땅 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '20%' }}>
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path d="M0 6 Q100 -6 200 4 T400 0 L400 120 L0 120 Z" fill={C.green}/>
          <path d="M0 6 Q100 -6 200 4 T400 0 L400 16 Q300 8 200 20 T0 22 Z" fill="#fff" opacity="0.18"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', left: '4%', bottom: '17%' }}><Tree s={0.85}/></div>
      <div style={{ position: 'absolute', right: '5%', bottom: '16%' }}><Tree s={0.7} tone="#6BB472"/></div>

      {/* 전경 — flex 세로 분배 */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '30px 20px 82px'
      }}>
        <div style={{
          fontFamily: CF.sans, fontSize: 11, fontWeight: 800,
          letterSpacing: 3, color: C.inkSoft, opacity: 0.7
        }}>{G.meta.org}</div>

        <div style={{ flex: 1 }}/>

        {/* 캐릭터 */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Bubble text="아멘!" show={say} size={28}/>
          <Kid w={118} armsUp={rise} blink={blink}/>
        </div>

        {/* 타이틀 */}
        <div style={{
          marginTop: 6, textAlign: 'center', flexShrink: 0,
          opacity: title, transform: `translateY(${(1 - title) * 20}px)`
        }}>
          <div style={{
            fontFamily: CF.han, fontSize: 33, lineHeight: 1.12, color: C.ink,
            letterSpacing: -1.5, textShadow: '0 2px 0 rgba(255,255,255,.55)'
          }}>
            아멘 제자 <span style={{ color: C.red }}>17기</span><br/>졸업합니다
          </div>
          <div style={{
            marginTop: 11, display: 'inline-block', padding: '8px 18px', background: '#fff',
            borderRadius: 999, fontFamily: CF.han, fontSize: 14, color: C.ink,
            boxShadow: '0 5px 0 rgba(0,0,0,0.09)'
          }}>{G.when.dateDisplay} · {G.when.dateLabel}</div>
        </div>
      </div>

      {/* 시작 힌트 */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 22, textAlign: 'center',
        opacity: hint
      }}>
        <button onClick={(e) => { e.stopPropagation(); start(); }} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          padding: '11px 22px', background: C.ink, color: C.bg, border: 'none',
          borderRadius: 999, fontFamily: CF.han, fontSize: 14, letterSpacing: -0.3,
          animation: 'chBob 1.8s ease-in-out infinite'
        }}>
          화면을 눌러 시작
          <svg width="15" height="13" viewBox="0 0 15 13">
            <path d="M1 6.5 H12 M8 2 L12.5 6.5 L8 11" stroke={C.bg} strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ═══════════ 메인 ═══════════
function CharacterApp() {
  const rootRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [p, setP] = useState(0);
  const [blink, setBlink] = useState(0);

  // 깜빡임
  useEffect(() => {
    let t;
    const loop = () => {
      setBlink(1);
      setTimeout(() => setBlink(0), 130);
      t = setTimeout(loop, 2600 + Math.random() * 2200);
    };
    t = setTimeout(loop, 1600);
    return () => clearTimeout(t);
  }, []);

  // 스크롤 → 월드 진행도
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    const calc = () => {
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? el.scrollTop / max : 0);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(calc); };
    el.addEventListener('scroll', onScroll, { passive: true });
    calc();
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const walk = p * SPAN * 5.4;                      // 걸음 위상
  const isEnd = p > 0.985;
  const capOn = p > 0.955;
  const groundShift = -(p * SPAN * 100 * 1.15) % 40;

  return (
    <div style={{
      position: 'relative', width: '100%', maxWidth: 460, height: '100dvh',
      margin: '0 auto', overflow: 'hidden', boxShadow: '0 0 60px rgba(0,0,0,.25)',
      background: C.bg
    }}>
      {/* 진행 게이지 */}
      {started && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: 'rgba(58,50,38,.12)', zIndex: 50, pointerEvents: 'none'
        }}>
          <div style={{ height: '100%', width: `${p * 100}%`, background: C.red }}/>
        </div>
      )}

      {/* 월드 — 스크롤 컨테이너 새 sticky */}
      <div ref={rootRef} className="gs-scroll" style={{
        position: 'absolute', inset: 0,
        overflowY: started ? 'auto' : 'hidden', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch'
      }}>
        <div style={{ height: `${SPAN * 150}vh`, position: 'relative' }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* 하늘 그라데이션 — 진행에 따라 낮→노을 */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg,
            ${p > 0.8 ? '#FFD08A' : C.bgSky} 0%,
            ${p > 0.8 ? '#FFE7B0' : C.bgWarm} 46%,
            ${C.bg} 100%)`,
          transition: 'background .6s linear'
        }}/>

        {/* 구름 (느린 패럴랙스) */}
        {CLOUDS.map((c, i) => {
          const x = (c.at - p) * SPAN * 100 * 0.34 + FOCUS + 20;
          if (x < -30 || x > 130) return null;
          return (
            <div key={i} style={{ position: 'absolute', left: `${x}%`, top: c.top, opacity: 0.9 }}>
              <Cloud s={c.s}/>
            </div>
          );
        })}

        {/* 원경 언덕 */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: '26%', height: 90, overflow: 'hidden' }}>
          <svg viewBox="0 0 800 90" preserveAspectRatio="none" style={{
            width: '200%', height: '100%',
            transform: `translateX(${-(p * SPAN * 100 * 0.22) % 50}%)`
          }}>
            <path d="M0 90 Q60 34 130 62 Q200 20 280 58 Q350 28 420 66 Q490 30 560 60 Q640 26 720 64 Q770 44 800 58 L800 90 Z"
              fill="#9FD8A6" opacity="0.75"/>
          </svg>
        </div>

        {/* 나무/수풀 (빠른 패럴랙스) */}
        {PROPS.map((q, i) => {
          const x = (q.at - p) * SPAN * 100 * 1.05 + FOCUS;
          if (x < -25 || x > 125) return null;
          return (
            <div key={i} style={{
              position: 'absolute', left: `${x}%`, bottom: q.k === 'tree' ? '23%' : '20%'
            }}>
              {q.k === 'tree' ? <Tree s={q.s}/> : <Bush s={q.s}/>}
            </div>
          );
        })}

        {/* 랜드마크 */}
        {LANDMARKS.map((lm, i) => {
          const x = (lm.at - p) * SPAN * 100 + FOCUS;
          if (x < -70 || x > 170) return null;
          const near = cl(1 - Math.abs(x - FOCUS) / 55);
          const band = Y_BAND[lm.y] || Y_BAND.mid;
          return (
            <div key={i} style={{
              position: 'absolute', left: `${x}%`,
              ...(band.center
                ? { top: '50%', transform: 'translate(-50%, -50%)' }
                : { bottom: band.bottom, transform: 'translateX(-50%)' }),
              zIndex: band.z,
              opacity: cl(0.25 + near * 0.75)
            }}>
              {lm.render(near)}
            </div>
          );
        })}

        {/* 군중 (마지막 구간, 캐릭터 뒤) */}
        {p > 0.87 && (
          <div style={{
            position: 'absolute', left: `${(0.91 - p) * SPAN * 100 + FOCUS - 6}%`,
            bottom: '17%', display: 'flex', alignItems: 'flex-end', zIndex: 2
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ marginLeft: i ? -10 : 0 }}>
                <MiniKid w={42} i={i} walk={walk * 0.9 + i * 0.16}/>
              </div>
            ))}
          </div>
        )}

        {/* 땅 */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '22%' }}>
          <svg viewBox="0 0 400 90" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <rect y="0" width="400" height="90" fill={C.green}/>
            <rect y="0" width="400" height="7" fill="#fff" opacity="0.2"/>
          </svg>
          {/* 흐르는 길 표식 */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: '42%', height: 5, overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex', gap: 22, transform: `translateX(${groundShift}px)`, width: '200%'
            }}>
              {Array.from({ length: 40 }).map((_, i) => (
                <span key={i} style={{
                  flex: '0 0 18px', height: 5, borderRadius: 3,
                  background: '#fff', opacity: 0.42
                }}/>
              ))}
            </div>
          </div>
        </div>

        {/* 캐릭터 — 좌측 하단 고정 */}
        <div style={{
          position: 'absolute', left: `${CHAR_AT}%`, bottom: '16%',
          transform: 'translateX(-50%)', zIndex: 6
        }}>
          <div style={{ position: 'relative' }}>
            <Bubble text="졸업!" show={isEnd ? 1 : 0} size={22}/>
            <Kid w={112} walk={isEnd ? 0 : walk} armsUp={isEnd ? 1 : 0}
              blink={blink} cap={capOn}/>
          </div>
        </div>

        {/* 컨페티 */}
        {p > 0.93 && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 7 }}>
            {Array.from({ length: 26 }).map((_, i) => (
              <span key={i} style={{
                position: 'absolute', left: `${(i * 37) % 100}%`, top: '-6%',
                width: 5 + ((i * 13) % 5), height: 4,
                background: [C.red, C.blue, C.green, '#FFD34E', '#C98BE0'][i % 5],
                animation: `chFall ${2.4 + ((i * 7) % 12) / 10}s linear ${(i * 0.17) % 2}s infinite`
              }}/>
            ))}
          </div>
        )}

        {/* 스크롤 힌트 */}
        {started && p < 0.03 && (
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center', zIndex: 20
          }}>
            <div style={{
              display: 'inline-block', padding: '6px 14px', background: 'rgba(58,50,38,.82)',
              color: C.bg, borderRadius: 999, fontFamily: CF.sans, fontSize: 11, fontWeight: 800,
              letterSpacing: 1, animation: 'chBob 1.8s ease-in-out infinite'
            }}>스크롤하면 길을 걸어갑니다 ↓</div>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* 인트로 */}
      {!started && <Intro onStart={() => setStarted(true)} blink={blink}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CharacterApp />);
