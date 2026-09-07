/* 시안 B · 연말 시상식 (Awards Night) — 다크·골드 스포트라이트 */

const { useState, useEffect, useRef } = React;
const G = window.GRAD;

const AW = {
  bg: '#0A0A10', bg2: '#14141E', panel: 'rgba(255,255,255,0.045)',
  gold: '#F0C24B', goldLt: '#FFE7A8', cream: '#EDE7DA',
  carpet: '#8E1A2C', line: 'rgba(240,194,75,0.22)'
};
const AWF = {
  han: '"Black Han Sans", "Pretendard", sans-serif',
  bebas: '"Bebas Neue", sans-serif',
  sans: '"Pretendard", -apple-system, sans-serif'
};

function awReveal(ref) {
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
function AwUp({ children, delay = 0, y = 22 }) {
  const ref = useRef(null); const on = awReveal(ref);
  return <div ref={ref} style={{
    opacity: on ? 1 : 0, transform: on ? 'none' : `translateY(${y}px)`,
    transition: `opacity .7s ease ${delay}s, transform .9s cubic-bezier(.22,1,.36,1) ${delay}s`
  }}>{children}</div>;
}

// 스포트라이트 배경
function AwSpot({ top = -80, left = '50%', size = 420, color = AW.gold, op = 0.16 }) {
  return <div style={{
    position: 'absolute', top, left, width: size, height: size,
    transform: 'translateX(-50%)', pointerEvents: 'none',
    background: `radial-gradient(circle, ${color}${Math.round(op*255).toString(16).padStart(2,'0')} 0%, transparent 68%)`
  }} />;
}
// 반짝임 파티클
function AwStars({ n = 18 }) {
  const pts = React.useMemo(() => Array.from({ length: n }, (_, i) => ({
    x: (i * 37) % 100, y: (i * 61) % 100,
    s: 1 + ((i * 13) % 3) * 0.6, d: (i * 0.37) % 3.2
  })), [n]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pts.map((p, i) => (
        <span key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: p.s, height: p.s, borderRadius: '50%', background: AW.goldLt,
          animation: `awTwinkle 3.2s ease-in-out ${p.d}s infinite`
        }} />
      ))}
    </div>
  );
}

function AwSec({ children, bg = AW.bg, pad = '58px 22px', spot, stars }) {
  return (
    <section style={{ background: bg, padding: pad, position: 'relative', overflow: 'hidden' }}>
      {spot}
      {stars && <AwStars n={stars} />}
      <div style={{ position: 'relative' }}>{children}</div>
    </section>
  );
}

function AwHead({ no, en, ko, accent = AW.gold }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ fontFamily: AWF.bebas, fontSize: 12, letterSpacing: 3, color: accent }}>
          {String(no).padStart(2, '0')}
        </span>
        <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        <span style={{ fontFamily: AWF.bebas, fontSize: 11, letterSpacing: 3, color: accent, opacity: 0.85 }}>{en}</span>
      </div>
      <div style={{
        marginTop: 12, fontFamily: AWF.han, fontSize: 34,
        color: AW.cream, letterSpacing: -1, lineHeight: 1.1
      }}>{ko}</div>
    </div>
  );
}

