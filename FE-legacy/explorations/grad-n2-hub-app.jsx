/* 방식 2 · 허브형 (Hub) — 애니버서리 스킨
   중앙 엠블럼 + 하단 메뉴 → 패널 오버레이 진입 */

const { useState, useEffect, useRef } = React;
const G = window.GRAD;

const H = {
  bg: '#071426', bg2: '#0C2340', bg3: '#123456',
  teal: '#7FE9E0', tealDim: '#3FA9A2',
  gold: '#FFD98A', goldDeep: '#C9A24B',
  cream: '#EAF4F6', line: 'rgba(127,233,224,0.28)'
};
const HF = {
  cinzel: '"Cinzel", serif',
  han: '"Black Han Sans", "Pretendard", sans-serif',
  serif: '"Gowun Batang", serif',
  sans: '"Pretendard", -apple-system, sans-serif'
};

function HbMotes({ n = 20 }) {
  const pts = React.useMemo(() => Array.from({ length: n }, (_, i) => ({
    x: (i * 41) % 100, y: (i * 67) % 100,
    s: 1.5 + ((i * 17) % 4) * 0.7, d: (i * 0.53) % 5, dur: 6 + ((i * 7) % 5)
  })), [n]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pts.map((p, i) => (
        <span key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: p.s, height: p.s, borderRadius: '50%',
          background: i % 3 === 0 ? H.gold : H.teal,
          boxShadow: `0 0 ${p.s * 3}px ${i % 3 === 0 ? H.gold : H.teal}`,
          animation: `hbFloat ${p.dur}s ease-in-out ${p.d}s infinite`
        }} />
      ))}
    </div>
  );
}

function HbDiamond({ size = 9, color = H.gold, filled = true }) {
  return <svg width={size} height={size} viewBox="0 0 10 10">
    <path d="M5 0 L10 5 L5 10 L0 5Z" fill={filled ? color : 'none'} stroke={color} strokeWidth={filled ? 0 : 1}/>
  </svg>;
}

function HbDivider({ w = '100%' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: w, margin: '14px auto' }}>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg,transparent,${H.teal}88)` }} />
      <HbDiamond size={7} color={H.teal} filled={false} />
      <HbDiamond size={9} color={H.gold} />
      <HbDiamond size={7} color={H.teal} filled={false} />
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${H.teal}88,transparent)` }} />
    </div>
  );
}

function HbPanelBox({ children, pad = 16, tone = 'teal', glow = false }) {
  const c = tone === 'gold' ? H.gold : H.teal;
  return (
    <div style={{
      position: 'relative', padding: pad,
      background: 'linear-gradient(160deg, rgba(127,233,224,.07), rgba(12,35,64,.5))',
      border: `1px solid ${c}44`,
      boxShadow: glow ? `0 0 28px ${c}22, inset 0 0 24px ${c}0d` : `inset 0 0 20px ${c}0a`
    }}>
      {[[0,0],[1,0],[0,1],[1,1]].map(([x,y],i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" style={{
          position: 'absolute', [x ? 'right' : 'left']: -1, [y ? 'bottom' : 'top']: -1,
          transform: `scale(${x ? -1 : 1},${y ? -1 : 1})`
        }}>
          <path d="M0 5 L0 0 L5 0" stroke={c} strokeWidth="1.4" fill="none"/>
          <path d="M6 .5 L.5 6" stroke={c} strokeWidth=".8" fill="none" opacity=".55"/>
        </svg>
      ))}
      {children}
    </div>
  );
}

// ── 메뉴 아이콘 ──
const HB_ICONS = {
  when: <><rect x="4" y="6" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M4 10 H20 M8 4 V7 M16 4 V7" stroke="currentColor" strokeWidth="1.4"/></>,
  video: <><rect x="3" y="6" width="14" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M17 10 L21 7 V17 L17 14 Z" fill="currentColor"/></>,
  photos: <><rect x="3" y="5" width="18" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4"/><circle cx="8.5" cy="10" r="1.8" fill="currentColor"/><path d="M4 17 L10 12 L14 15 L17 13 L20 16" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
  time: <><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M12 7 V12 L16 14" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
  roster: <><circle cx="9" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M3 20 c0-4 3-6 6-6 s6 2 6 6" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M16 7 h5 M16 11 h5 M16 15 h5" stroke="currentColor" strokeWidth="1.3"/></>,
  close: <><path d="M12 20 s-7-4.5-7-9.5 a4 4 0 0 1 7-2.5 a4 4 0 0 1 7 2.5 c0 5-7 9.5-7 9.5z" fill="none" stroke="currentColor" strokeWidth="1.4"/></>
};

