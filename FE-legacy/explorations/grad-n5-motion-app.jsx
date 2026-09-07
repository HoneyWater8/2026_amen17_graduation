/* 방식 5 · 시네마틱 모션 (Motion) — 스크롤이 타임라인
   각 장면은 pin 되고, 스크롤 진행도(0→1)가 모션을 구동 */

const { useState, useEffect, useRef } = React;
const G = window.GRAD;

const M = {
  bg: '#050E1C', bg2: '#0A1E38', bg3: '#123456',
  teal: '#7FE9E0', tealDim: '#3FA9A2',
  gold: '#FFD98A', goldDeep: '#C9A24B',
  cream: '#EAF4F6', line: 'rgba(127,233,224,0.28)'
};
const MF = {
  cinzel: '"Cinzel", serif',
  han: '"Black Han Sans", "Pretendard", sans-serif',
  serif: '"Gowun Batang", serif',
  sans: '"Pretendard", -apple-system, sans-serif'
};

const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
// 구간 매핑: p가 [i0,i1]일 때 0→1
const seg = (p, i0, i1) => cl((p - i0) / (i1 - i0));
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ── 장면 진행도 훅 ──
function useScene(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = el.closest('[data-scroll-root]');
    if (!root) return;
    let raf = 0;
    const calc = () => {
      const top = el.offsetTop;
      const h = el.offsetHeight;
      const vh = root.clientHeight;
      const span = Math.max(1, h - vh);
      setP(cl((root.scrollTop - top) / span));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calc);
    };
    calc();
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => { root.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return p;
}

// pin 장면 셸
function Scene({ vh = 220, children, bg }) {
  const ref = useRef(null);
  const p = useScene(ref);
  return (
    <section ref={ref} style={{ height: `${vh}vh`, position: 'relative', background: bg || 'transparent' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column'
      }}>
        {typeof children === 'function' ? children(p) : children}
      </div>
    </section>
  );
}

// ── 공통 장식 ──
function MoMotes({ n = 20, rise = 0 }) {
  const pts = React.useMemo(() => Array.from({ length: n }, (_, i) => ({
    x: (i * 41) % 100, y: (i * 67) % 100,
    s: 1.5 + ((i * 17) % 4) * 0.7, d: (i * 0.53) % 5, dur: 6 + ((i * 7) % 5)
  })), [n]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pts.map((q, i) => (
        <span key={i} style={{
          position: 'absolute', left: `${q.x}%`, top: `${q.y}%`,
          width: q.s, height: q.s, borderRadius: '50%',
          background: i % 3 === 0 ? M.gold : M.teal,
          boxShadow: `0 0 ${q.s * 3}px ${i % 3 === 0 ? M.gold : M.teal}`,
          transform: `translateY(${-rise * (40 + i * 6)}px)`,
          animation: `moFloat ${q.dur}s ease-in-out ${q.d}s infinite`
        }} />
      ))}
    </div>
  );
}

function MoLabel({ children, color = M.gold, size = 10.5 }) {
  return <div style={{
    fontFamily: MF.cinzel, fontSize: size, letterSpacing: 4.5,
    color, textTransform: 'uppercase'
  }}>{children}</div>;
}

// 글자 단위 리빌
function MoReveal({ text, p, from = 0, to = 1, size = 40, color = M.cream, style = {} }) {
  const chars = [...text];
  return (
    <div style={{
      fontFamily: MF.han, fontSize: size, lineHeight: 1.08,
      letterSpacing: -1.2, color, display: 'flex', flexWrap: 'wrap', ...style
    }}>
      {chars.map((c, i) => {
        const t0 = from + (to - from) * (i / Math.max(1, chars.length));
        const k = easeOut(seg(p, t0, Math.min(to, t0 + 0.18)));
        return (
          <span key={i} style={{
            display: 'inline-block',
            opacity: k,
            transform: `translateY(${(1 - k) * 26}px) rotateX(${(1 - k) * -60}deg)`,
            transformOrigin: 'bottom',
            whiteSpace: c === ' ' ? 'pre' : 'normal'
          }}>{c}</span>
        );
      })}
    </div>
  );
}

