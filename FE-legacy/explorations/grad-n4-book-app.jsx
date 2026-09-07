/* 방식 4 · 책 펼침 (Book) — 졸업장 스킨, 앨범 톤
   좌우 넘기기 · 페이지 플립 애니메이션 · 하단 페이지 인디케이터 */

const { useState, useEffect, useRef, useCallback } = React;
const G = window.GRAD;

const B = {
  paper: '#FBF7EE', paperDeep: '#F2EADA', paperEdge: '#E4D9C1',
  ink: '#1E1B16', inkSoft: '#5A5348',
  gold: '#A8862C', goldLt: '#D8BE72', seal: '#8C2B22',
  line: 'rgba(30,27,22,0.14)'
};
const BF = {
  serif: '"Gowun Batang", serif',
  latin: '"Cinzel", serif',
  sans: '"Pretendard", -apple-system, sans-serif'
};

function BkRule({ w = 90 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, margin: '14px 0' }}>
      <span style={{ height: 1, width: w / 2, background: `linear-gradient(90deg,transparent,${B.gold})` }} />
      <svg width="8" height="8" viewBox="0 0 9 9"><path d="M4.5 0 L9 4.5 L4.5 9 L0 4.5Z" fill={B.gold}/></svg>
      <span style={{ height: 1, width: w / 2, background: `linear-gradient(90deg,${B.gold},transparent)` }} />
    </div>
  );
}

function BkSeal({ size = 68 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `1.5px solid ${B.seal}`, color: B.seal,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 1, background: 'rgba(140,43,34,.07)'
    }}>
      <div style={{ fontFamily: BF.latin, fontSize: size * .105, letterSpacing: 2 }}>AMEN</div>
      <div style={{ fontFamily: BF.serif, fontSize: size * .27, fontWeight: 700, lineHeight: 1 }}>17</div>
      <div style={{ fontFamily: BF.latin, fontSize: size * .095, letterSpacing: 1.5 }}>DISCIPLE</div>
    </div>
  );
}

function BkHead({ ko, en }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 4 }}>
      <div style={{ fontFamily: BF.latin, fontSize: 9.5, letterSpacing: 4, color: B.gold, textTransform: 'uppercase' }}>{en}</div>
      <div style={{ marginTop: 6, fontFamily: BF.serif, fontSize: 24, fontWeight: 700, color: B.ink, letterSpacing: -0.5 }}>{ko}</div>
      <BkRule w={74} />
    </div>
  );
}

function BkFrame({ children, pad = 20 }) {
  return (
    <div style={{ position: 'relative', padding: 8, height: '100%' }}>
      <div style={{ position: 'absolute', inset: 0, border: `1.5px solid ${B.gold}`, opacity: .7 }} />
      <div style={{ position: 'absolute', inset: 4, border: `.5px solid ${B.gold}`, opacity: .45 }} />
      {[[0,0],[1,0],[0,1],[1,1]].map(([x,y],i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 18 18" style={{
          position: 'absolute', [x ? 'right' : 'left']: 2, [y ? 'bottom' : 'top']: 2,
          transform: `scale(${x ? -1 : 1},${y ? -1 : 1})`
        }}>
          <path d="M1 1 L1 8 M1 1 L8 1 M1 1 L6 6" stroke={B.gold} strokeWidth="1" fill="none"/>
          <circle cx="9" cy="9" r="1.3" fill={B.gold}/>
        </svg>
      ))}
      <div style={{ position: 'relative', padding: pad, height: '100%', overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

// ── 페이지 내용 ──
function BkPageCover() {
  return (
    <BkFrame pad="26px 18px">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontFamily: BF.latin, fontSize: 9.5, letterSpacing: 4.5, color: B.gold }}>{G.meta.org}</div>
        <div style={{ marginTop: 16, fontFamily: BF.latin, fontSize: 11, letterSpacing: 6, color: B.inkSoft }}>
          {G.meta.cohortEn}
        </div>
        <div style={{
          marginTop: 8, fontFamily: BF.serif, fontSize: 34, fontWeight: 700,
          color: B.ink, lineHeight: 1.16, letterSpacing: -1
        }}>
          아멘 제자<br/><span style={{ color: B.gold }}>17기</span> 졸업
        </div>
        <BkRule w={92} />
        <div style={{ fontFamily: BF.serif, fontSize: 13, color: B.inkSoft, lineHeight: 1.8 }}>
          {G.meta.tagline}<br/>
          <span style={{ fontSize: 11.5, opacity: .8 }}>{G.meta.subTagline}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}><BkSeal /></div>
        <div style={{ marginTop: 16, fontFamily: BF.sans, fontSize: 10.5, color: B.inkSoft, letterSpacing: 1 }}>
          {G.when.dateDisplay} · {G.when.dateLabel}
        </div>
      </div>
    </BkFrame>
  );
}