// ── 패널 내용 ──
function HbWhen() {
  return (
    <>
      <div style={{ display: 'grid', gap: 12 }}>
        {[
          { en: 'DATE', ko: G.when.dateDisplay, sub: `${G.when.dayKo} · ${G.when.time}`, tone: 'gold' },
          { en: 'PLACE', ko: G.where.name, sub: G.where.detail, tone: 'teal' }
        ].map((r, i) => (
          <HbPanelBox key={i} tone={r.tone} glow>
            <div style={{ fontFamily: HF.cinzel, fontSize: 10, letterSpacing: 3.5, color: r.tone === 'gold' ? H.gold : H.teal }}>{r.en}</div>
            <div style={{ marginTop: 7, fontFamily: HF.han, fontSize: 24, color: H.cream, letterSpacing: -0.6 }}>{r.ko}</div>
            <div style={{ marginTop: 4, fontFamily: HF.sans, fontSize: 12, color: H.cream, opacity: 0.62 }}>{r.sub}</div>
          </HbPanelBox>
        ))}
      </div>
      <div style={{ marginTop: 12, textAlign: 'center', fontFamily: HF.sans, fontSize: 11, color: H.cream, opacity: 0.5 }}>
        {G.when.note}
      </div>
    </>
  );
}

function HbVideo() {
  const [cur, setCur] = useState(0);
  const v = G.videos[cur];
  return (
    <>
      <div style={{ fontFamily: HF.sans, fontSize: 12.5, color: H.cream, opacity: 0.78, lineHeight: 1.7, textAlign: 'center', marginBottom: 14 }}>
        {G.videoIntro}
      </div>
      <div className="gs-scroll" style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 12 }}>
        {G.videos.map((x, i) => {
          const on = i === cur;
          return (
            <button key={x.key} onClick={() => setCur(i)} style={{
              flex: '0 0 auto', padding: '8px 14px', cursor: 'pointer',
              background: on ? `linear-gradient(90deg,${H.goldDeep},${H.gold})` : 'rgba(127,233,224,.07)',
              color: on ? H.bg : H.cream,
              border: `1px solid ${on ? H.gold : H.line}`,
              fontFamily: HF.sans, fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap',
              boxShadow: on ? `0 0 18px ${H.gold}55` : 'none'
            }}>{x.label}</button>
          );
        })}
      </div>
      <HbPanelBox pad={7} tone="teal" glow>
        <div data-role="video-slot" data-video-key={v.key} style={{
          position: 'relative', width: '100%', aspectRatio: '9 / 16', maxHeight: 400,
          background: `radial-gradient(circle at 50% 40%, ${H.bg3}, #030A14 78%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
        }}>
          <div style={{ textAlign: 'center', padding: 18 }}>
            <div style={{ width: 60, height: 60, margin: '0 auto', position: 'relative', animation: 'hbPulse 2.6s ease-in-out infinite' }}>
              <svg viewBox="0 0 64 64" style={{ position: 'absolute', inset: 0 }}>
                <circle cx="32" cy="32" r="30" fill="none" stroke={H.teal} strokeWidth="1" opacity=".6"/>
                {[0,1,2,3].map(i => <path key={i} d="M32 0 L35 5 L32 10 L29 5Z" fill={H.gold} transform={`rotate(${i*90} 32 32)`}/>)}
                <path d="M25 20 L45 32 L25 44 Z" fill={H.gold}/>
              </svg>
            </div>
            <div style={{ marginTop: 14, fontFamily: HF.cinzel, fontSize: 11, letterSpacing: 4, color: H.teal }}>PLAY</div>
            <div style={{ marginTop: 5, fontFamily: HF.sans, fontSize: 11, color: H.cream, opacity: 0.45 }}>{G.videoNote}</div>
          </div>
        </div>
      </HbPanelBox>
      <div style={{ marginTop: 13, textAlign: 'center' }}>
        <div style={{ fontFamily: HF.han, fontSize: 20, color: H.gold, letterSpacing: -0.5, textShadow: `0 0 18px ${H.gold}44` }}>{v.sub}</div>
        <div style={{ marginTop: 4, fontFamily: HF.sans, fontSize: 12, color: H.cream, opacity: 0.68, lineHeight: 1.6 }}>{v.desc}</div>
        <div style={{ marginTop: 5, fontFamily: HF.cinzel, fontSize: 10.5, letterSpacing: 2.5, color: H.teal }}>{v.dur}</div>
      </div>
    </>
  );
}

function HbPhotos() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {G.photos.map((p, i) => (
        <div key={i} data-role="photo-slot" data-photo-index={i}>
          <HbPanelBox pad={5} tone={i % 3 === 0 ? 'gold' : 'teal'}>
            <div style={{
              aspectRatio: '4 / 3',
              background: `radial-gradient(circle at 50% 45%, ${H.bg3}55, ${H.bg} 80%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ fontFamily: HF.cinzel, fontSize: 20, letterSpacing: 2, color: i % 3 === 0 ? H.gold : H.teal, opacity: 0.45 }}>
                {p.tag}
              </div>
            </div>
            <div style={{ marginTop: 5, fontFamily: HF.sans, fontSize: 10.5, color: H.cream, opacity: 0.72, textAlign: 'center' }}>
              {p.caption}
            </div>
          </HbPanelBox>
        </div>
      ))}
    </div>
  );
}