// ═══════════ 1 · HERO — 엠블럼 조립 ═══════════
function MoHero() {
  return (
    <Scene vh={280}>
      {(p) => {
        const ring = easeOut(seg(p, 0.02, 0.34));      // 링 조립
        const core = easeOut(seg(p, 0.16, 0.42));      // 중심 등장
        const spin = p * 260;
        const glow = seg(p, 0, 0.4);
        const push = easeInOut(seg(p, 0.44, 0.72));    // 엠블럼 위로
        const meta = easeOut(seg(p, 0.74, 0.94));
        return (
          <div style={{ position: 'relative', height: '100%', padding: '0 22px' }}>
            <MoMotes n={22} />
            {/* 광원 */}
            <div style={{
              position: 'absolute', top: '18%', left: '50%',
              width: 520, height: 520, transform: `translate(-50%,-50%) scale(${0.5 + glow * 0.8})`,
              pointerEvents: 'none', opacity: 0.35 + glow * 0.5,
              background: `radial-gradient(circle, ${M.teal}26 0%, ${M.gold}12 42%, transparent 70%)`
            }} />

            {/* 상단 라벨 */}
            <div style={{
              paddingTop: 40, textAlign: 'center',
              opacity: easeOut(seg(p, 0, 0.1)),
              transform: `translateY(${(1 - easeOut(seg(p, 0, 0.1))) * -12}px)`
            }}>
              <MoLabel>{G.meta.org}</MoLabel>
            </div>

            {/* 엠블럼 */}
            <div style={{
              position: 'relative', width: 208, height: 208, margin: '26px auto 0',
              transform: `translateY(${-push * 62}px) scale(${1 - push * 0.16})`
            }}>
              <svg viewBox="0 0 208 208" style={{
                position: 'absolute', inset: 0, transform: `rotate(${spin}deg)`
              }}>
                <circle cx="104" cy="104" r="100" fill="none" stroke={M.teal}
                  strokeWidth="0.8" strokeDasharray="4 8" opacity={ring * 0.55}
                  strokeDashoffset={(1 - ring) * 300}/>
                {Array.from({ length: 12 }).map((_, i) => {
                  const k = cl((ring * 12 - i) / 1.2);
                  return (
                    <g key={i} transform={`rotate(${i * 30} 104 104)`} opacity={k}>
                      <path d="M104 4 L108.5 14 L104 24 L99.5 14Z"
                        fill={i % 3 === 0 ? M.gold : M.teal}
                        transform={`translate(0 ${(1 - k) * -22})`}/>
                    </g>
                  );
                })}
              </svg>
              <svg viewBox="0 0 208 208" style={{
                position: 'absolute', inset: 0, transform: `rotate(${-spin * 0.6}deg)`
              }}>
                <circle cx="104" cy="104" r="82" fill="none" stroke={M.gold}
                  strokeWidth="0.7" strokeDasharray="1 6" opacity={ring * 0.65}/>
              </svg>
              {/* 중심 */}
              <div style={{
                position: 'absolute', inset: 40, borderRadius: '50%',
                background: `radial-gradient(circle at 40% 32%, ${M.bg3}, ${M.bg} 74%)`,
                border: `1px solid ${M.gold}${Math.round(core * 140).toString(16).padStart(2, '0')}`,
                boxShadow: `0 0 ${core * 40}px ${M.teal}44, inset 0 0 ${core * 30}px ${M.teal}1a`,
                transform: `scale(${0.6 + core * 0.4})`, opacity: core,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1
              }}>
                <div style={{ fontFamily: MF.cinzel, fontSize: 9.5, letterSpacing: 3, color: M.teal }}>AMEN</div>
                <div style={{
                  fontFamily: MF.han, fontSize: 46, lineHeight: 1, color: M.gold,
                  textShadow: `0 0 ${core * 24}px ${M.gold}77`
                }}>17</div>
                <div style={{ fontFamily: MF.cinzel, fontSize: 8, letterSpacing: 2.5, color: M.teal, opacity: 0.85 }}>DISCIPLE</div>
              </div>
            </div>

            {/* 타이틀 */}
            <div style={{
              marginTop: 18, textAlign: 'center',
              transform: `translateY(${-push * 40}px)`
            }}>
              <div style={{ opacity: easeOut(seg(p, 0.4, 0.5)) }}>
                <MoLabel size={11.5}>GRADUATION {G.meta.year}</MoLabel>
              </div>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                <MoReveal text="아멘 17기 졸업" p={p} from={0.46} to={0.72} size={38}
                  style={{ justifyContent: 'center' }}/>
              </div>
            </div>

            {/* 메타 */}
            <div style={{
              position: 'absolute', left: 22, right: 22, bottom: 44,
              opacity: meta, transform: `translateY(${(1 - meta) * 22}px)`
            }}>
              <div style={{
                fontFamily: MF.serif, fontSize: 13.5, color: M.cream,
                opacity: 0.82, textAlign: 'center', fontWeight: 700, lineHeight: 1.7
              }}>
                {G.meta.tagline}<br/>
                <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.8 }}>{G.meta.subTagline}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <div style={{
                  padding: '9px 22px',
                  background: `linear-gradient(90deg,${M.goldDeep},${M.gold},${M.goldDeep})`,
                  color: M.bg, fontFamily: MF.han, fontSize: 14,
                  boxShadow: `0 0 ${meta * 24}px ${M.gold}55`
                }}>{G.when.dateDisplay} · {G.when.dateLabel}</div>
              </div>
            </div>

            {/* 스크롤 힌트 */}
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center',
              opacity: cl(1 - p * 6)
            }}>
              <div style={{
                fontFamily: MF.cinzel, fontSize: 9, letterSpacing: 4,
                color: M.teal, animation: 'moBob 2s ease-in-out infinite'
              }}>SCROLL</div>
            </div>
          </div>
        );
      }}
    </Scene>
  );
}