function BkPageWhen() {
  return (
    <BkFrame>
      <BkHead ko="일시 · 장소" en="When & Where" />
      <div style={{ display: 'grid', gap: 10 }}>
        {[
          { k: 'DATE', v: G.when.dateDisplay, s: `${G.when.dayKo} · ${G.when.time}` },
          { k: 'PLACE', v: G.where.name, s: G.where.detail }
        ].map((r, i) => (
          <div key={i} style={{
            background: B.paperDeep, border: `1px solid ${B.line}`,
            padding: '16px 14px', position: 'relative', textAlign: 'center'
          }}>
            <div style={{
              position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
              background: B.paper, padding: '0 8px',
              fontFamily: BF.latin, fontSize: 8.5, letterSpacing: 3, color: B.gold
            }}>{r.k}</div>
            <div style={{ fontFamily: BF.serif, fontSize: 19, fontWeight: 700, color: B.ink }}>{r.v}</div>
            <div style={{ marginTop: 4, fontFamily: BF.sans, fontSize: 11, color: B.inkSoft }}>{r.s}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, textAlign: 'center', fontFamily: BF.sans, fontSize: 10.5, color: B.inkSoft, opacity: .76 }}>
        {G.when.note}
      </div>
    </BkFrame>
  );
}

function BkPageVideo() {
  const [cur, setCur] = useState(0);
  const v = G.videos[cur];
  return (
    <BkFrame pad="16px 14px">
      <BkHead ko="졸업 간증 영상" en="Testimony" />
      <div className="gs-scroll" style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 10 }}>
        {G.videos.map((x, i) => (
          <button key={x.key} onClick={(e) => { e.stopPropagation(); setCur(i); }} style={{
            flex: '0 0 auto', padding: '6px 10px', cursor: 'pointer',
            background: i === cur ? B.ink : 'transparent',
            color: i === cur ? B.paper : B.ink,
            border: `1px solid ${i === cur ? B.ink : B.line}`,
            fontFamily: BF.sans, fontSize: 10.5, fontWeight: 600, whiteSpace: 'nowrap'
          }}>{x.label}</button>
        ))}
      </div>
      <div style={{ border: `1px solid ${B.gold}`, padding: 5, background: B.paperDeep }}>
        <div data-role="video-slot" data-video-key={v.key}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative', width: '100%', aspectRatio: '9 / 14',
            background: '#141210', display: 'flex', alignItems: 'center',
            justifyContent: 'center', overflow: 'hidden'
          }}>
          <div style={{ textAlign: 'center', padding: 14 }}>
            <svg width="40" height="40" viewBox="0 0 46 46" style={{ margin: '0 auto' }}>
              <circle cx="23" cy="23" r="22" fill="none" stroke={B.goldLt} strokeWidth="1"/>
              <path d="M18 14 L33 23 L18 32 Z" fill={B.goldLt}/>
            </svg>
            <div style={{ marginTop: 10, fontFamily: BF.latin, fontSize: 9.5, letterSpacing: 3, color: B.goldLt }}>VIDEO</div>
            <div style={{ marginTop: 4, fontFamily: BF.sans, fontSize: 10, color: 'rgba(255,255,255,.5)' }}>
              {G.videoNote}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 9, textAlign: 'center' }}>
        <div style={{ fontFamily: BF.serif, fontSize: 15, fontWeight: 700, color: B.ink }}>{v.sub}</div>
        <div style={{ marginTop: 2, fontFamily: BF.sans, fontSize: 10.5, color: B.inkSoft, lineHeight: 1.5 }}>
          {v.desc}
        </div>
      </div>
    </BkFrame>
  );
}