function HbTimeline() {
  return (
    <div style={{ position: 'relative', paddingLeft: 28 }}>
      <div style={{ position: 'absolute', left: 7, top: 10, bottom: 10, width: 1.5, background: `linear-gradient(${H.gold},${H.teal} 45%,${H.teal}22)` }} />
      {G.timeline.map((t, i) => (
        <div key={i} style={{ position: 'relative', padding: '11px 0' }}>
          <div style={{ position: 'absolute', left: -28, top: 16, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              transform: 'rotate(45deg)', width: 11, height: 11,
              background: t.now ? H.gold : H.bg,
              border: `1.3px solid ${t.now ? H.gold : H.teal}`,
              boxShadow: t.now ? `0 0 16px ${H.gold}88` : 'none'
            }} />
          </div>
          <div style={{ fontFamily: HF.cinzel, fontSize: 10.5, letterSpacing: 2.5, color: t.now ? H.gold : H.teal }}>{t.period}</div>
          <div style={{ marginTop: 3, fontFamily: HF.han, fontSize: 19, color: H.cream, letterSpacing: -0.5 }}>{t.title}</div>
          <div style={{ marginTop: 2, fontFamily: HF.sans, fontSize: 11.5, color: H.cream, opacity: 0.62, lineHeight: 1.55 }}>{t.desc}</div>
        </div>
      ))}
    </div>
  );
}

function HbRoster() {
  return (
    <>
      <HbPanelBox pad={14} tone="gold" glow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {G.roster.map((n, i) => (
            <div key={i} style={{
              padding: '10px 3px', textAlign: 'center',
              background: 'rgba(127,233,224,.06)', border: `1px solid ${H.line}`,
              fontFamily: HF.sans, fontSize: 12.5, fontWeight: 700, color: H.cream
            }}>{n}</div>
          ))}
        </div>
      </HbPanelBox>
      <div style={{ marginTop: 18 }}>
        <HbPanelBox pad={14} tone="teal" glow>
          <div style={{ fontFamily: HF.cinzel, fontSize: 10, letterSpacing: 3.5, color: H.gold, textAlign: 'center' }}>
            WITH US IN HEART
          </div>
          <div style={{ marginTop: 5, fontFamily: HF.han, fontSize: 17, color: H.cream, letterSpacing: -0.5, textAlign: 'center' }}>
            {G.awayNote}
          </div>
          <HbDivider w="60%" />
          <div style={{ display: 'grid', gap: 9 }}>
            {G.away.map((a, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingBottom: 8, borderBottom: i < G.away.length - 1 ? `1px solid ${H.line}` : 'none'
              }}>
                <span style={{ fontFamily: HF.sans, fontSize: 13, fontWeight: 700, color: H.cream }}>{a.name}</span>
                <span style={{ fontFamily: HF.cinzel, fontSize: 10.5, letterSpacing: 1.5, color: H.gold }}>{a.reason}</span>
              </div>
            ))}
          </div>
        </HbPanelBox>
      </div>
      <div style={{ marginTop: 10, textAlign: 'center', fontFamily: HF.sans, fontSize: 10.5, color: H.cream, opacity: 0.45 }}>
        {G.rosterNote}
      </div>
    </>
  );
}