// 01 오프닝
function AwOpen() {
  return (
    <AwSec pad="0 0 40px" bg={AW.bg} stars={22}
      spot={<AwSpot top={-140} size={520} op={0.22} />}>
      {/* 스포트라이트 콘 */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 340, pointerEvents: 'none',
        background: `linear-gradient(180deg, ${AW.gold}22 0%, transparent 100%)`,
        clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)'
      }} />
      <div style={{ position: 'relative', padding: '54px 22px 0', textAlign: 'center' }}>
        <AwUp>
          <div style={{
            display: 'inline-block', padding: '5px 14px', border: `1px solid ${AW.line}`,
            fontFamily: AWF.bebas, fontSize: 11, letterSpacing: 4, color: AW.gold
          }}>{G.meta.org} · {G.meta.year}</div>

          <div style={{
            marginTop: 26, fontFamily: AWF.bebas, fontSize: 15,
            letterSpacing: 7, color: AW.goldLt
          }}>{G.meta.cohortEn}</div>

          <div style={{
            marginTop: 6, fontFamily: AWF.han, fontSize: 54, lineHeight: 0.98,
            color: AW.cream, letterSpacing: -2,
            textShadow: `0 0 34px ${AW.gold}44`
          }}>
            아멘 17기<br/>
            <span style={{ color: AW.gold }}>졸업</span>의 밤
          </div>

          {/* 트로피 */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 26 }}>
            <svg width="62" height="72" viewBox="0 0 62 72">
              <defs>
                <linearGradient id="awTro" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={AW.goldLt}/><stop offset="100%" stopColor={AW.gold}/>
                </linearGradient>
              </defs>
              <path d="M18 8 H44 V26 A13 13 0 0 1 18 26 Z" fill="url(#awTro)"/>
              <path d="M18 12 H10 A8 8 0 0 0 18 22 Z" fill="url(#awTro)" opacity="0.75"/>
              <path d="M44 12 H52 A8 8 0 0 1 44 22 Z" fill="url(#awTro)" opacity="0.75"/>
              <rect x="28" y="38" width="6" height="14" fill="url(#awTro)"/>
              <rect x="18" y="52" width="26" height="5" rx="1" fill="url(#awTro)"/>
              <rect x="14" y="58" width="34" height="7" rx="1.5" fill="url(#awTro)"/>
              <text x="31" y="24" textAnchor="middle" fontFamily="Bebas Neue" fontSize="11" fill={AW.bg}>17</text>
            </svg>
          </div>

          <div style={{
            marginTop: 22, fontFamily: AWF.sans, fontSize: 13.5,
            color: AW.cream, opacity: 0.82, lineHeight: 1.75
          }}>
            {G.meta.tagline}<br/>
            <span style={{ fontSize: 12, opacity: 0.75 }}>{G.meta.subTagline}</span>
          </div>

          <div style={{
            marginTop: 30, display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '9px 16px', background: AW.panel, border: `1px solid ${AW.line}`,
            fontFamily: AWF.bebas, fontSize: 13, letterSpacing: 2, color: AW.goldLt
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: AW.gold,
              boxShadow: `0 0 10px ${AW.gold}`
            }} />
            {G.when.dateDisplay} · {G.when.dateLabel}
          </div>
        </AwUp>
      </div>
    </AwSec>
  );
}

// 02 일시·장소
function AwWhen() {
  return (
    <AwSec bg={AW.bg2}>
      <AwUp><AwHead no={2} en="WHEN & WHERE" ko="언제, 어디서" /></AwUp>
      <AwUp delay={0.1}>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { k: 'DATE',  big: G.when.dateDisplay, sub: `${G.when.dayKo} · ${G.when.time}`, c: AW.gold },
            { k: 'PLACE', big: G.where.name,       sub: G.where.detail,                     c: AW.carpet }
          ].map((r, i) => (
            <div key={i} style={{
              background: AW.panel, border: `1px solid ${AW.line}`,
              padding: '18px 18px', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: r.c
              }} />
              <div style={{
                fontFamily: AWF.bebas, fontSize: 10, letterSpacing: 3,
                color: AW.gold, opacity: 0.85
              }}>{r.k}</div>
              <div style={{
                marginTop: 6, fontFamily: AWF.han, fontSize: 25,
                color: AW.cream, letterSpacing: -0.5
              }}>{r.big}</div>
              <div style={{
                marginTop: 4, fontFamily: AWF.sans, fontSize: 12,
                color: AW.cream, opacity: 0.6
              }}>{r.sub}</div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 12, fontFamily: AWF.sans, fontSize: 11,
          color: AW.cream, opacity: 0.5
        }}>{G.when.note}</div>
      </AwUp>
    </AwSec>
  );
}