// ═══════════ 2 · WHEN — 숫자 카운트업 ═══════════
function MoWhen() {
  return (
    <Scene vh={220}>
      {(p) => {
        const head = easeOut(seg(p, 0.04, 0.22));
        const c1 = easeOut(seg(p, 0.2, 0.52));
        const c2 = easeOut(seg(p, 0.42, 0.74));
        const mm = Math.round(lerp(1, 6, easeOut(seg(p, 0.24, 0.56))));
        const dd = Math.round(lerp(1, 3, easeOut(seg(p, 0.3, 0.62))));
        return (
          <div style={{ position: 'relative', height: '100%', padding: '0 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <MoMotes n={10} />
            <div style={{ opacity: head, transform: `translateY(${(1 - head) * 18}px)`, textAlign: 'center' }}>
              <MoLabel>Schedule</MoLabel>
              <div style={{ marginTop: 7, fontFamily: MF.han, fontSize: 30, color: M.cream, letterSpacing: -1 }}>
                일시 · 장소
              </div>
            </div>

            {/* 날짜 — 숫자가 굴러 올라감 */}
            <div style={{
              marginTop: 30, textAlign: 'center',
              opacity: c1, transform: `translateY(${(1 - c1) * 26}px)`
            }}>
              <div style={{
                fontFamily: MF.han, fontSize: 66, lineHeight: 1, color: M.gold,
                letterSpacing: -3, textShadow: `0 0 ${c1 * 26}px ${M.gold}55`,
                fontVariantNumeric: 'tabular-nums'
              }}>
                {String(mm).padStart(2, '0')}<span style={{ color: M.teal, fontSize: 40 }}> · </span>{String(dd).padStart(2, '0')}
              </div>
              <div style={{ marginTop: 6, fontFamily: MF.cinzel, fontSize: 11, letterSpacing: 4, color: M.teal }}>
                {G.meta.year} · {G.when.dayKo}
              </div>
              <div style={{ marginTop: 4, fontFamily: MF.sans, fontSize: 12.5, color: M.cream, opacity: 0.66 }}>
                {G.when.time} · {G.when.dateLabel}
              </div>
            </div>

            {/* 장소 — 가로 라인이 열리며 등장 */}
            <div style={{ marginTop: 34, opacity: c2 }}>
              <div style={{
                height: 1, background: M.teal, opacity: 0.5,
                transform: `scaleX(${c2})`, transformOrigin: 'center'
              }} />
              <div style={{
                padding: '18px 4px', textAlign: 'center',
                transform: `translateY(${(1 - c2) * 16}px)`
              }}>
                <div style={{ fontFamily: MF.cinzel, fontSize: 10, letterSpacing: 3.5, color: M.gold }}>PLACE</div>
                <div style={{ marginTop: 7, fontFamily: MF.han, fontSize: 24, color: M.cream, letterSpacing: -0.6 }}>
                  {G.where.name}
                </div>
                <div style={{ marginTop: 4, fontFamily: MF.sans, fontSize: 12, color: M.cream, opacity: 0.62 }}>
                  {G.where.detail}
                </div>
              </div>
              <div style={{
                height: 1, background: M.teal, opacity: 0.5,
                transform: `scaleX(${c2})`, transformOrigin: 'center'
              }} />
              <div style={{
                marginTop: 12, textAlign: 'center', fontFamily: MF.sans,
                fontSize: 11, color: M.cream, opacity: 0.48
              }}>{G.when.note}</div>
            </div>
          </div>
        );
      }}
    </Scene>
  );
}

// ═══════════ 3 · VIDEO — 프레임 확장 ═══════════
function MoVideo() {
  const [cur, setCur] = useState(0);
  const v = G.videos[cur];
  return (
    <Scene vh={240}>
      {(p) => {
        const head = easeOut(seg(p, 0.03, 0.18));
        const open = easeInOut(seg(p, 0.14, 0.46));   // 프레임 확장
        const ui = easeOut(seg(p, 0.44, 0.62));
        return (
          <div style={{ position: 'relative', height: '100%', padding: '0 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <MoMotes n={14} />
            <div style={{
              position: 'absolute', top: '32%', left: '50%',
              width: 480, height: 480, transform: 'translate(-50%,-50%)',
              pointerEvents: 'none', opacity: open * 0.8,
              background: `radial-gradient(circle, ${M.teal}1e 0%, transparent 66%)`
            }} />

            <div style={{ opacity: head, transform: `translateY(${(1 - head) * 16}px)`, textAlign: 'center' }}>
              <MoLabel>Main Feature</MoLabel>
              <div style={{ marginTop: 7, fontFamily: MF.han, fontSize: 29, color: M.cream, letterSpacing: -1 }}>
                졸업 간증 영상
              </div>
              <div style={{
                marginTop: 8, fontFamily: MF.sans, fontSize: 12.5,
                color: M.cream, opacity: 0.72, lineHeight: 1.65
              }}>{G.videoIntro}</div>
            </div>

            {/* 확장되는 프레임 */}
            <div style={{
              position: 'relative', margin: '20px auto 0', width: '100%', maxWidth: 300
            }}>
              <div style={{
                position: 'relative', width: '100%',
                aspectRatio: '9 / 16', maxHeight: 340,
                transform: `scaleY(${0.08 + open * 0.92})`,
                transformOrigin: 'center',
                border: `1px solid ${M.teal}66`,
                background: `radial-gradient(circle at 50% 40%, ${M.bg3}, #030A14 78%)`,
                boxShadow: `0 0 ${open * 34}px ${M.teal}22`,
                overflow: 'hidden'
              }}>
                <div data-role="video-slot" data-video-key={v.key} style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: cl((open - 0.55) / 0.45)
                }}>
                  <div style={{ textAlign: 'center', padding: 16 }}>
                    <div style={{ width: 58, height: 58, margin: '0 auto', position: 'relative', animation: 'moPulse 2.6s ease-in-out infinite' }}>
                      <svg viewBox="0 0 64 64" style={{ position: 'absolute', inset: 0 }}>
                        <circle cx="32" cy="32" r="30" fill="none" stroke={M.teal} strokeWidth="1" opacity=".6"/>
                        {[0, 1, 2, 3].map(i => (
                          <path key={i} d="M32 0 L35 5 L32 10 L29 5Z" fill={M.gold} transform={`rotate(${i * 90} 32 32)`}/>
                        ))}
                        <path d="M25 20 L45 32 L25 44 Z" fill={M.gold}/>
                      </svg>
                    </div>
                    <div style={{ marginTop: 13, fontFamily: MF.cinzel, fontSize: 10.5, letterSpacing: 4, color: M.teal }}>PLAY</div>
                    <div style={{ marginTop: 5, fontFamily: MF.sans, fontSize: 10.5, color: M.cream, opacity: 0.42 }}>
                      {G.videoNote}
                    </div>
                  </div>
                </div>
              </div>
              {/* 코너 브래킷 */}
              {[[0,0],[1,0],[0,1],[1,1]].map(([x,y],i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 16 16" style={{
                  position: 'absolute',
                  [x ? 'right' : 'left']: -5, [y ? 'bottom' : 'top']: -5,
                  transform: `scale(${x ? -1 : 1},${y ? -1 : 1})`,
                  opacity: open
                }}>
                  <path d="M0 7 L0 0 L7 0" stroke={M.gold} strokeWidth="1.6" fill="none"/>
                </svg>
              ))}
            </div>

            {/* 탭 + 캡션 */}
            <div style={{ opacity: ui, transform: `translateY(${(1 - ui) * 14}px)`, marginTop: 16 }}>
              <div className="gs-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10 }}>
                {G.videos.map((x, i) => {
                  const on = i === cur;
                  return (
                    <button key={x.key} onClick={() => setCur(i)} style={{
                      flex: '0 0 auto', padding: '7px 12px', cursor: 'pointer',
                      background: on ? `linear-gradient(90deg,${M.goldDeep},${M.gold})` : 'rgba(127,233,224,.07)',
                      color: on ? M.bg : M.cream,
                      border: `1px solid ${on ? M.gold : M.line}`,
                      fontFamily: MF.sans, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap'
                    }}>{x.label}</button>
                  );
                })}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: MF.han, fontSize: 19, color: M.gold, letterSpacing: -0.5 }}>{v.sub}</div>
                <div style={{ marginTop: 3, fontFamily: MF.sans, fontSize: 11.5, color: M.cream, opacity: 0.66 }}>
                  {v.desc} · {v.dur}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Scene>
  );
}

// ═══════════ 4 · PHOTOS — 흩어짐 → 정렬 ═══════════
function MoPhotos() {
  const scatter = React.useMemo(() => G.photos.map((_, i) => ({
    x: ((i * 53) % 100 - 50) * 2.6,
    y: ((i * 37) % 100 - 50) * 1.5,
    r: ((i * 29) % 40) - 20,
    s: 0.68 + ((i * 13) % 30) / 100
  })), []);
  return (
    <Scene vh={260}>
      {(p) => {
        const head = easeOut(seg(p, 0.03, 0.18));
        const gather = easeInOut(seg(p, 0.16, 0.72));
        return (
          <div style={{ position: 'relative', height: '100%', padding: '0 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <MoMotes n={10} />
            <div style={{ opacity: head, transform: `translateY(${(1 - head) * 16}px)`, textAlign: 'center', marginBottom: 20 }}>
              <MoLabel>Memories</MoLabel>
              <div style={{ marginTop: 7, fontFamily: MF.han, fontSize: 29, color: M.cream, letterSpacing: -1 }}>
                17기의 순간들
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
              {G.photos.map((ph, i) => {
                const q = scatter[i];
                const k = easeOut(cl((gather * 1.25) - i * 0.045));
                return (
                  <div key={i} data-role="photo-slot" data-photo-index={i} style={{
                    transform: `translate(${q.x * (1 - k)}px, ${q.y * (1 - k)}px) rotate(${q.r * (1 - k)}deg) scale(${lerp(q.s, 1, k)})`,
                    opacity: 0.15 + k * 0.85
                  }}>
                    <div style={{
                      position: 'relative', padding: 4,
                      background: 'linear-gradient(160deg, rgba(127,233,224,.07), rgba(12,35,64,.5))',
                      border: `1px solid ${i % 3 === 0 ? M.gold : M.teal}44`
                    }}>
                      <div style={{
                        aspectRatio: '4 / 3',
                        background: `radial-gradient(circle at 50% 45%, ${M.bg3}55, ${M.bg} 80%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <div style={{
                          fontFamily: MF.cinzel, fontSize: 18, letterSpacing: 2,
                          color: i % 3 === 0 ? M.gold : M.teal, opacity: 0.45
                        }}>{ph.tag}</div>
                      </div>
                      <div style={{
                        marginTop: 4, fontFamily: MF.sans, fontSize: 10,
                        color: M.cream, opacity: 0.7, textAlign: 'center'
                      }}>{ph.caption}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </Scene>
  );
}

// ═══════════ 5 · TIMELINE — 선이 그려짐 ═══════════
function MoTimeline() {
  const n = G.timeline.length;
  return (
    <Scene vh={280}>
      {(p) => {
        const head = easeOut(seg(p, 0.03, 0.16));
        const draw = easeInOut(seg(p, 0.12, 0.86));
        return (
          <div style={{ position: 'relative', height: '100%', padding: '0 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <MoMotes n={12} />
            <div style={{ opacity: head, transform: `translateY(${(1 - head) * 16}px)`, textAlign: 'center', marginBottom: 18 }}>
              <MoLabel>Our Journey</MoLabel>
              <div style={{ marginTop: 7, fontFamily: MF.han, fontSize: 29, color: M.cream, letterSpacing: -1 }}>
                함께 걸어온 길
              </div>
            </div>

            <div style={{ position: 'relative', paddingLeft: 30 }}>
              {/* 그려지는 선 */}
              <svg viewBox="0 0 4 400" preserveAspectRatio="none" style={{
                position: 'absolute', left: 7, top: 8, width: 4, height: 'calc(100% - 16px)'
              }}>
                <line x1="2" y1="0" x2="2" y2="400"
                  stroke={M.teal} strokeWidth="1.6" strokeLinecap="round"
                  strokeDasharray="400" strokeDashoffset={400 * (1 - draw)} opacity="0.75"/>
              </svg>

              {G.timeline.map((t, i) => {
                const k = easeOut(cl((draw * n - i) / 0.85));
                return (
                  <div key={i} style={{
                    position: 'relative', padding: '10px 0',
                    opacity: k, transform: `translateX(${(1 - k) * 18}px)`
                  }}>
                    <div style={{
                      position: 'absolute', left: -30, top: 15,
                      width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{
                        transform: `rotate(45deg) scale(${0.4 + k * 0.6})`, width: 11, height: 11,
                        background: t.now ? M.gold : M.bg,
                        border: `1.3px solid ${t.now ? M.gold : M.teal}`,
                        boxShadow: t.now ? `0 0 ${k * 18}px ${M.gold}99` : 'none'
                      }} />
                    </div>
                    <div style={{ fontFamily: MF.cinzel, fontSize: 10, letterSpacing: 2.5, color: t.now ? M.gold : M.teal }}>
                      {t.period}
                    </div>
                    <div style={{ marginTop: 2, fontFamily: MF.han, fontSize: 19, color: M.cream, letterSpacing: -0.5 }}>
                      {t.title}
                    </div>
                    <div style={{ marginTop: 1, fontFamily: MF.sans, fontSize: 11, color: M.cream, opacity: 0.6, lineHeight: 1.5 }}>
                      {t.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </Scene>
  );
}

// ═══════════ 6 · ROSTER — 이름 순차 등장 + 카운터 ═══════════
function MoRoster() {
  const total = G.roster.length;
  return (
    <Scene vh={240}>
      {(p) => {
        const head = easeOut(seg(p, 0.03, 0.16));
        const cnt = Math.round(lerp(0, total, easeOut(seg(p, 0.1, 0.4))));
        const pop = easeInOut(seg(p, 0.16, 0.66));
        const away = easeOut(seg(p, 0.66, 0.88));
        return (
          <div style={{ position: 'relative', height: '100%', padding: '0 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <MoMotes n={14} />
            <div style={{ opacity: head, transform: `translateY(${(1 - head) * 16}px)`, textAlign: 'center' }}>
              <MoLabel>The Graduates</MoLabel>
              <div style={{
                marginTop: 6, display: 'flex', alignItems: 'baseline',
                justifyContent: 'center', gap: 8
              }}>
                <span style={{
                  fontFamily: MF.han, fontSize: 46, color: M.gold, lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums', textShadow: `0 0 20px ${M.gold}55`
                }}>{cnt}</span>
                <span style={{ fontFamily: MF.han, fontSize: 24, color: M.cream, letterSpacing: -0.8 }}>명 졸업</span>
              </div>
            </div>

            <div style={{
              marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6
            }}>
              {G.roster.map((nm, i) => {
                const k = easeOut(cl((pop * total * 1.2 - i) / 1.4));
                return (
                  <div key={i} style={{
                    padding: '9px 2px', textAlign: 'center',
                    background: 'rgba(127,233,224,.06)', border: `1px solid ${M.line}`,
                    fontFamily: MF.sans, fontSize: 11.5, fontWeight: 700, color: M.cream,
                    opacity: k, transform: `scale(${0.7 + k * 0.3})`
                  }}>{nm}</div>
                );
              })}
            </div>

            <div style={{
              marginTop: 18, padding: '14px 14px',
              border: `1px solid ${M.gold}55`, background: `${M.gold}0f`,
              opacity: away, transform: `translateY(${(1 - away) * 16}px)`
            }}>
              <div style={{ fontFamily: MF.cinzel, fontSize: 9.5, letterSpacing: 3.5, color: M.gold, textAlign: 'center' }}>
                WITH US IN HEART
              </div>
              <div style={{
                marginTop: 4, fontFamily: MF.han, fontSize: 16,
                color: M.cream, letterSpacing: -0.5, textAlign: 'center', marginBottom: 10
              }}>{G.awayNote}</div>
              <div style={{ display: 'grid', gap: 7 }}>
                {G.away.map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingBottom: 6,
                    borderBottom: i < G.away.length - 1 ? `1px solid ${M.line}` : 'none'
                  }}>
                    <span style={{ fontFamily: MF.sans, fontSize: 12.5, fontWeight: 700, color: M.cream }}>{a.name}</span>
                    <span style={{ fontFamily: MF.cinzel, fontSize: 10, letterSpacing: 1.5, color: M.gold }}>{a.reason}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              marginTop: 9, textAlign: 'center', fontFamily: MF.sans,
              fontSize: 10, color: M.cream, opacity: 0.42 * away
            }}>{G.rosterNote}</div>
          </div>
        );
      }}
    </Scene>
  );
}

// ═══════════ 7 · CLOSING — 파티클 상승 ═══════════
function MoClosing() {
  return (
    <Scene vh={230}>
      {(p) => {
        const rise = easeInOut(seg(p, 0.05, 0.8));
        const lines = G.closing.lines;
        return (
          <div style={{ position: 'relative', height: '100%', padding: '0 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <MoMotes n={24} rise={rise} />
            <div style={{
              position: 'absolute', bottom: '-20%', left: '50%',
              width: 520, height: 520, transform: `translateX(-50%) scale(${0.6 + rise * 0.6})`,
              pointerEvents: 'none', opacity: 0.2 + rise * 0.4,
              background: `radial-gradient(circle, ${M.gold}1e 0%, transparent 68%)`
            }} />
            <div style={{ textAlign: 'center', opacity: easeOut(seg(p, 0.03, 0.16)) }}>
              <MoLabel>Closing</MoLabel>
            </div>
            <div style={{ marginTop: 18, textAlign: 'center' }}>
              {lines.map((l, i) => {
                const k = easeOut(seg(p, 0.14 + i * 0.075, 0.34 + i * 0.075));
                return (
                  <div key={i} style={{
                    minHeight: l === '' ? 13 : 'auto',
                    fontFamily: MF.serif, fontSize: 15.5, lineHeight: 1.95,
                    color: M.cream, opacity: k * 0.94,
                    transform: `translateY(${(1 - k) * 18}px)`
                  }}>{l}</div>
                );
              })}
            </div>
            <div style={{
              marginTop: 24, textAlign: 'center',
              opacity: easeOut(seg(p, 0.7, 0.86))
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                fontFamily: MF.han, fontSize: 17, color: M.gold, letterSpacing: -0.5,
                textShadow: `0 0 18px ${M.gold}44`
              }}>
                <svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 0 L10 5 L5 10 L0 5Z" fill={M.gold}/></svg>
                {G.closing.sign}
                <svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 0 L10 5 L5 10 L0 5Z" fill={M.gold}/></svg>
              </div>
            </div>
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 26, textAlign: 'center',
              fontFamily: MF.cinzel, fontSize: 8.5, letterSpacing: 3,
              color: M.cream, opacity: 0.32 * easeOut(seg(p, 0.8, 0.95))
            }}>© {G.meta.org} · {G.meta.cohortEn} · {G.meta.year}</div>
          </div>
        );
      }}
    </Scene>
  );
}

// ── 전체 진행 인디케이터 ──
function MoProgress({ rootRef }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const on = () => {
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener('scroll', on, { passive: true });
    on();
    return () => el.removeEventListener('scroll', on);
  }, []);
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
      background: 'rgba(255,255,255,.08)', zIndex: 80, pointerEvents: 'none'
    }}>
      <div style={{
        height: '100%', width: `${p * 100}%`,
        background: `linear-gradient(90deg,${M.teal},${M.gold})`,
        boxShadow: `0 0 10px ${M.gold}77`
      }} />
    </div>
  );
}

function MotionApp() {
  const rootRef = useRef(null);
  return (
    <div style={{
      position: 'relative', width: '100%', maxWidth: 460, height: '100dvh',
      margin: '0 auto', overflow: 'hidden',
      boxShadow: '0 0 70px rgba(0,0,0,.6)'
    }}>
      <MoProgress rootRef={rootRef} />
      <div ref={rootRef} data-scroll-root className="gs-scroll" style={{
        height: '100%', overflowY: 'auto', overflowX: 'hidden',
        background: `linear-gradient(180deg, ${M.bg} 0%, ${M.bg2} 30%, ${M.bg} 58%, ${M.bg2} 82%, ${M.bg} 100%)`,
        WebkitOverflowScrolling: 'touch'
      }}>
        <MoHero />
        <MoWhen />
        <MoVideo />
        <MoPhotos />
        <MoTimeline />
        <MoRoster />
        <MoClosing />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MotionApp />);