function HbClosing() {
  return (
    <>
      <div style={{ fontFamily: HF.serif, fontSize: 15, lineHeight: 2, color: H.cream, opacity: 0.92, textAlign: 'center' }}>
        {G.closing.lines.map((l, i) => (
          <div key={i} style={{ minHeight: l === '' ? 12 : 'auto' }}>{l}</div>
        ))}
      </div>
      <HbDivider w="60%" />
      <div style={{ fontFamily: HF.han, fontSize: 17, color: H.gold, textAlign: 'center', letterSpacing: -0.5, textShadow: `0 0 18px ${H.gold}44` }}>
        {G.closing.sign}
      </div>
    </>
  );
}

const HB_MENU = [
  { key: 'when',   icon: 'when',   ko: '일시·장소', en: 'SCHEDULE',  render: () => <HbWhen /> },
  { key: 'video',  icon: 'video',  ko: '간증 영상', en: 'FEATURE',   render: () => <HbVideo />, hero: true },
  { key: 'photos', icon: 'photos', ko: '순간들',   en: 'MEMORIES',  render: () => <HbPhotos /> },
  { key: 'time',   icon: 'time',   ko: '여정',     en: 'JOURNEY',   render: () => <HbTimeline /> },
  { key: 'roster', icon: 'roster', ko: '졸업생',   en: 'GRADUATES', render: () => <HbRoster /> },
  { key: 'close',  icon: 'close',  ko: '맺는 말',  en: 'CLOSING',   render: () => <HbClosing /> }
];

