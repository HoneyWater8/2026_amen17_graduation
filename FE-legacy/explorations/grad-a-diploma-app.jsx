/* 시안 A · 졸업장 (Diploma) — 격식 있는 종이·금박 */

const { useState, useEffect, useRef } = React;
const G = window.GRAD;

const DP = {
  paper: '#FBF7EE', paperDeep: '#F2EADA', ink: '#1E1B16', inkSoft: '#5A5348',
  gold: '#A8862C', goldLt: '#D8BE72', seal: '#8C2B22', line: 'rgba(30,27,22,0.14)'
};
const DPF = {
  serif: '"Gowun Batang", serif',
  latin: '"Cinzel", serif',
  sans: '"Pretendard", -apple-system, sans-serif'
};

function dpReveal(ref) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!ref.current || on) return;
    const root = ref.current.closest('[data-scroll-root]');
    const r = ref.current.getBoundingClientRect();
    const rr = root ? root.getBoundingClientRect() : { top: 0, bottom: innerHeight };
    if (r.top < rr.bottom && r.bottom > rr.top) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); },
      { threshold: 0.12, root, rootMargin: '0px 0px -8% 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [on]);
  return on;
}
function DpUp({ children, delay = 0, y = 20 }) {
  const ref = useRef(null); const on = dpReveal(ref);
  return <div ref={ref} style={{
    opacity: on ? 1 : 0, transform: on ? 'none' : `translateY(${y}px)`,
    transition: `opacity .8s ease ${delay}s, transform 1s cubic-bezier(.22,1,.36,1) ${delay}s`
  }}>{children}</div>;
}

// 금박 이중 프레임
function DpFrame({ children, pad = 26 }) {
  return (
    <div style={{ position: 'relative', padding: 10 }}>
      <div style={{ position: 'absolute', inset: 0, border: `1.5px solid ${DP.gold}`, opacity: 0.75 }} />
      <div style={{ position: 'absolute', inset: 5, border: `0.5px solid ${DP.gold}`, opacity: 0.5 }} />
      {[[0,0],[1,0],[0,1],[1,1]].map(([x,y],i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 18 18" style={{
          position: 'absolute', [x ? 'right' : 'left']: 2, [y ? 'bottom' : 'top']: 2,
          transform: `scale(${x ? -1 : 1},${y ? -1 : 1})`
        }}>
          <path d="M1 1 L1 8 M1 1 L8 1 M1 1 L6 6" stroke={DP.gold} strokeWidth="1" fill="none"/>
          <circle cx="9" cy="9" r="1.4" fill={DP.gold}/>
        </svg>
      ))}
      <div style={{ position: 'relative', padding: pad }}>{children}</div>
    </div>
  );
}

// 구분 오나멘트
function DpRule({ w = 120 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '18px 0' }}>
      <span style={{ height: 1, width: w / 2, background: `linear-gradient(90deg, transparent, ${DP.gold})` }} />
      <svg width="9" height="9" viewBox="0 0 9 9"><path d="M4.5 0 L9 4.5 L4.5 9 L0 4.5Z" fill={DP.gold}/></svg>
      <span style={{ height: 1, width: w / 2, background: `linear-gradient(90deg, ${DP.gold}, transparent)` }} />
    </div>
  );
}

function DpLabel({ children }) {
  return <div style={{
    fontFamily: DPF.latin, fontSize: 10, letterSpacing: 4, color: DP.gold,
    textAlign: 'center', textTransform: 'uppercase'
  }}>{children}</div>;
}
function DpSec({ children, bg = DP.paper, pad = '56px 24px' }) {
  return <section style={{ background: bg, padding: pad, position: 'relative' }}>{children}</section>;
}
function DpHead({ ko, en }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <DpLabel>{en}</DpLabel>
      <div style={{
        marginTop: 8, fontFamily: DPF.serif, fontSize: 27, fontWeight: 700,
        color: DP.ink, letterSpacing: -0.5
      }}>{ko}</div>
      <DpRule w={90} />
    </div>
  );
}

