/* 시안 C · 애니버서리 (Anniversary Event) — 원신 N주년 이벤트 페이지 톤 */

const { useState, useEffect, useRef } = React;
const G = window.GRAD;

const GV = {
  bg: '#071426', bg2: '#0C2340', bg3: '#123456',
  teal: '#7FE9E0', tealDim: '#3FA9A2',
  gold: '#FFD98A', goldDeep: '#C9A24B',
  cream: '#EAF4F6', line: 'rgba(127,233,224,0.28)'
};
const GVF = {
  cinzel: '"Cinzel", serif',
  han: '"Black Han Sans", "Pretendard", sans-serif',
  serif: '"Gowun Batang", serif',
  sans: '"Pretendard", -apple-system, sans-serif'
};

function gvReveal(ref) {
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
function GvUp({ children, delay = 0, y = 22 }) {
  const ref = useRef(null); const on = gvReveal(ref);
  return <div ref={ref} style={{
    opacity: on ? 1 : 0, transform: on ? 'none' : `translateY(${y}px)`,
    transition: `opacity .8s ease ${delay}s, transform 1s cubic-bezier(.22,1,.36,1) ${delay}s`
  }}>{children}</div>;
}

// 떠다니는 입자
function GvMotes({ n = 16 }) {
  const pts = React.useMemo(() => Array.from({ length: n }, (_, i) => ({
    x: (i * 41) % 100, y: (i * 67) % 100,
    s: 1.5 + ((i * 17) % 4) * 0.7,
    d: (i * 0.53) % 5, dur: 6 + ((i * 7) % 5)
  })), [n]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pts.map((p, i) => (
        <span key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: p.s, height: p.s, borderRadius: '50%',
          background: i % 3 === 0 ? GV.gold : GV.teal,
          boxShadow: `0 0 ${p.s * 3}px ${i % 3 === 0 ? GV.gold : GV.teal}`,
          animation: `gvFloat ${p.dur}s ease-in-out ${p.d}s infinite`
        }} />
      ))}
    </div>
  );
}

// 마름모 오나멘트
function GvDiamond({ size = 10, color = GV.gold, filled = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10">
      <path d="M5 0 L10 5 L5 10 L0 5Z"
        fill={filled ? color : 'none'} stroke={color} strokeWidth={filled ? 0 : 1}/>
    </svg>
  );
}

// 장식 구분선
function GvDivider({ w = '100%' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: w, margin: '16px auto' }}>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${GV.teal}88)` }} />
      <GvDiamond size={7} color={GV.teal} filled={false} />
      <GvDiamond size={9} color={GV.gold} />
      <GvDiamond size={7} color={GV.teal} filled={false} />
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${GV.teal}88, transparent)` }} />
    </div>
  );
}

// 오나멘트 코너가 있는 패널
function GvPanel({ children, pad = 18, glow = false, tone = 'teal' }) {
  const c = tone === 'gold' ? GV.gold : GV.teal;
  return (
    <div style={{
      position: 'relative', padding: pad,
      background: 'linear-gradient(160deg, rgba(127,233,224,0.07), rgba(12,35,64,0.5))',
      border: `1px solid ${c}44`,
      boxShadow: glow ? `0 0 28px ${c}22, inset 0 0 24px ${c}0d` : `inset 0 0 20px ${c}0a`
    }}>
      {[[0,0],[1,0],[0,1],[1,1]].map(([x,y],i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" style={{
          position: 'absolute', [x ? 'right' : 'left']: -1, [y ? 'bottom' : 'top']: -1,
          transform: `scale(${x ? -1 : 1},${y ? -1 : 1})`
        }}>
          <path d="M0 5 L0 0 L5 0" stroke={c} strokeWidth="1.4" fill="none"/>
          <path d="M6 0.5 L0.5 6" stroke={c} strokeWidth="0.8" fill="none" opacity="0.55"/>
        </svg>
      ))}
      {children}
    </div>
  );
}

function GvSec({ children, pad = '56px 20px', bg, motes }) {
  return (
    <section style={{
      padding: pad, position: 'relative', overflow: 'hidden',
      background: bg || 'transparent'
    }}>
      {motes && <GvMotes n={motes} />}
      <div style={{ position: 'relative' }}>{children}</div>
    </section>
  );
}