function BkPagePhotos({ half }) {
  const items = half === 1 ? G.photos.slice(0, 4) : G.photos.slice(4);
  return (
    <BkFrame>
      <BkHead ko={half === 1 ? '17기의 순간들' : '순간들 · 이어서'} en={half === 1 ? 'Moments I' : 'Moments II'} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        {items.map((p, i) => (
          <div key={i} data-role="photo-slot" data-photo-index={half === 1 ? i : i + 4} style={{
            background: B.paperDeep, border: `1px solid ${B.line}`, padding: 5
          }}>
            <div style={{
              aspectRatio: '4 / 3', border: `1px dashed ${B.gold}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: BF.latin, fontSize: 9, letterSpacing: 2, color: B.gold
            }}>{p.tag}</div>
            <div style={{ marginTop: 5, fontFamily: BF.sans, fontSize: 9.5, color: B.inkSoft, textAlign: 'center' }}>
              {p.caption}
            </div>
          </div>
        ))}
      </div>
    </BkFrame>
  );
}

function BkPageTimeline() {
  return (
    <BkFrame>
      <BkHead ko="함께 걸어온 길" en="Our Journey" />
      <div style={{ position: 'relative', paddingLeft: 20 }}>
        <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 1, background: `linear-gradient(${B.gold},${B.gold}22)` }} />
        {G.timeline.map((t, i) => (
          <div key={i} style={{ position: 'relative', padding: '7px 0' }}>
            <div style={{
              position: 'absolute', left: -20, top: 12, width: 10, height: 10,
              transform: 'rotate(45deg)', background: t.now ? B.seal : B.paper,
              border: `1px solid ${t.now ? B.seal : B.gold}`
            }} />
            <div style={{ fontFamily: BF.latin, fontSize: 9, letterSpacing: 2, color: t.now ? B.seal : B.gold }}>
              {t.period}
            </div>
            <div style={{ marginTop: 1, fontFamily: BF.serif, fontSize: 15, fontWeight: 700, color: B.ink }}>{t.title}</div>
            <div style={{ marginTop: 1, fontFamily: BF.sans, fontSize: 10.5, color: B.inkSoft, lineHeight: 1.45 }}>{t.desc}</div>
          </div>
        ))}
      </div>
    </BkFrame>
  );
}

function BkPageRoster() {
  return (
    <BkFrame pad="16px 14px">
      <BkHead ko="졸업생 전원" en="Graduates" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px 4px' }}>
        {G.roster.map((n, i) => (
          <div key={i} style={{ fontFamily: BF.serif, fontSize: 12.5, color: B.ink, textAlign: 'center', letterSpacing: .5 }}>
            {n}
          </div>
        ))}
      </div>
      <BkRule w={60} />
      <div style={{ fontFamily: BF.latin, fontSize: 8.5, letterSpacing: 3, color: B.gold, textAlign: 'center', marginBottom: 8 }}>
        WITH US IN HEART
      </div>
      <div style={{ display: 'grid', gap: 5 }}>
        {G.away.map((a, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            borderBottom: i < G.away.length - 1 ? `1px dotted ${B.line}` : 'none', paddingBottom: 4
          }}>
            <span style={{ fontFamily: BF.serif, fontSize: 12.5, color: B.ink }}>{a.name}</span>
            <span style={{ fontFamily: BF.sans, fontSize: 10, color: B.seal }}>{a.reason}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, textAlign: 'center', fontFamily: BF.sans, fontSize: 9.5, color: B.inkSoft, opacity: .7 }}>
        {G.rosterNote}
      </div>
    </BkFrame>
  );
}

function BkPageClosing() {
  return (
    <BkFrame>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <BkHead ko="맺는 말" en="Closing" />
        <div style={{ fontFamily: BF.serif, fontSize: 14, lineHeight: 1.95, color: B.ink, textAlign: 'center' }}>
          {G.closing.lines.map((l, i) => (
            <div key={i} style={{ minHeight: l === '' ? 11 : 'auto' }}>{l}</div>
          ))}
        </div>
        <BkRule w={68} />
        <div style={{ fontFamily: BF.serif, fontSize: 12.5, color: B.gold, textAlign: 'center', letterSpacing: 1 }}>
          {G.closing.sign}
        </div>
        <div style={{
          marginTop: 22, textAlign: 'center', fontFamily: BF.latin,
          fontSize: 8, letterSpacing: 3, color: B.inkSoft, opacity: .5
        }}>© {G.meta.org} · {G.meta.cohortEn} · {G.meta.year}</div>
      </div>
    </BkFrame>
  );
}

const BK_PAGES = [
  { key: 'cover',   label: '표지',       render: () => <BkPageCover /> },
  { key: 'when',    label: '일시·장소',  render: () => <BkPageWhen /> },
  { key: 'video',   label: '간증 영상',  render: () => <BkPageVideo /> },
  { key: 'photos1', label: '순간들 I',   render: () => <BkPagePhotos half={1} /> },
  { key: 'photos2', label: '순간들 II',  render: () => <BkPagePhotos half={2} /> },
  { key: 'time',    label: '여정',       render: () => <BkPageTimeline /> },
  { key: 'roster',  label: '졸업생',     render: () => <BkPageRoster /> },
  { key: 'close',   label: '맺는 말',    render: () => <BkPageClosing /> }
];

function BookApp() {
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(null);   // 'next' | 'prev' | null
  const total = BK_PAGES.length;
  const busyRef = useRef(false);
  const dragRef = useRef({ x: 0, active: false });

  const go = useCallback((dir) => {
    if (busyRef.current) return;
    const next = idx + (dir === 'next' ? 1 : -1);
    if (next < 0 || next >= total) return;
    busyRef.current = true;
    setFlip(dir);
    setTimeout(() => {
      setIdx(next);
      setFlip(null);
      busyRef.current = false;
    }, 460);
  }, [idx, total]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go('next');
      if (e.key === 'ArrowLeft') go('prev');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const onDown = (e) => { dragRef.current = { x: e.clientX, active: true }; };
  const onUp = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.x;
    dragRef.current.active = false;
    if (Math.abs(dx) > 42) go(dx < 0 ? 'next' : 'prev');
  };

  const page = BK_PAGES[idx];

  return (
    <div style={{
      position: 'relative', width: '100%', maxWidth: 460, height: '100dvh',
      margin: '0 auto', overflow: 'hidden',
      background: `radial-gradient(ellipse at 50% 35%, #EFE7D6 0%, #DED3BC 78%)`,
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 0 60px rgba(0,0,0,.18)'
    }}>
      {/* 상단 메타 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 18px 10px'
      }}>
        <span style={{ fontFamily: BF.latin, fontSize: 9.5, letterSpacing: 3.5, color: B.gold }}>
          {G.meta.org}
        </span>
        <span style={{ fontFamily: BF.latin, fontSize: 9.5, letterSpacing: 2.5, color: B.inkSoft }}>
          {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* 책 영역 */}
      <div
        onPointerDown={onDown}
        onPointerUp={onUp}
        style={{
          flex: 1, minHeight: 0, position: 'relative',
          margin: '0 14px 8px', perspective: 1600,
          cursor: 'grab'
        }}>
        {/* 책등 그림자 */}
        <div style={{
          position: 'absolute', inset: 0,
          boxShadow: 'inset 0 0 0 1px rgba(30,27,22,.1), 0 14px 34px rgba(0,0,0,.2)',
          background: B.paperEdge
        }} />
        {/* 페이지 겹침 표현 */}
        {[6, 4, 2].map((o, i) => (
          <div key={i} style={{
            position: 'absolute', left: o, right: o, top: o, bottom: -o,
            background: B.paperDeep, border: `1px solid ${B.line}`,
            opacity: 0.5 - i * 0.12
          }} />
        ))}

        {/* 현재 페이지 */}
        <div key={page.key} style={{
          position: 'absolute', inset: 0, background: B.paper,
          transformOrigin: flip === 'next' ? 'left center' : 'right center',
          transform: flip === 'next' ? 'rotateY(-16deg)' : flip === 'prev' ? 'rotateY(16deg)' : 'none',
          opacity: flip ? 0.15 : 1,
          transition: flip ? 'transform .44s cubic-bezier(.4,0,.6,1), opacity .44s ease' : 'none',
          boxShadow: '0 6px 20px rgba(0,0,0,.14)',
          overflow: 'hidden'
        }}>
          <div className="gs-scroll" style={{ height: '100%', overflowY: 'auto' }}>
            {page.render()}
          </div>
        </div>

        {/* 좌우 넘김 영역 */}
        <div onClick={() => go('prev')} style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '20%', zIndex: 5
        }} />
        <div onClick={() => go('next')} style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '20%', zIndex: 5
        }} />
      </div>

      {/* 하단 컨트롤 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '4px 18px 16px'
      }}>
        <button onClick={() => go('prev')} disabled={idx === 0} aria-label="prev" style={{
          width: 38, height: 38, border: `1px solid ${B.line}`, background: B.paper,
          cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? .35 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: B.ink
        }}>
          <svg width="9" height="14" viewBox="0 0 9 14"><path d="M7 1 L2 7 L7 13" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
        </button>

        <div className="gs-scroll" style={{ flex: 1, display: 'flex', gap: 4, overflowX: 'auto' }}>
          {BK_PAGES.map((p, i) => (
            <button key={p.key} onClick={() => { if (!busyRef.current) { setIdx(i); } }} style={{
              flex: '0 0 auto', padding: '6px 9px', cursor: 'pointer',
              background: i === idx ? B.ink : 'transparent',
              color: i === idx ? B.paper : B.inkSoft,
              border: `1px solid ${i === idx ? B.ink : B.line}`,
              fontFamily: BF.sans, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap'
            }}>{p.label}</button>
          ))}
        </div>

        <button onClick={() => go('next')} disabled={idx === total - 1} aria-label="next" style={{
          width: 38, height: 38, border: `1px solid ${B.line}`, background: B.paper,
          cursor: idx === total - 1 ? 'default' : 'pointer', opacity: idx === total - 1 ? .35 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: B.ink
        }}>
          <svg width="9" height="14" viewBox="0 0 9 14"><path d="M2 1 L7 7 L2 13" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BookApp />);