// 01 표지
function DpCover() {
  return (
    <DpSec pad="20px 16px 48px" bg={DP.paper}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 30%, ${DP.paperDeep} 0%, transparent 70%)`
      }} />
      <div style={{ position: 'relative' }}>
        <DpFrame pad="40px 22px 34px">
          <DpUp>
            <DpLabel>{G.meta.org}</DpLabel>
            <div style={{
              marginTop: 22, textAlign: 'center', fontFamily: DPF.latin,
              fontSize: 13, letterSpacing: 6, color: DP.inkSoft
            }}>{G.meta.cohortEn}</div>
            <div style={{
              marginTop: 10, textAlign: 'center', fontFamily: DPF.serif,
              fontSize: 42, fontWeight: 700, color: DP.ink, lineHeight: 1.15, letterSpacing: -1
            }}>
              아멘 제자<br/>
              <span style={{ color: DP.gold }}>17기</span> 졸업
            </div>
            <DpRule w={110} />
            <div style={{
              fontFamily: DPF.serif, fontSize: 14, color: DP.inkSoft,
              textAlign: 'center', lineHeight: 1.8
            }}>
              {G.meta.tagline}<br/>
              <span style={{ fontSize: 12.5, opacity: 0.8 }}>{G.meta.subTagline}</span>
            </div>

            {/* 인장 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
              <div style={{
                width: 78, height: 78, borderRadius: '50%',
                border: `1.5px solid ${DP.seal}`, color: DP.seal,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 2, background: 'rgba(140,43,34,0.05)'
              }}>
                <div style={{ fontFamily: DPF.latin, fontSize: 8, letterSpacing: 2 }}>AMEN</div>
                <div style={{ fontFamily: DPF.serif, fontSize: 21, fontWeight: 700, lineHeight: 1 }}>17</div>
                <div style={{ fontFamily: DPF.latin, fontSize: 7.5, letterSpacing: 1.5 }}>DISCIPLE</div>
              </div>
            </div>
            <div style={{
              marginTop: 20, textAlign: 'center', fontFamily: DPF.sans,
              fontSize: 11, color: DP.inkSoft, letterSpacing: 1
            }}>{G.when.dateDisplay} · {G.when.dateLabel}</div>
          </DpUp>
        </DpFrame>
      </div>
    </DpSec>
  );
}

// 02 일시·장소
function DpWhen() {
  return (
    <DpSec bg={DP.paperDeep}>
      <DpUp><DpHead ko="일시 · 장소" en="When & Where" /></DpUp>
      <DpUp delay={0.1}>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { k: 'DATE',  v: G.when.dateDisplay, s: `${G.when.dayKo} · ${G.when.time}` },
            { k: 'PLACE', v: G.where.name,       s: G.where.detail }
          ].map((r, i) => (
            <div key={i} style={{
              background: DP.paper, border: `1px solid ${DP.line}`,
              padding: '18px 18px', position: 'relative', textAlign: 'center'
            }}>
              <div style={{
                position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
                background: DP.paperDeep, padding: '0 8px',
                fontFamily: DPF.latin, fontSize: 9, letterSpacing: 3, color: DP.gold
              }}>{r.k}</div>
              <div style={{ fontFamily: DPF.serif, fontSize: 21, fontWeight: 700, color: DP.ink }}>{r.v}</div>
              <div style={{ marginTop: 5, fontFamily: DPF.sans, fontSize: 11.5, color: DP.inkSoft }}>{r.s}</div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 14, textAlign: 'center', fontFamily: DPF.sans,
          fontSize: 11, color: DP.inkSoft, opacity: 0.8
        }}>{G.when.note}</div>
      </DpUp>
    </DpSec>
  );
}

// 03 영상
function DpVideo() {
  const [cur, setCur] = useState(0);
  const v = G.videos[cur];
  return (
    <DpSec bg={DP.paper}>
      <DpUp><DpHead ko="졸업 간증 영상" en="Testimony" /></DpUp>
      <DpUp delay={0.08}>
        <div style={{
          fontFamily: DPF.serif, fontSize: 13.5, color: DP.inkSoft,
          textAlign: 'center', lineHeight: 1.7, marginBottom: 18
        }}>{G.videoIntro}</div>
      </DpUp>

      <DpUp delay={0.14}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 14 }}>
          {G.videos.map((x, i) => (
            <button key={x.key} onClick={() => setCur(i)} style={{
              padding: '7px 12px', cursor: 'pointer',
              background: i === cur ? DP.ink : 'transparent',
              color: i === cur ? DP.paper : DP.ink,
              border: `1px solid ${i === cur ? DP.ink : DP.line}`,
              fontFamily: DPF.sans, fontSize: 11.5, fontWeight: 600
            }}>{x.label}</button>
          ))}
        </div>
      </DpUp>

      <DpUp delay={0.2}>
        <div style={{ border: `1px solid ${DP.gold}`, padding: 6, background: DP.paperDeep }}>
          <div data-role="video-slot" data-video-key={v.key} style={{
            position: 'relative', width: '100%', aspectRatio: '9 / 16',
            maxHeight: 460, margin: '0 auto', background: '#141210',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
          }}>
            <div style={{ textAlign: 'center', padding: 20 }}>
              <svg width="46" height="46" viewBox="0 0 46 46" style={{ margin: '0 auto' }}>
                <circle cx="23" cy="23" r="22" fill="none" stroke={DP.goldLt} strokeWidth="1"/>
                <path d="M18 14 L33 23 L18 32 Z" fill={DP.goldLt}/>
              </svg>
              <div style={{
                marginTop: 14, fontFamily: DPF.latin, fontSize: 10,
                letterSpacing: 3, color: DP.goldLt
              }}>VIDEO</div>
              <div style={{
                marginTop: 6, fontFamily: DPF.sans, fontSize: 11.5,
                color: 'rgba(255,255,255,0.55)'
              }}>{G.videoNote}</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontFamily: DPF.serif, fontSize: 17, fontWeight: 700, color: DP.ink }}>
            {v.sub}
          </div>
          <div style={{ marginTop: 3, fontFamily: DPF.sans, fontSize: 11.5, color: DP.inkSoft }}>
            {v.desc} · {v.dur}
          </div>
        </div>
      </DpUp>
    </DpSec>
  );
}

// 04 사진
function DpPhotos() {
  return (
    <DpSec bg={DP.paperDeep}>
      <DpUp><DpHead ko="17기의 순간들" en="Moments" /></DpUp>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {G.photos.map((p, i) => (
          <DpUp key={i} delay={i * 0.04} y={14}>
            <div data-role="photo-slot" data-photo-index={i} style={{
              background: DP.paper, border: `1px solid ${DP.line}`, padding: 6
            }}>
              <div style={{
                aspectRatio: '4 / 3', border: `1px dashed ${DP.gold}66`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: DPF.latin, fontSize: 9, letterSpacing: 2, color: `${DP.gold}`
              }}>{p.tag}</div>
              <div style={{
                marginTop: 6, fontFamily: DPF.sans, fontSize: 10.5,
                color: DP.inkSoft, textAlign: 'center'
              }}>{p.caption}</div>
            </div>
          </DpUp>
        ))}
      </div>
    </DpSec>
  );
}

// 05 타임라인
function DpTimeline() {
  return (
    <DpSec bg={DP.paper}>
      <DpUp><DpHead ko="함께 걸어온 길" en="Our Journey" /></DpUp>
      <div style={{ position: 'relative', paddingLeft: 22 }}>
        <div style={{
          position: 'absolute', left: 5, top: 6, bottom: 6, width: 1,
          background: `linear-gradient(${DP.gold}, ${DP.gold}22)`
        }} />
        {G.timeline.map((t, i) => (
          <DpUp key={i} delay={i * 0.05} y={14}>
            <div style={{ position: 'relative', padding: '10px 0' }}>
              <div style={{
                position: 'absolute', left: -22, top: 16,
                width: 11, height: 11, transform: 'rotate(45deg)',
                background: t.now ? DP.seal : DP.paper,
                border: `1px solid ${t.now ? DP.seal : DP.gold}`
              }} />
              <div style={{
                fontFamily: DPF.latin, fontSize: 9.5, letterSpacing: 2,
                color: t.now ? DP.seal : DP.gold
              }}>{t.period}</div>
              <div style={{
                marginTop: 3, fontFamily: DPF.serif, fontSize: 17,
                fontWeight: 700, color: DP.ink
              }}>{t.title}</div>
              <div style={{
                marginTop: 2, fontFamily: DPF.sans, fontSize: 11.5,
                color: DP.inkSoft, lineHeight: 1.55
              }}>{t.desc}</div>
            </div>
          </DpUp>
        ))}
      </div>
    </DpSec>
  );
}

// 06 명단
function DpRoster() {
  return (
    <DpSec bg={DP.paperDeep}>
      <DpUp><DpHead ko="졸업생 전원" en="Graduates" /></DpUp>
      <DpUp delay={0.08}>
        <DpFrame pad="20px 16px">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 6px'
          }}>
            {G.roster.map((n, i) => (
              <div key={i} style={{
                fontFamily: DPF.serif, fontSize: 14, color: DP.ink,
                textAlign: 'center', letterSpacing: 1
              }}>{n}</div>
            ))}
          </div>
          <DpRule w={70} />
          <div style={{
            fontFamily: DPF.latin, fontSize: 9, letterSpacing: 3,
            color: DP.gold, textAlign: 'center', marginBottom: 10
          }}>WITH US IN HEART</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {G.away.map((a, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                borderBottom: i < G.away.length - 1 ? `1px dotted ${DP.line}` : 'none',
                paddingBottom: 5
              }}>
                <span style={{ fontFamily: DPF.serif, fontSize: 13.5, color: DP.ink }}>{a.name}</span>
                <span style={{ fontFamily: DPF.sans, fontSize: 10.5, color: DP.seal }}>{a.reason}</span>
              </div>
            ))}
          </div>
        </DpFrame>
        <div style={{
          marginTop: 10, textAlign: 'center', fontFamily: DPF.sans,
          fontSize: 10.5, color: DP.inkSoft, opacity: 0.75
        }}>{G.rosterNote}</div>
      </DpUp>
    </DpSec>
  );
}

// 07 마무리
function DpClosing() {
  return (
    <DpSec bg={DP.paper} pad="56px 24px 70px">
      <DpUp><DpHead ko="맺는 말" en="Closing" /></DpUp>
      <DpUp delay={0.1}>
        <div style={{
          fontFamily: DPF.serif, fontSize: 15, lineHeight: 2,
          color: DP.ink, textAlign: 'center'
        }}>
          {G.closing.lines.map((l, i) => (
            <div key={i} style={{ minHeight: l === '' ? 12 : 'auto' }}>{l}</div>
          ))}
        </div>
        <DpRule w={80} />
        <div style={{
          fontFamily: DPF.serif, fontSize: 13, color: DP.gold,
          textAlign: 'center', letterSpacing: 1
        }}>{G.closing.sign}</div>
        <div style={{
          marginTop: 30, textAlign: 'center', fontFamily: DPF.latin,
          fontSize: 8.5, letterSpacing: 3, color: DP.inkSoft, opacity: 0.55
        }}>© {G.meta.org} · {G.meta.cohortEn} · {G.meta.year}</div>
      </DpUp>
    </DpSec>
  );
}

function DiplomaApp() {
  return (
    <div data-scroll-root className="gs-scroll" style={{
      height: '100dvh', width: '100%', maxWidth: 460, margin: '0 auto',
      overflowY: 'auto', overflowX: 'hidden', background: DP.paper,
      boxShadow: '0 0 60px rgba(0,0,0,0.14)'
    }}>
      <DpCover />
      <DpWhen />
      <DpVideo />
      <DpPhotos />
      <DpTimeline />
      <DpRoster />
      <DpClosing />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<DiplomaApp />);