function GvHead({ en, ko }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 20 }}>
      <div style={{
        fontFamily: GVF.cinzel, fontSize: 10.5, letterSpacing: 5,
        color: GV.gold, textTransform: 'uppercase'
      }}>{en}</div>
      <div style={{
        marginTop: 7, fontFamily: GVF.han, fontSize: 29,
        color: GV.cream, letterSpacing: -0.8,
        textShadow: `0 0 22px ${GV.teal}44`
      }}>{ko}</div>
      <GvDivider w="72%" />
    </div>
  );
}

// 01 오프닝 — 대형 엠블럼 + 후광
function GvOpen() {
  return (
    <GvSec pad="0 20px 46px" motes={22}>
      {/* 광원 */}
      <div style={{
        position: 'absolute', top: -180, left: '50%', transform: 'translateX(-50%)',
        width: 560, height: 560, pointerEvents: 'none',
        background: `radial-gradient(circle, ${GV.teal}22 0%, ${GV.gold}0f 40%, transparent 70%)`
      }} />
      <div style={{ position: 'relative', paddingTop: 48, textAlign: 'center' }}>
        <GvUp>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', border: `1px solid ${GV.line}`,
            background: 'rgba(127,233,224,0.06)'
          }}>
            <GvDiamond size={7} color={GV.gold} />
            <span style={{
              fontFamily: GVF.cinzel, fontSize: 10, letterSpacing: 3.5, color: GV.teal
            }}>{G.meta.org}</span>
            <GvDiamond size={7} color={GV.gold} />
          </div>

          {/* 엠블럼 */}
          <div style={{
            position: 'relative', width: 176, height: 176, margin: '26px auto 0'
          }}>
            {/* 회전 후광 */}
            <svg viewBox="0 0 176 176" style={{
              position: 'absolute', inset: 0, animation: 'gvSpin 30s linear infinite'
            }}>
              <circle cx="88" cy="88" r="84" fill="none" stroke={GV.teal} strokeWidth="0.7"
                strokeDasharray="3 7" opacity="0.5"/>
              {Array.from({ length: 12 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 30} 88 88)`}>
                  <path d="M88 4 L92 12 L88 20 L84 12Z" fill={i % 3 === 0 ? GV.gold : GV.teal}
                    opacity={i % 3 === 0 ? 0.9 : 0.45}/>
                </g>
              ))}
            </svg>
            <svg viewBox="0 0 176 176" style={{
              position: 'absolute', inset: 0, animation: 'gvSpinRev 44s linear infinite'
            }}>
              <circle cx="88" cy="88" r="70" fill="none" stroke={GV.gold} strokeWidth="0.6"
                strokeDasharray="1 5" opacity="0.6"/>
            </svg>
            {/* 중앙 */}
            <div style={{
              position: 'absolute', inset: 34, borderRadius: '50%',
              background: `radial-gradient(circle at 40% 32%, ${GV.bg3}, ${GV.bg} 72%)`,
              border: `1px solid ${GV.gold}77`,
              boxShadow: `0 0 34px ${GV.teal}33, inset 0 0 26px ${GV.teal}1a`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 1
            }}>
              <div style={{
                fontFamily: GVF.cinzel, fontSize: 9, letterSpacing: 3, color: GV.teal
              }}>AMEN</div>
              <div style={{
                fontFamily: GVF.han, fontSize: 40, lineHeight: 1, color: GV.gold,
                textShadow: `0 0 20px ${GV.gold}66`
              }}>17</div>
              <div style={{
                fontFamily: GVF.cinzel, fontSize: 8, letterSpacing: 2.5, color: GV.teal, opacity: 0.85
              }}>DISCIPLE</div>
            </div>
          </div>

          <div style={{
            marginTop: 24, fontFamily: GVF.cinzel, fontSize: 12,
            letterSpacing: 6, color: GV.gold
          }}>GRADUATION {G.meta.year}</div>

          <div style={{
            marginTop: 8, fontFamily: GVF.han, fontSize: 44, lineHeight: 1.05,
            color: GV.cream, letterSpacing: -1.5,
            textShadow: `0 0 30px ${GV.teal}55`
          }}>
            아멘 <span style={{ color: GV.teal }}>17기</span><br/>졸업을 축하합니다
          </div>

          <div style={{
            marginTop: 16, fontFamily: GVF.serif, fontSize: 14,
            color: GV.cream, opacity: 0.8, lineHeight: 1.75, fontWeight: 700
          }}>
            {G.meta.tagline}<br/>
            <span style={{ fontSize: 12.5, opacity: 0.75, fontWeight: 400 }}>{G.meta.subTagline}</span>
          </div>

          {/* 리본 배너 */}
          <div style={{ marginTop: 28, position: 'relative', display: 'inline-block' }}>
            <div style={{
              padding: '10px 26px',
              background: `linear-gradient(90deg, ${GV.goldDeep}, ${GV.gold}, ${GV.goldDeep})`,
              color: GV.bg, fontFamily: GVF.han, fontSize: 15, letterSpacing: -0.3,
              boxShadow: `0 0 24px ${GV.gold}44`
            }}>{G.when.dateDisplay} · {G.when.dateLabel}</div>
            {[-1, 1].map(s => (
              <span key={s} style={{
                position: 'absolute', top: 0, bottom: 0, [s < 0 ? 'left' : 'right']: -9,
                width: 10, background: GV.goldDeep,
                clipPath: s < 0 ? 'polygon(100% 0,100% 100%,0 50%)' : 'polygon(0 0,0 100%,100% 50%)'
              }} />
            ))}
          </div>
        </GvUp>
      </div>
    </GvSec>
  );
}

// 02 일시·장소
function GvWhen() {
  return (
    <GvSec motes={10}>
      <GvUp><GvHead en="Schedule" ko="일시 · 장소" /></GvUp>
      <GvUp delay={0.1}>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { en: 'DATE',  ko: G.when.dateDisplay, sub: `${G.when.dayKo} · ${G.when.time}`, tone: 'gold' },
            { en: 'PLACE', ko: G.where.name,       sub: G.where.detail,                     tone: 'teal' }
          ].map((r, i) => (
            <GvPanel key={i} tone={r.tone} glow>
              <div style={{
                fontFamily: GVF.cinzel, fontSize: 10, letterSpacing: 3.5,
                color: r.tone === 'gold' ? GV.gold : GV.teal
              }}>{r.en}</div>
              <div style={{
                marginTop: 7, fontFamily: GVF.han, fontSize: 24,
                color: GV.cream, letterSpacing: -0.6
              }}>{r.ko}</div>
              <div style={{
                marginTop: 4, fontFamily: GVF.sans, fontSize: 12,
                color: GV.cream, opacity: 0.62
              }}>{r.sub}</div>
            </GvPanel>
          ))}
        </div>
        <div style={{
          marginTop: 12, textAlign: 'center', fontFamily: GVF.sans,
          fontSize: 11, color: GV.cream, opacity: 0.5
        }}>{G.when.note}</div>
      </GvUp>
    </GvSec>
  );
}

// 03 영상 — 메인 이벤트
function GvVideo() {
  const [cur, setCur] = useState(0);
  const v = G.videos[cur];
  return (
    <GvSec motes={16}>
      <div style={{
        position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
        width: 480, height: 480, pointerEvents: 'none',
        background: `radial-gradient(circle, ${GV.teal}1a 0%, transparent 66%)`
      }} />
      <GvUp><GvHead en="Main Feature" ko="졸업 간증 영상" /></GvUp>
      <GvUp delay={0.08}>
        <div style={{
          fontFamily: GVF.sans, fontSize: 13, color: GV.cream,
          opacity: 0.78, lineHeight: 1.75, textAlign: 'center', marginBottom: 18
        }}>{G.videoIntro}</div>
      </GvUp>

      <GvUp delay={0.14}>
        <div className="gs-scroll" style={{
          display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 12
        }}>
          {G.videos.map((x, i) => {
            const on = i === cur;
            return (
              <button key={x.key} onClick={() => setCur(i)} style={{
                flex: '0 0 auto', padding: '8px 14px', cursor: 'pointer',
                background: on
                  ? `linear-gradient(90deg, ${GV.goldDeep}, ${GV.gold})`
                  : 'rgba(127,233,224,0.07)',
                color: on ? GV.bg : GV.cream,
                border: `1px solid ${on ? GV.gold : GV.line}`,
                fontFamily: GVF.sans, fontSize: 11.5, fontWeight: 700,
                whiteSpace: 'nowrap',
                boxShadow: on ? `0 0 18px ${GV.gold}55` : 'none'
              }}>{x.label}</button>
            );
          })}
        </div>
      </GvUp>

      <GvUp delay={0.2}>
        <GvPanel pad={7} tone="teal" glow>
          <div data-role="video-slot" data-video-key={v.key} style={{
            position: 'relative', width: '100%', aspectRatio: '9 / 16', maxHeight: 460,
            background: `radial-gradient(circle at 50% 40%, ${GV.bg3}, #030A14 78%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
          }}>
            {/* 재생 버튼 */}
            <div style={{ textAlign: 'center', padding: 20, position: 'relative' }}>
              <div style={{
                width: 64, height: 64, margin: '0 auto', position: 'relative',
                animation: 'gvPulse 2.6s ease-in-out infinite'
              }}>
                <svg viewBox="0 0 64 64" style={{ position: 'absolute', inset: 0 }}>
                  <circle cx="32" cy="32" r="30" fill="none" stroke={GV.teal} strokeWidth="1" opacity="0.6"/>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <path key={i} d="M32 0 L35 5 L32 10 L29 5Z" fill={GV.gold}
                      transform={`rotate(${i * 90} 32 32)`}/>
                  ))}
                  <path d="M25 20 L45 32 L25 44 Z" fill={GV.gold}/>
                </svg>
              </div>
              <div style={{
                marginTop: 16, fontFamily: GVF.cinzel, fontSize: 11,
                letterSpacing: 4, color: GV.teal
              }}>PLAY</div>
              <div style={{
                marginTop: 6, fontFamily: GVF.sans, fontSize: 11.5,
                color: GV.cream, opacity: 0.45
              }}>{G.videoNote}</div>
            </div>
          </div>
        </GvPanel>

        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <div style={{
            fontFamily: GVF.han, fontSize: 21, color: GV.gold, letterSpacing: -0.5,
            textShadow: `0 0 18px ${GV.gold}44`
          }}>{v.sub}</div>
          <div style={{
            marginTop: 5, fontFamily: GVF.sans, fontSize: 12,
            color: GV.cream, opacity: 0.68, lineHeight: 1.6
          }}>{v.desc}</div>
          <div style={{
            marginTop: 6, fontFamily: GVF.cinzel, fontSize: 10.5,
            letterSpacing: 2.5, color: GV.teal
          }}>{v.dur}</div>
        </div>
      </GvUp>
    </GvSec>
  );
}

