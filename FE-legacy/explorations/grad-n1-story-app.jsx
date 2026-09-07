/* 방식 1 · 스토리형 (Story) — 시상식 스킨
   상단 진행바 · 탭으로 이동 · 자동 진행 */

const { useState, useEffect, useRef, useCallback } = React;
const G = window.GRAD;

const S = {
  bg: '#0A0A10', bg2: '#14141E', panel: 'rgba(255,255,255,0.05)',
  gold: '#F0C24B', goldLt: '#FFE7A8', cream: '#EDE7DA',
  carpet: '#8E1A2C', line: 'rgba(240,194,75,0.24)'
};
const SF = {
  han: '"Black Han Sans", "Pretendard", sans-serif',
  bebas: '"Bebas Neue", sans-serif',
  sans: '"Pretendard", -apple-system, sans-serif'
};

function StStars({ n = 16 }) {
  const pts = React.useMemo(() => Array.from({ length: n }, (_, i) => ({
    x: (i * 37) % 100, y: (i * 61) % 100,
    s: 1 + ((i * 13) % 3) * 0.6, d: (i * 0.37) % 3.2
  })), [n]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pts.map((p, i) => (
        <span key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: p.s, height: p.s, borderRadius: '50%', background: S.goldLt,
          animation: `stTwinkle 3.2s ease-in-out ${p.d}s infinite`
        }} />
      ))}
    </div>
  );
}

function StSpot({ top = -120, size = 480, op = 0.18 }) {
  return <div style={{
    position: 'absolute', top, left: '50%', width: size, height: size,
    transform: 'translateX(-50%)', pointerEvents: 'none',
    background: `radial-gradient(circle, ${S.gold}${Math.round(op * 255).toString(16).padStart(2, '0')} 0%, transparent 68%)`
  }} />;
}