// 03 영상 — 메인
function AwVideo() {
  const [cur, setCur] = useState(0);
  const v = G.videos[cur];
  return (
    <AwSec bg={AW.bg} stars={14} spot={<AwSpot top={-60} size={400} op={0.14} />}>
      <AwUp><AwHead no={3} en="ON SCREEN" ko="졸업 간증 영상" /></AwUp>
      <AwUp delay={0.08}>
        <div style={{
          fontFamily: AWF.sans, fontSize: 13, color: AW.cream,
          opacity: 0.78, lineHeight: 1.7, marginBottom: 18
        }}>{G.videoIntro}</div>
      </AwUp>

      <AwUp delay={0.14}>
        <div className="gs-scroll" style={{
          display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 12
        }}>
          {G.videos.map((x, i) => (
            <button key={x.key} onClick={() => setCur(i)} style={{
              flex: '0 0 auto', padding: '8px 13px', cursor: 'pointer',
              background: i === cur ? AW.gold : 'transparent',
              color: i === cur ? AW.bg : AW.cream,
              border: `1px solid ${i === cur ? AW.gold : AW.line}`,
              fontFamily: AWF.sans, fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap'
            }}>{x.label}</button>
          ))}
        </div>
      </AwUp>

      <AwUp delay={0.2}>
        <div data-role="video-slot" data-video-key={v.key} style={{
          position: 'relative', width: '100%', aspectRatio: '9 / 16', maxHeight: 470,
          margin: '0 auto', background: '#05050A',
          border: `1px solid ${AW.line}`, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 50px ${AW.gold}18`
        }}>
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{
              width: 58, height: 58, borderRadius: '50%', margin: '0 auto',
              border: `1.5px solid ${AW.gold}`, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 24px ${AW.gold}55`
            }}>
              <svg width="18" height="20" viewBox="0 0 18 20">
                <path d="M2 1 L17 10 L2 19 Z" fill={AW.gold}/>
              </svg>
            </div>
            <div style={{
              marginTop: 16, fontFamily: AWF.bebas, fontSize: 12,
              letterSpacing: 4, color: AW.gold
            }}>NOW PLAYING</div>
            <div style={{
              marginTop: 6, fontFamily: AWF.sans, fontSize: 11.5,
              color: AW.cream, opacity: 0.45
            }}>{G.videoNote}</div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{
            fontFamily: AWF.han, fontSize: 21, color: AW.goldLt, letterSpacing: -0.5
          }}>{v.sub}</div>
          <div style={{
            marginTop: 4, fontFamily: AWF.sans, fontSize: 12,
            color: AW.cream, opacity: 0.65, lineHeight: 1.6
          }}>{v.desc}</div>
          <div style={{
            marginTop: 6, fontFamily: AWF.bebas, fontSize: 11,
            letterSpacing: 2, color: AW.gold, opacity: 0.75
          }}>{v.dur}</div>
        </div>
      </AwUp>
    </AwSec>
  );
}