// 04 사진
function GvPhotos() {
  return (
    <GvSec motes={10}>
      <GvUp><GvHead en="Memories" ko="17기의 순간들" /></GvUp>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {G.photos.map((p, i) => (
          <GvUp key={i} delay={i * 0.04} y={14}>
            <div data-role="photo-slot" data-photo-index={i} style={{ position: 'relative' }}>
              <GvPanel pad={5} tone={i % 3 === 0 ? 'gold' : 'teal'}>
                <div style={{
                  aspectRatio: '4 / 3',
                  background: `radial-gradient(circle at 50% 45%, ${GV.bg3}55, ${GV.bg} 80%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{
                    fontFamily: GVF.cinzel, fontSize: 20, letterSpacing: 2,
                    color: i % 3 === 0 ? GV.gold : GV.teal, opacity: 0.45
                  }}>{p.tag}</div>
                </div>
                <div style={{
                  marginTop: 5, fontFamily: GVF.sans, fontSize: 10.5,
                  color: GV.cream, opacity: 0.72, textAlign: 'center'
                }}>{p.caption}</div>
              </GvPanel>
            </div>
          </GvUp>
        ))}
      </div>
    </GvSec>
  );
}

// 05 타임라인
function GvTimeline() {
  return (
    <GvSec motes={12}>
      <GvUp><GvHead en="Our Journey" ko="함께 걸어온 길" /></GvUp>
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        <div style={{
          position: 'absolute', left: 7, top: 10, bottom: 10, width: 1.5,
          background: `linear-gradient(${GV.gold}, ${GV.teal} 45%, ${GV.teal}22)`
        }} />
        {G.timeline.map((t, i) => (
          <GvUp key={i} delay={i * 0.05} y={14}>
            <div style={{ position: 'relative', padding: '12px 0' }}>
              <div style={{
                position: 'absolute', left: -28, top: 17,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 16, height: 16
              }}>
                <div style={{
                  transform: 'rotate(45deg)', width: 11, height: 11,
                  background: t.now ? GV.gold : GV.bg,
                  border: `1.3px solid ${t.now ? GV.gold : GV.teal}`,
                  boxShadow: t.now ? `0 0 16px ${GV.gold}88` : 'none'
                }} />
              </div>
              <div style={{
                fontFamily: GVF.cinzel, fontSize: 10.5, letterSpacing: 2.5,
                color: t.now ? GV.gold : GV.teal
              }}>{t.period}</div>
              <div style={{
                marginTop: 3, fontFamily: GVF.han, fontSize: 20,
                color: GV.cream, letterSpacing: -0.5
              }}>{t.title}</div>
              <div style={{
                marginTop: 2, fontFamily: GVF.sans, fontSize: 11.5,
                color: GV.cream, opacity: 0.62, lineHeight: 1.55
              }}>{t.desc}</div>
            </div>
          </GvUp>
        ))}
      </div>
    </GvSec>
  );
}

// 06 명단
function GvRoster() {
  return (
    <GvSec motes={14}>
      <GvUp><GvHead en="The Graduates" ko="졸업생 전원" /></GvUp>
      <GvUp delay={0.08}>
        <GvPanel pad={16} tone="gold" glow>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8
          }}>
            {G.roster.map((n, i) => (
              <div key={i} style={{
                padding: '10px 3px', textAlign: 'center',
                background: 'rgba(127,233,224,0.06)',
                border: `1px solid ${GV.line}`,
                fontFamily: GVF.sans, fontSize: 12.5, fontWeight: 700,
                color: GV.cream, letterSpacing: 0.5
              }}>{n}</div>
            ))}
          </div>
        </GvPanel>
      </GvUp>

      <GvUp delay={0.16}>
        <div style={{ marginTop: 20 }}>
          <GvPanel pad={16} tone="teal" glow>
            <div style={{
              fontFamily: GVF.cinzel, fontSize: 10, letterSpacing: 3.5,
              color: GV.gold, textAlign: 'center'
            }}>WITH US IN HEART</div>
            <div style={{
              marginTop: 5, fontFamily: GVF.han, fontSize: 18,
              color: GV.cream, letterSpacing: -0.5, textAlign: 'center'
            }}>{G.awayNote}</div>
            <GvDivider w="60%" />
            <div style={{ display: 'grid', gap: 9 }}>
              {G.away.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingBottom: 8,
                  borderBottom: i < G.away.length - 1 ? `1px solid ${GV.line}` : 'none'
                }}>
                  <span style={{
                    fontFamily: GVF.sans, fontSize: 13.5, fontWeight: 700, color: GV.cream
                  }}>{a.name}</span>
                  <span style={{
                    fontFamily: GVF.cinzel, fontSize: 10.5, letterSpacing: 1.5, color: GV.gold
                  }}>{a.reason}</span>
                </div>
              ))}
            </div>
          </GvPanel>
          <div style={{
            marginTop: 10, textAlign: 'center', fontFamily: GVF.sans,
            fontSize: 10.5, color: GV.cream, opacity: 0.45
          }}>{G.rosterNote}</div>
        </div>
      </GvUp>
    </GvSec>
  );
}

// 07 마무리
function GvClosing() {
  return (
    <GvSec pad="56px 20px 76px" motes={20}>
      <div style={{
        position: 'absolute', bottom: -160, left: '50%', transform: 'translateX(-50%)',
        width: 520, height: 520, pointerEvents: 'none',
        background: `radial-gradient(circle, ${GV.gold}18 0%, transparent 68%)`
      }} />
      <GvUp><GvHead en="Closing" ko="맺는 말" /></GvUp>
      <GvUp delay={0.1}>
        <div style={{
          fontFamily: GVF.serif, fontSize: 15, lineHeight: 2,
          color: GV.cream, opacity: 0.92, textAlign: 'center', fontWeight: 400
        }}>
          {G.closing.lines.map((l, i) => (
            <div key={i} style={{ minHeight: l === '' ? 12 : 'auto' }}>{l}</div>
          ))}
        </div>
        <GvDivider w="60%" />
        <div style={{
          fontFamily: GVF.han, fontSize: 17, color: GV.gold,
          textAlign: 'center', letterSpacing: -0.5,
          textShadow: `0 0 18px ${GV.gold}44`
        }}>{G.closing.sign}</div>
        <div style={{
          marginTop: 30, textAlign: 'center', fontFamily: GVF.cinzel,
          fontSize: 9, letterSpacing: 3, color: GV.cream, opacity: 0.36
        }}>© {G.meta.org} · {G.meta.cohortEn} · {G.meta.year}</div>
      </GvUp>
    </GvSec>
  );
}

function AnnivApp() {
  return (
    <div data-scroll-root className="gs-scroll" style={{
      height: '100dvh', width: '100%', maxWidth: 460, margin: '0 auto',
      overflowY: 'auto', overflowX: 'hidden',
      background: `linear-gradient(180deg, ${GV.bg} 0%, ${GV.bg2} 34%, ${GV.bg} 68%, ${GV.bg2} 100%)`,
      boxShadow: '0 0 70px rgba(0,0,0,0.6)'
    }}>
      <GvOpen />
      <GvWhen />
      <GvVideo />
      <GvPhotos />
      <GvTimeline />
      <GvRoster />
      <GvClosing />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AnnivApp />);