// 화면 공통 셸
function StScreen({ children, label, no, total, spot = true, stars = 14 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      padding: '74px 22px 66px', overflow: 'hidden',
      animation: 'stFadeIn .5s ease-out'
    }}>
      {spot && <StSpot />}
      <StStars n={stars} />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
          <span style={{ fontFamily: SF.bebas, fontSize: 12, letterSpacing: 3, color: S.gold }}>
            {String(no).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${S.gold},transparent)` }} />
          <span style={{ fontFamily: SF.bebas, fontSize: 11, letterSpacing: 3, color: S.gold, opacity: 0.8 }}>
            {label}
          </span>
        </div>
        <div className="gs-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function StTitle({ children, size = 36 }) {
  return <div style={{
    fontFamily: SF.han, fontSize: size, lineHeight: 1.08,
    color: S.cream, letterSpacing: -1.2, textShadow: `0 0 28px ${S.gold}33`
  }}>{children}</div>;
}

// ── 화면들 ──
function StCover() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ fontFamily: SF.bebas, fontSize: 14, letterSpacing: 7, color: S.goldLt }}>
        {G.meta.cohortEn}
      </div>
      <div style={{ marginTop: 8 }}>
        <StTitle size={50}>아멘 17기<br/><span style={{ color: S.gold }}>졸업</span>의 밤</StTitle>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <svg width="56" height="66" viewBox="0 0 62 72">
          <defs><linearGradient id="stTro" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={S.goldLt}/><stop offset="100%" stopColor={S.gold}/>
          </linearGradient></defs>
          <path d="M18 8 H44 V26 A13 13 0 0 1 18 26 Z" fill="url(#stTro)"/>
          <path d="M18 12 H10 A8 8 0 0 0 18 22 Z" fill="url(#stTro)" opacity=".75"/>
          <path d="M44 12 H52 A8 8 0 0 1 44 22 Z" fill="url(#stTro)" opacity=".75"/>
          <rect x="28" y="38" width="6" height="14" fill="url(#stTro)"/>
          <rect x="18" y="52" width="26" height="5" rx="1" fill="url(#stTro)"/>
          <rect x="14" y="58" width="34" height="7" rx="1.5" fill="url(#stTro)"/>
          <text x="31" y="24" textAnchor="middle" fontFamily="Bebas Neue" fontSize="11" fill={S.bg}>17</text>
        </svg>
      </div>
      <div style={{ marginTop: 22, fontFamily: SF.sans, fontSize: 13.5, color: S.cream, opacity: 0.82, lineHeight: 1.75 }}>
        {G.meta.tagline}<br/>
        <span style={{ fontSize: 12, opacity: 0.72 }}>{G.meta.subTagline}</span>
      </div>
      <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 9, padding: '9px 16px',
          background: S.panel, border: `1px solid ${S.line}`,
          fontFamily: SF.bebas, fontSize: 13, letterSpacing: 2, color: S.goldLt
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: S.gold, boxShadow: `0 0 10px ${S.gold}` }} />
          {G.when.dateDisplay} · {G.when.dateLabel}
        </div>
      </div>
    </div>
  );
}

function StWhen() {
  return (
    <div>
      <StTitle>언제,<br/>어디서</StTitle>
      <div style={{ marginTop: 22, display: 'grid', gap: 12 }}>
        {[
          { k: 'DATE', big: G.when.dateDisplay, sub: `${G.when.dayKo} · ${G.when.time}`, c: S.gold },
          { k: 'PLACE', big: G.where.name, sub: G.where.detail, c: S.carpet }
        ].map((r, i) => (
          <div key={i} style={{
            background: S.panel, border: `1px solid ${S.line}`,
            padding: '18px', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: r.c }} />
            <div style={{ fontFamily: SF.bebas, fontSize: 10, letterSpacing: 3, color: S.gold, opacity: 0.85 }}>{r.k}</div>
            <div style={{ marginTop: 6, fontFamily: SF.han, fontSize: 25, color: S.cream, letterSpacing: -0.5 }}>{r.big}</div>
            <div style={{ marginTop: 4, fontFamily: SF.sans, fontSize: 12, color: S.cream, opacity: 0.6 }}>{r.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontFamily: SF.sans, fontSize: 11, color: S.cream, opacity: 0.5 }}>
        {G.when.note}
      </div>
    </div>
  );
}

function StVideo({ onInteract }) {
  const [cur, setCur] = useState(0);
  const v = G.videos[cur];
  return (
    <div>
      <StTitle size={32}>졸업 간증<br/>영상</StTitle>
      <div style={{ marginTop: 12, fontFamily: SF.sans, fontSize: 12.5, color: S.cream, opacity: 0.75, lineHeight: 1.7 }}>
        {G.videoIntro}
      </div>
      <div className="gs-scroll" style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '14px 0 12px' }}>
        {G.videos.map((x, i) => (
          <button key={x.key}
            onClick={(e) => { e.stopPropagation(); onInteract?.(); setCur(i); }}
            style={{
              flex: '0 0 auto', padding: '8px 13px', cursor: 'pointer',
              background: i === cur ? S.gold : 'transparent',
              color: i === cur ? S.bg : S.cream,
              border: `1px solid ${i === cur ? S.gold : S.line}`,
              fontFamily: SF.sans, fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap'
            }}>{x.label}</button>
        ))}
      </div>
      <div data-role="video-slot" data-video-key={v.key}
        onClick={(e) => { e.stopPropagation(); onInteract?.(); }}
        style={{
          position: 'relative', width: '100%', aspectRatio: '9 / 16', maxHeight: 330,
          margin: '0 auto', background: '#05050A', border: `1px solid ${S.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 40px ${S.gold}18`, cursor: 'pointer'
        }}>
        <div style={{ textAlign: 'center', padding: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', margin: '0 auto',
            border: `1.5px solid ${S.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 22px ${S.gold}55`
          }}>
            <svg width="16" height="18" viewBox="0 0 18 20"><path d="M2 1 L17 10 L2 19 Z" fill={S.gold}/></svg>
          </div>
          <div style={{ marginTop: 12, fontFamily: SF.bebas, fontSize: 11, letterSpacing: 4, color: S.gold }}>
            NOW PLAYING
          </div>
          <div style={{ marginTop: 5, fontFamily: SF.sans, fontSize: 11, color: S.cream, opacity: 0.45 }}>
            {G.videoNote}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ fontFamily: SF.han, fontSize: 19, color: S.goldLt, letterSpacing: -0.5 }}>{v.sub}</div>
        <div style={{ marginTop: 3, fontFamily: SF.sans, fontSize: 11.5, color: S.cream, opacity: 0.65, lineHeight: 1.6 }}>
          {v.desc} · {v.dur}
        </div>
      </div>
    </div>
  );
}

function StPhotos() {
  return (
    <div>
      <StTitle size={32}>17기의<br/>순간들</StTitle>
      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        {G.photos.map((p, i) => (
          <div key={i} data-role="photo-slot" data-photo-index={i} style={{
            position: 'relative', aspectRatio: '4 / 3',
            background: 'rgba(255,255,255,0.03)', border: `1px solid ${S.line}`,
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ fontFamily: SF.bebas, fontSize: 22, letterSpacing: 2, color: S.gold, opacity: 0.35 }}>
              {p.tag}
            </div>
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, padding: '7px 8px',
              background: 'linear-gradient(transparent, rgba(0,0,0,.85))',
              fontFamily: SF.sans, fontSize: 10, color: S.cream, fontWeight: 600
            }}>{p.caption}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StTimeline() {
  return (
    <div>
      <StTitle size={32}>함께<br/>걸어온 길</StTitle>
      <div style={{ marginTop: 20, position: 'relative', paddingLeft: 26 }}>
        <div style={{
          position: 'absolute', left: 7, top: 8, bottom: 8, width: 1,
          background: `linear-gradient(${S.gold},${S.gold}18)`
        }} />
        {G.timeline.map((t, i) => (
          <div key={i} style={{ position: 'relative', padding: '10px 0' }}>
            <div style={{
              position: 'absolute', left: -26, top: 16, width: 15, height: 15, borderRadius: '50%',
              background: t.now ? S.gold : S.bg, border: `1.5px solid ${S.gold}`,
              boxShadow: t.now ? `0 0 16px ${S.gold}88` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {t.now && <span style={{ width: 5, height: 5, borderRadius: '50%', background: S.bg }} />}
            </div>
            <div style={{ fontFamily: SF.bebas, fontSize: 11, letterSpacing: 2, color: t.now ? S.goldLt : S.gold, opacity: t.now ? 1 : 0.7 }}>
              {t.period}
            </div>
            <div style={{ marginTop: 2, fontFamily: SF.han, fontSize: 19, color: S.cream, letterSpacing: -0.5 }}>{t.title}</div>
            <div style={{ marginTop: 2, fontFamily: SF.sans, fontSize: 11, color: S.cream, opacity: 0.6, lineHeight: 1.5 }}>{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StRoster() {
  return (
    <div>
      <StTitle size={32}>졸업생<br/>전원</StTitle>
      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
        {G.roster.map((n, i) => (
          <div key={i} style={{
            padding: '10px 3px', textAlign: 'center', background: S.panel,
            border: `1px solid ${S.line}`, fontFamily: SF.sans, fontSize: 12.5,
            fontWeight: 700, color: S.cream
          }}>{n}</div>
        ))}
      </div>
      <div style={{ marginTop: 20, padding: 16, border: `1px solid ${S.carpet}`, background: `${S.carpet}22` }}>
        <div style={{ fontFamily: SF.bebas, fontSize: 11, letterSpacing: 3, color: S.goldLt }}>WITH US IN HEART</div>
        <div style={{ marginTop: 4, fontFamily: SF.han, fontSize: 17, color: S.cream, letterSpacing: -0.5, marginBottom: 12 }}>
          {G.awayNote}
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {G.away.map((a, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingBottom: 7, borderBottom: i < G.away.length - 1 ? `1px solid ${S.line}` : 'none'
            }}>
              <span style={{ fontFamily: SF.sans, fontSize: 13, fontWeight: 700, color: S.cream }}>{a.name}</span>
              <span style={{ fontFamily: SF.bebas, fontSize: 11, letterSpacing: 1.5, color: S.goldLt }}>{a.reason}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 10, fontFamily: SF.sans, fontSize: 10.5, color: S.cream, opacity: 0.42 }}>
        {G.rosterNote}
      </div>
    </div>
  );
}

function StClosing() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
      <StTitle size={32}>맺는 말</StTitle>
      <div style={{ marginTop: 18, fontFamily: SF.sans, fontSize: 14.5, lineHeight: 2, color: S.cream, opacity: 0.9 }}>
        {G.closing.lines.map((l, i) => (
          <div key={i} style={{ minHeight: l === '' ? 12 : 'auto' }}>{l}</div>
        ))}
      </div>
      <div style={{
        marginTop: 22, paddingTop: 16, borderTop: `1px solid ${S.line}`,
        fontFamily: SF.han, fontSize: 17, color: S.gold, letterSpacing: -0.5
      }}>{G.closing.sign}</div>
      <div style={{
        marginTop: 24, fontFamily: SF.bebas, fontSize: 9.5, letterSpacing: 3,
        color: S.cream, opacity: 0.34, textAlign: 'center'
      }}>© {G.meta.org} · {G.meta.cohortEn} · {G.meta.year}</div>
    </div>
  );
}

// ── 스토리 셸 ──
const ST_SCREENS = [
  { key: 'cover',  label: 'OPENING',      dur: 6000,  render: () => <StCover /> },
  { key: 'when',   label: 'WHEN & WHERE', dur: 7000,  render: () => <StWhen /> },
  { key: 'video',  label: 'ON SCREEN',    dur: 14000, render: (p) => <StVideo {...p} /> },
  { key: 'photos', label: 'HIGHLIGHTS',   dur: 8000,  render: () => <StPhotos /> },
  { key: 'time',   label: 'THE ROAD',     dur: 9000,  render: () => <StTimeline /> },
  { key: 'roster', label: 'GRADUATES',    dur: 9000,  render: () => <StRoster /> },
  { key: 'close',  label: 'CURTAIN CALL', dur: 10000, render: () => <StClosing /> }
];

function StoryApp() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);          // 0~1 진행률
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const total = ST_SCREENS.length;
  const cur = ST_SCREENS[idx];

  const go = useCallback((n) => {
    setIdx(Math.max(0, Math.min(total - 1, n)));
    setTick(0);
    startRef.current = 0;
  }, [total]);

  // 자동 진행
  useEffect(() => {
    const step = (t) => {
      if (!startRef.current) startRef.current = t;
      if (!paused) {
        const p = (t - startRef.current) / cur.dur;
        if (p >= 1) {
          if (idx < total - 1) { setIdx(idx + 1); setTick(0); startRef.current = 0; }
          else { setTick(1); setPaused(true); }
        } else setTick(p);
      } else {
        startRef.current = t - tick * cur.dur;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [idx, paused, cur.dur, total, tick]);

  // 키보드
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(idx + 1);
      if (e.key === 'ArrowLeft') go(idx - 1);
      if (e.key === ' ') { e.preventDefault(); setPaused(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, go]);

  return (
    <div style={{
      position: 'relative', width: '100%', maxWidth: 460, height: '100dvh',
      margin: '0 auto', background: S.bg, overflow: 'hidden',
      boxShadow: '0 0 70px rgba(0,0,0,.6)'
    }}>
      {/* 진행바 */}
      <div style={{
        position: 'absolute', top: 12, left: 14, right: 14, zIndex: 40,
        display: 'flex', gap: 4
      }}>
        {ST_SCREENS.map((s, i) => (
          <div key={s.key} onClick={() => go(i)} style={{
            flex: 1, height: 2.5, background: 'rgba(255,255,255,.18)', cursor: 'pointer'
          }}>
            <div style={{
              height: '100%', background: S.gold,
              width: i < idx ? '100%' : i === idx ? `${tick * 100}%` : '0%',
              transition: i === idx ? 'none' : 'width .3s ease'
            }} />
          </div>
        ))}
      </div>

      {/* 상단 메타 */}
      <div style={{
        position: 'absolute', top: 26, left: 16, right: 16, zIndex: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span style={{ fontFamily: SF.bebas, fontSize: 11, letterSpacing: 3, color: S.gold }}>
          {G.meta.org}
        </span>
        <button onClick={() => setPaused(p => !p)} aria-label="pause" style={{
          width: 26, height: 26, border: 'none', background: 'transparent',
          cursor: 'pointer', color: S.cream, opacity: 0.75,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {paused
            ? <svg width="11" height="13" viewBox="0 0 11 13"><path d="M1 1 L10 6.5 L1 12 Z" fill="currentColor"/></svg>
            : <svg width="11" height="13" viewBox="0 0 11 13"><rect x="1" y="1" width="3" height="11" fill="currentColor"/><rect x="7" y="1" width="3" height="11" fill="currentColor"/></svg>}
        </button>
      </div>

      {/* 화면 */}
      <div key={cur.key} style={{ position: 'absolute', inset: 0 }}>
        <StScreen label={cur.label} no={idx + 1} total={total}>
          {cur.render({ onInteract: () => setPaused(true) })}
        </StScreen>
      </div>

      {/* 좌우 탭 영역 */}
      <div onClick={() => go(idx - 1)} style={{
        position: 'absolute', left: 0, top: 60, bottom: 60, width: '26%', zIndex: 30, cursor: 'w-resize'
      }} />
      <div onClick={() => go(idx + 1)} style={{
        position: 'absolute', right: 0, top: 60, bottom: 60, width: '26%', zIndex: 30, cursor: 'e-resize'
      }} />

      {/* 하단 안내 */}
      <div style={{
        position: 'absolute', bottom: 18, left: 0, right: 0, zIndex: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
        fontFamily: SF.bebas, fontSize: 10, letterSpacing: 2.5, color: S.cream, opacity: 0.4
      }}>
        <span>← TAP</span>
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: S.gold }} />
        <span>TAP →</span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<StoryApp />);