// 04 사진
function AwPhotos() {
  return (
    <AwSec bg={AW.bg2}>
      <AwUp><AwHead no={4} en="HIGHLIGHTS" ko="17기의 순간들" /></AwUp>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        {G.photos.map((p, i) => (
          <AwUp key={i} delay={i * 0.04} y={14}>
            <div data-role="photo-slot" data-photo-index={i} style={{
              position: 'relative', aspectRatio: '4 / 3',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${AW.line}`, overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                fontFamily: AWF.bebas, fontSize: 22, letterSpacing: 2,
                color: AW.gold, opacity: 0.35
              }}>{p.tag}</div>
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, padding: '8px 9px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                fontFamily: AWF.sans, fontSize: 10.5, color: AW.cream, fontWeight: 600
              }}>{p.caption}</div>
            </div>
          </AwUp>
        ))}
      </div>
    </AwSec>
  );
}

// 05 타임라인
function AwTimeline() {
  return (
    <AwSec bg={AW.bg} stars={10}>
      <AwUp><AwHead no={5} en="THE ROAD" ko="함께 걸어온 길" /></AwUp>
      <div style={{ position: 'relative', paddingLeft: 26 }}>
        <div style={{
          position: 'absolute', left: 7, top: 8, bottom: 8, width: 1,
          background: `linear-gradient(${AW.gold}, ${AW.gold}18)`
        }} />
        {G.timeline.map((t, i) => (
          <AwUp key={i} delay={i * 0.05} y={14}>
            <div style={{ position: 'relative', padding: '11px 0' }}>
              <div style={{
                position: 'absolute', left: -26, top: 17,
                width: 15, height: 15, borderRadius: '50%',
                background: t.now ? AW.gold : AW.bg,
                border: `1.5px solid ${AW.gold}`,
                boxShadow: t.now ? `0 0 16px ${AW.gold}88` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {t.now && <span style={{ width: 5, height: 5, borderRadius: '50%', background: AW.bg }} />}
              </div>
              <div style={{
                fontFamily: AWF.bebas, fontSize: 11, letterSpacing: 2,
                color: t.now ? AW.goldLt : AW.gold, opacity: t.now ? 1 : 0.7
              }}>{t.period}</div>
              <div style={{
                marginTop: 3, fontFamily: AWF.han, fontSize: 20,
                color: AW.cream, letterSpacing: -0.5
              }}>{t.title}</div>
              <div style={{
                marginTop: 2, fontFamily: AWF.sans, fontSize: 11.5,
                color: AW.cream, opacity: 0.6, lineHeight: 1.55
              }}>{t.desc}</div>
            </div>
          </AwUp>
        ))}
      </div>
    </AwSec>
  );
}

// 06 명단
function AwRoster() {
  return (
    <AwSec bg={AW.bg2}>
      <AwUp><AwHead no={6} en="THE GRADUATES" ko="졸업생 전원" /></AwUp>
      <AwUp delay={0.08}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7
        }}>
          {G.roster.map((n, i) => (
            <div key={i} style={{
              padding: '11px 4px', textAlign: 'center',
              background: AW.panel, border: `1px solid ${AW.line}`,
              fontFamily: AWF.sans, fontSize: 13, fontWeight: 700,
              color: AW.cream, letterSpacing: 0.5
            }}>{n}</div>
          ))}
        </div>
      </AwUp>

      <AwUp delay={0.16}>
        <div style={{
          marginTop: 22, padding: '16px 16px',
          border: `1px solid ${AW.carpet}`, background: `${AW.carpet}22`
        }}>
          <div style={{
            fontFamily: AWF.bebas, fontSize: 11, letterSpacing: 3,
            color: AW.goldLt, marginBottom: 4
          }}>WITH US IN HEART</div>
          <div style={{
            fontFamily: AWF.han, fontSize: 18, color: AW.cream,
            letterSpacing: -0.5, marginBottom: 12
          }}>{G.awayNote}</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {G.away.map((a, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingBottom: 7,
                borderBottom: i < G.away.length - 1 ? `1px solid ${AW.line}` : 'none'
              }}>
                <span style={{
                  fontFamily: AWF.sans, fontSize: 13.5, fontWeight: 700, color: AW.cream
                }}>{a.name}</span>
                <span style={{
                  fontFamily: AWF.bebas, fontSize: 11, letterSpacing: 1.5, color: AW.goldLt
                }}>{a.reason}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          marginTop: 10, fontFamily: AWF.sans, fontSize: 10.5,
          color: AW.cream, opacity: 0.42
        }}>{G.rosterNote}</div>
      </AwUp>
    </AwSec>
  );
}

// 07 마무리
function AwClosing() {
  return (
    <AwSec bg={AW.bg} pad="58px 22px 74px" stars={16}
      spot={<AwSpot top={40} size={460} op={0.16} />}>
      <AwUp><AwHead no={7} en="CURTAIN CALL" ko="맺는 말" /></AwUp>
      <AwUp delay={0.1}>
        <div style={{
          fontFamily: AWF.sans, fontSize: 14.5, lineHeight: 2,
          color: AW.cream, opacity: 0.9
        }}>
          {G.closing.lines.map((l, i) => (
            <div key={i} style={{ minHeight: l === '' ? 12 : 'auto' }}>{l}</div>
          ))}
        </div>
        <div style={{
          marginTop: 24, paddingTop: 16, borderTop: `1px solid ${AW.line}`,
          fontFamily: AWF.han, fontSize: 17, color: AW.gold, letterSpacing: -0.5
        }}>{G.closing.sign}</div>
        <div style={{
          marginTop: 28, fontFamily: AWF.bebas, fontSize: 9.5,
          letterSpacing: 3, color: AW.cream, opacity: 0.34, textAlign: 'center'
        }}>© {G.meta.org} · {G.meta.cohortEn} · {G.meta.year}</div>
      </AwUp>
    </AwSec>
  );
}

function AwardsApp() {
  return (
    <div data-scroll-root className="gs-scroll" style={{
      height: '100dvh', width: '100%', maxWidth: 460, margin: '0 auto',
      overflowY: 'auto', overflowX: 'hidden', background: AW.bg,
      boxShadow: '0 0 70px rgba(0,0,0,0.6)'
    }}>
      <AwOpen />
      <AwWhen />
      <AwVideo />
      <AwPhotos />
      <AwTimeline />
      <AwRoster />
      <AwClosing />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AwardsApp />);