function HubApp() {
  const [open, setOpen] = useState(null);
  const item = HB_MENU.find(m => m.key === open);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{
      position: 'relative', width: '100%', maxWidth: 460, height: '100dvh',
      margin: '0 auto', overflow: 'hidden',
      background: `linear-gradient(180deg, ${H.bg} 0%, ${H.bg2} 46%, ${H.bg} 100%)`,
      boxShadow: '0 0 70px rgba(0,0,0,.6)'
    }}>
      <HbMotes n={24} />
      {/* 광원 */}
      <div style={{
        position: 'absolute', top: -160, left: '50%', transform: 'translateX(-50%)',
        width: 520, height: 520, pointerEvents: 'none',
        background: `radial-gradient(circle, ${H.teal}22 0%, ${H.gold}0f 40%, transparent 70%)`
      }} />

      {/* 허브 */}
      <div style={{
        position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '40px 20px 24px'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px',
          border: `1px solid ${H.line}`, background: 'rgba(127,233,224,.06)'
        }}>
          <HbDiamond size={7} />
          <span style={{ fontFamily: HF.cinzel, fontSize: 10, letterSpacing: 3.5, color: H.teal }}>{G.meta.org}</span>
          <HbDiamond size={7} />
        </div>

        {/* 엠블럼 */}
        <div style={{ position: 'relative', width: 200, height: 200, marginTop: 22 }}>
          <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, animation: 'hbSpin 30s linear infinite' }}>
            <circle cx="100" cy="100" r="96" fill="none" stroke={H.teal} strokeWidth=".7" strokeDasharray="3 7" opacity=".5"/>
            {Array.from({ length: 12 }).map((_, i) => (
              <path key={i} d="M100 4 L104 13 L100 22 L96 13Z" fill={i % 3 === 0 ? H.gold : H.teal}
                opacity={i % 3 === 0 ? 0.9 : 0.45} transform={`rotate(${i * 30} 100 100)`}/>
            ))}
          </svg>
          <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, animation: 'hbSpinRev 44s linear infinite' }}>
            <circle cx="100" cy="100" r="80" fill="none" stroke={H.gold} strokeWidth=".6" strokeDasharray="1 5" opacity=".6"/>
          </svg>
          <div style={{
            position: 'absolute', inset: 38, borderRadius: '50%',
            background: `radial-gradient(circle at 40% 32%, ${H.bg3}, ${H.bg} 72%)`,
            border: `1px solid ${H.gold}77`,
            boxShadow: `0 0 34px ${H.teal}33, inset 0 0 26px ${H.teal}1a`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1
          }}>
            <div style={{ fontFamily: HF.cinzel, fontSize: 9.5, letterSpacing: 3, color: H.teal }}>AMEN</div>
            <div style={{ fontFamily: HF.han, fontSize: 44, lineHeight: 1, color: H.gold, textShadow: `0 0 20px ${H.gold}66` }}>17</div>
            <div style={{ fontFamily: HF.cinzel, fontSize: 8, letterSpacing: 2.5, color: H.teal, opacity: 0.85 }}>DISCIPLE</div>
          </div>
        </div>

        <div style={{ marginTop: 18, fontFamily: HF.cinzel, fontSize: 11.5, letterSpacing: 6, color: H.gold }}>
          GRADUATION {G.meta.year}
        </div>
        <div style={{
          marginTop: 6, fontFamily: HF.han, fontSize: 34, lineHeight: 1.1, color: H.cream,
          letterSpacing: -1.2, textAlign: 'center', textShadow: `0 0 30px ${H.teal}55`
        }}>
          아멘 <span style={{ color: H.teal }}>17기</span><br/>졸업을 축하합니다
        </div>
        <div style={{
          marginTop: 12, fontFamily: HF.serif, fontSize: 13, color: H.cream,
          opacity: 0.78, textAlign: 'center', fontWeight: 700
        }}>{G.meta.tagline}</div>

        <div style={{ flex: 1 }} />

        {/* 리본 */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18 }}>
          <div style={{
            padding: '9px 24px', background: `linear-gradient(90deg,${H.goldDeep},${H.gold},${H.goldDeep})`,
            color: H.bg, fontFamily: HF.han, fontSize: 14, letterSpacing: -0.3,
            boxShadow: `0 0 24px ${H.gold}44`
          }}>{G.when.dateDisplay} · {G.when.dateLabel}</div>
          {[-1, 1].map(s => (
            <span key={s} style={{
              position: 'absolute', top: 0, bottom: 0, [s < 0 ? 'left' : 'right']: -9, width: 10,
              background: H.goldDeep,
              clipPath: s < 0 ? 'polygon(100% 0,100% 100%,0 50%)' : 'polygon(0 0,0 100%,100% 50%)'
            }} />
          ))}
        </div>

        {/* 하단 메뉴 */}
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6 }}>
          {HB_MENU.map(m => (
            <button key={m.key} onClick={() => setOpen(m.key)} style={{
              position: 'relative', padding: '10px 2px 8px', cursor: 'pointer',
              background: m.hero ? `linear-gradient(180deg,${H.gold}22,rgba(127,233,224,.05))` : 'rgba(127,233,224,.05)',
              border: `1px solid ${m.hero ? H.gold : H.line}`,
              color: m.hero ? H.gold : H.teal,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              boxShadow: m.hero ? `0 0 16px ${H.gold}33` : 'none'
            }}>
              <svg width="21" height="21" viewBox="0 0 24 24">{HB_ICONS[m.icon]}</svg>
              <span style={{
                fontFamily: HF.sans, fontSize: 9, fontWeight: 700,
                color: m.hero ? H.gold : H.cream, opacity: m.hero ? 1 : 0.8,
                whiteSpace: 'nowrap'
              }}>{m.ko}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 패널 오버레이 */}
      {item && (
        <div onClick={() => setOpen(null)} style={{
          position: 'absolute', inset: 0, zIndex: 90,
          background: 'rgba(3,10,20,.72)', backdropFilter: 'blur(5px)',
          animation: 'hbFadeIn .25s ease-out',
          display: 'flex', alignItems: 'flex-end'
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            position: 'relative', width: '100%', maxHeight: '88%',
            background: `linear-gradient(180deg, ${H.bg2}, ${H.bg})`,
            borderTop: `1.5px solid ${H.gold}`,
            boxShadow: `0 -10px 44px ${H.teal}22`,
            animation: 'hbSlideUp .38s cubic-bezier(.22,1,.36,1)',
            display: 'flex', flexDirection: 'column'
          }}>
            {/* 패널 헤더 */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '16px 18px 12px', borderBottom: `1px solid ${H.line}`
            }}>
              <span style={{ color: H.gold, display: 'flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24">{HB_ICONS[item.icon]}</svg>
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: HF.cinzel, fontSize: 9.5, letterSpacing: 3, color: H.teal }}>{item.en}</div>
                <div style={{ fontFamily: HF.han, fontSize: 20, color: H.cream, letterSpacing: -0.6 }}>{item.ko}</div>
              </div>
              <button onClick={() => setOpen(null)} aria-label="close" style={{
                width: 32, height: 32, border: `1px solid ${H.line}`, background: 'transparent',
                cursor: 'pointer', color: H.cream, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="13" height="13" viewBox="0 0 14 14">
                  <path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
            {/* 패널 본문 */}
            <div className="gs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 26px' }}>
              {item.render()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<HubApp />);
