/* 방식 3 · 봉투 개봉 (Envelope) — 졸업장 스킨
   봉투 탭 → 플랩 열림 → 졸업장 슬라이드 아웃 → 세로 전개 */

const {
  useState,
  useEffect,
  useRef
} = React;
const G = window.GRAD;
const E = {
  paper: '#FBF7EE',
  paperDeep: '#F2EADA',
  envel: '#EDE2CB',
  envelDk: '#DFD0B2',
  ink: '#1E1B16',
  inkSoft: '#5A5348',
  gold: '#A8862C',
  goldLt: '#D8BE72',
  seal: '#8C2B22',
  goldTx: '#6F5719',
  line: 'rgba(30,27,22,0.14)'
};
const EF = {
  serif: '"Nanum Myeongjo",serif',
  latin: '"Cinzel Decorative","Nanum Myeongjo",serif',
  sans: '"Nanum Myeongjo",serif'
};
function evReveal(ref, active) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!active || !ref.current || on) return;
    const root = ref.current.closest('[data-scroll-root]');
    const r = ref.current.getBoundingClientRect();
    const rr = root ? root.getBoundingClientRect() : {
      top: 0,
      bottom: innerHeight
    };
    if (r.top < rr.bottom && r.bottom > rr.top) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setOn(true);
    }, {
      threshold: 0.12,
      root,
      rootMargin: '0px 0px -8% 0px'
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [on, active]);
  return on;
}
function EvUp({
  children,
  delay = 0,
  y = 18,
  active = true
}) {
  const ref = useRef(null);
  const on = evReveal(ref, active);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      opacity: on ? 1 : 0,
      transform: on ? 'none' : `translateY(${y}px)`,
      transition: `opacity .8s ease ${delay}s, transform 1s cubic-bezier(.22,1,.36,1) ${delay}s`
    }
  }, children);
}

// 가로 캐러셀: 드래그 + Shift+휠 이동
function useDragScroll() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false,
      startX = 0,
      startLeft = 0,
      moved = 0;
    const onDown = e => {
      if (e.pointerType === 'touch') return;
      if (e.button !== undefined && e.button !== 0) return;
      down = true;
      moved = 0;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };
    const onMove = e => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) {
        if (!el.hasPointerCapture?.(e.pointerId)) {
          try {
            el.setPointerCapture(e.pointerId);
          } catch (_) {}
        }
        el.style.scrollSnapType = 'none';
      }
      moved = Math.max(moved, Math.abs(dx));
      el.scrollLeft = startLeft - dx;
    };
    const onUp = e => {
      if (!down) return;
      down = false;
      el.style.cursor = 'grab';
      el.style.scrollSnapType = 'x mandatory';
      try {
        el.releasePointerCapture?.(e.pointerId);
      } catch (_) {}
    };
    const onWheel = e => {
      const horiz = e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!horiz) return;
      const d = e.shiftKey && Math.abs(e.deltaX) < Math.abs(e.deltaY) ? e.deltaY : e.deltaX || e.deltaY;
      const max = el.scrollWidth - el.clientWidth;
      if (d < 0 && el.scrollLeft <= 0 || d > 0 && el.scrollLeft >= max) return;
      e.preventDefault();
      el.scrollLeft += d;
    };
    const onClickCapture = e => {
      if (moved > 4) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, {
      passive: false
    });
    el.addEventListener('click', onClickCapture, true);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, []);
  return ref;
}
function EvPhotoRail({
  photos
}) {
  const railRef = useDragScroll();
  return /*#__PURE__*/React.createElement("div", {
    ref: railRef,
    className: "gs-scroll",
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 9,
      overflowX: 'auto',
      scrollSnapType: 'x mandatory',
      paddingBottom: 2,
      marginRight: -22,
      userSelect: 'none',
      WebkitUserSelect: 'none',
      touchAction: 'pan-x pan-y',
      WebkitOverflowScrolling: 'touch'
    }
  }, photos.map((p, j) => /*#__PURE__*/React.createElement("div", {
    key: j,
    "data-role": "photo-slot",
    "data-photo-tag": p.tag,
    style: {
      flex: '0 0 auto',
      width: 128,
      scrollSnapAlign: 'start',
      background: E.paperDeep,
      border: `1px solid ${E.line}`,
      padding: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4 / 3',
      border: `1px dashed ${E.gold}66`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: EF.latin,
      fontSize: 15,
      letterSpacing: 1,
      color: E.seal
    }
  }, p.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      fontFamily: EF.sans,
      fontSize: 10,
      color: E.inkSoft,
      textAlign: 'center'
    }
  }, p.caption))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 14px'
    }
  }));
}
function EvRule({
  w = 100
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      margin: '16px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      height: 1,
      width: w / 2,
      background: `linear-gradient(90deg,transparent,${E.seal})`
    }
  }), /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "9",
    viewBox: "0 0 9 9"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4.5 0 L9 4.5 L4.5 9 L0 4.5Z",
    fill: E.seal
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      height: 1,
      width: w / 2,
      background: `linear-gradient(90deg,${E.seal},transparent)`
    }
  }));
}
function EvSeal({
  size = 74
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: window.__resources && window.__resources.waxSeal || 'assets/wax-seal-sm.png',
    alt: "AMEN 17 \uC2E4\uB9C1\uC641\uC2A4",
    style: {
      width: size,
      height: size,
      objectFit: 'contain',
      display: 'block'
    }
  });
}
function EvHead({
  ko,
  en
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: EF.latin,
      fontSize: 14,
      letterSpacing: 2,
      color: E.seal,
      textTransform: 'uppercase'
    }
  }, en), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 7,
      fontFamily: EF.serif,
      fontSize: 25,
      fontWeight: 700,
      color: E.ink,
      letterSpacing: -0.5
    }
  }, ko), /*#__PURE__*/React.createElement(EvRule, {
    w: 80
  }));
}
function EvFrame({
  children,
  pad = 22,
  fill = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: 9,
      ...(fill ? {
        flex: 1,
        alignSelf: 'stretch',
        display: 'flex'
      } : {})
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      border: `1.5px solid ${E.gold}`,
      opacity: .75
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 4,
      border: `.5px solid ${E.gold}`,
      opacity: .5
    }
  }), [[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => /*#__PURE__*/React.createElement("svg", {
    key: i,
    width: "16",
    height: "16",
    viewBox: "0 0 18 18",
    style: {
      position: 'absolute',
      [x ? 'right' : 'left']: 2,
      [y ? 'bottom' : 'top']: 2,
      transform: `scale(${x ? -1 : 1},${y ? -1 : 1})`
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1 L1 8 M1 1 L8 1 M1 1 L6 6",
    stroke: E.gold,
    strokeWidth: "1",
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "9",
    r: "1.4",
    fill: E.gold
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: pad,
      ...(fill ? {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      } : {})
    }
  }, children));
}

// ── 봉투 화면 ──
function EvEnvelope({
  stage,
  onOpen
}) {
  // stage: 'closed' | 'opening' | 'out'
  const opening = stage !== 'closed';
  return /*#__PURE__*/React.createElement("div", {
    onClick: opening ? undefined : onOpen,
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: `radial-gradient(ellipse at 50% 40%, ${E.paperDeep} 0%, #E5DCC8 72%)`,
      zIndex: 20,
      cursor: opening ? 'default' : 'pointer',
      opacity: stage === 'out' ? 0 : 1,
      pointerEvents: stage === 'out' ? 'none' : 'auto',
      transition: 'opacity .5s ease .55s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 320,
      textAlign: 'center',
      marginTop: '18%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: EF.serif,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 2,
      color: E.goldTx,
      opacity: opening ? 0 : 1,
      transition: 'opacity .3s ease'
    }
  }, G.meta.org), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 22,
      aspectRatio: '3 / 2',
      perspective: 900
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '10%',
      right: '10%',
      top: '6%',
      aspectRatio: '3 / 2.1',
      background: E.paper,
      border: `1px solid ${E.line}`,
      boxShadow: '0 10px 28px rgba(0,0,0,.18)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      padding: '20px 18px',
      overflow: 'hidden',
      transform: opening ? 'translateY(-72%)' : 'translateY(0)',
      transition: 'transform 1.05s cubic-bezier(.22,1,.36,1) .35s',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 7,
      border: `1.5px solid ${E.gold}`,
      opacity: .75,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 11,
      border: `.5px solid ${E.gold}`,
      opacity: .5,
      pointerEvents: 'none'
    }
  }), [[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy], ci) => /*#__PURE__*/React.createElement("svg", {
    key: ci,
    width: "14",
    height: "14",
    viewBox: "0 0 18 18",
    style: {
      position: 'absolute',
      [cx ? 'right' : 'left']: 9,
      [cy ? 'bottom' : 'top']: 9,
      transform: `scale(${cx ? -1 : 1},${cy ? -1 : 1})`,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1 L1 8 M1 1 L8 1 M1 1 L6 6",
    stroke: E.gold,
    strokeWidth: "1",
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "9",
    r: "1.3",
    fill: E.gold
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: EF.latin,
      fontSize: 10.5,
      letterSpacing: 2,
      color: E.seal
    }
  }, G.meta.cohortEn), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: EF.serif,
      fontSize: 19,
      fontWeight: 700,
      color: E.ink,
      lineHeight: 1.2,
      letterSpacing: -0.5
    }
  }, "\uC544\uBA58 \uC81C\uC790", /*#__PURE__*/React.createElement("br", null), "17\uAE30 \uC878\uC5C5"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(EvSeal, {
    size: 46
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: E.envel,
      border: `1px solid ${E.envelDk}`,
      zIndex: 2,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      boxShadow: 'inset 0 6px 14px rgba(0,0,0,.05), 0 12px 30px rgba(0,0,0,.14)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 300 200",
    preserveAspectRatio: "none",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 200 L150 108 L300 200 Z",
    fill: E.envelDk,
    opacity: ".55"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 0 L0 200 L150 108 Z",
    fill: E.envelDk,
    opacity: ".3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M300 0 L300 200 L150 108 Z",
    fill: E.envelDk,
    opacity: ".3"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '56%',
      transformOrigin: 'top center',
      zIndex: opening ? 0 : 3,
      transform: opening ? 'rotateX(-172deg)' : 'rotateX(0deg)',
      transition: 'transform .85s cubic-bezier(.5,.05,.3,1), z-index 0s linear .42s',
      transformStyle: 'preserve-3d'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 300 168",
    preserveAspectRatio: "none",
    style: {
      width: '100%',
      height: '100%',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "evFlapSh",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#fff",
    stopOpacity: ".5"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#000",
    stopOpacity: ".12"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "evFlapIn",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#000",
    stopOpacity: ".14"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#fff",
    stopOpacity: ".35"
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M0 0 L300 0 L150 160 Z",
    fill: E.envel,
    stroke: E.envelDk,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 0 L300 0 L150 160 Z",
    fill: opening ? 'url(#evFlapIn)' : 'url(#evFlapSh)',
    opacity: ".55"
  }))), /*#__PURE__*/React.createElement("img", {
    src: window.__resources && window.__resources.waxSeal || 'assets/wax-seal-sm.png',
    alt: "AMEN 17 \uC2E4\uB9C1\uC641\uC2A4",
    style: {
      position: 'absolute',
      left: '50%',
      top: '52%',
      transform: 'translate(-50%,-50%)',
      zIndex: 4,
      opacity: opening ? 0 : 1,
      transition: 'opacity .3s ease',
      width: 118,
      height: 118,
      objectFit: 'contain',
      filter: 'drop-shadow(0 3px 7px rgba(0,0,0,.3))'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 10,
      marginTop: 34,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      fontFamily: EF.serif,
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: 1,
      color: E.ink,
      opacity: opening ? 0 : 1,
      transition: 'opacity .3s ease',
      animation: opening ? 'none' : 'evBreathe 2.4s ease-in-out infinite'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "6.5",
    fill: "none",
    stroke: E.gold,
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "2.4",
    fill: E.gold
  })), "\uD654\uBA74\uC744 \uB20C\uB7EC \uD3B8\uC9C0\uB97C \uC5F4\uC5B4\uBCF4\uC138\uC694")));
}

// ── 졸업장 본문 (스크롤) ──
function EvSec({
  children,
  bg = E.paper,
  pad = '52px 22px'
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: bg,
      padding: pad,
      position: 'relative',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, children);
}
function EvContent({
  active
}) {
  const [curV, setCurV] = useState(0);
  const v = G.videos[curV];
  return /*#__PURE__*/React.createElement("div", {
    "data-scroll-root": true,
    className: "gs-scroll",
    style: {
      position: 'absolute',
      inset: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      background: E.paper,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(EvSec, {
    pad: "14px"
  }, /*#__PURE__*/React.createElement(EvFrame, {
    pad: "34px 20px 30px",
    fill: true
  }, /*#__PURE__*/React.createElement(EvUp, {
    active: active
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: EF.serif,
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: 2,
      color: E.goldTx
    }
  }, G.meta.org), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontFamily: EF.latin,
      fontSize: 17,
      letterSpacing: 3,
      color: E.seal
    }
  }, G.meta.cohortEn), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 9,
      fontFamily: EF.serif,
      fontSize: 38,
      fontWeight: 700,
      color: E.ink,
      lineHeight: 1.15,
      letterSpacing: -1
    }
  }, "\uC544\uBA58 \uC81C\uC790", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: E.gold
    }
  }, "17\uAE30"), " \uC878\uC5C5"), /*#__PURE__*/React.createElement(EvRule, {
    w: 100
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: EF.serif,
      fontSize: 13.5,
      color: E.inkSoft,
      lineHeight: 1.8
    }
  }, G.meta.tagline, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      opacity: .82
    }
  }, G.meta.subTagline)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(EvSeal, {
    size: 112
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontFamily: EF.sans,
      fontSize: 11,
      color: E.inkSoft,
      letterSpacing: 1
    }
  }, G.when.dateDisplay, " \xB7 ", G.when.dayKo, " ", G.when.time, " \xB7 ", G.where.name))))), /*#__PURE__*/React.createElement(EvSec, {
    bg: E.paperDeep
  }, /*#__PURE__*/React.createElement(EvUp, {
    active: active
  }, /*#__PURE__*/React.createElement(EvHead, {
    ko: "\uC878\uC5C5 \uAC04\uC99D \uC601\uC0C1",
    en: "Testimony"
  })), /*#__PURE__*/React.createElement(EvUp, {
    delay: .06,
    active: active
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${E.gold}`,
      padding: 6,
      background: E.paperDeep
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-role": "video-slot",
    "data-video-key": v.key,
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: '9 / 16',
      maxHeight: 420,
      margin: '0 auto',
      background: '#141210',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "44",
    height: "44",
    viewBox: "0 0 46 46",
    style: {
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "23",
    cy: "23",
    r: "22",
    fill: "none",
    stroke: E.goldLt,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 14 L33 23 L18 32 Z",
    fill: E.goldLt
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontFamily: EF.latin,
      fontSize: 10,
      letterSpacing: 3,
      color: E.goldLt
    }
  }, "VIDEO"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      fontFamily: EF.sans,
      fontSize: 11,
      color: 'rgba(255,255,255,.55)'
    }
  }, G.videoNote)))))), /*#__PURE__*/React.createElement(EvSec, {
    bg: E.paper
  }, /*#__PURE__*/React.createElement(EvUp, {
    active: active
  }, /*#__PURE__*/React.createElement(EvHead, {
    ko: "\uD568\uAED8 \uAC78\uC5B4\uC628 \uAE38",
    en: "Our Journey"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      paddingLeft: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 5,
      top: 6,
      bottom: 6,
      width: 1,
      background: `linear-gradient(${E.gold},${E.gold}22)`
    }
  }), G.timeline.map((t, i) => /*#__PURE__*/React.createElement(EvUp, {
    key: i,
    delay: i * .05,
    y: 12,
    active: active
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '11px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: -22,
      top: 15,
      width: 11,
      height: 11,
      transform: 'rotate(45deg)',
      background: t.now ? E.seal : E.paper,
      border: `1px solid ${E.seal}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: EF.serif,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 0,
      color: E.seal
    }
  }, t.period), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontFamily: EF.serif,
      fontSize: 16,
      fontWeight: 700,
      color: E.ink
    }
  }, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontFamily: EF.sans,
      fontSize: 11,
      color: E.inkSoft,
      lineHeight: 1.5
    }
  }, t.desc), t.photos && /*#__PURE__*/React.createElement(EvPhotoRail, {
    photos: t.photos
  })))))), /*#__PURE__*/React.createElement(EvSec, {
    bg: E.paperDeep
  }, /*#__PURE__*/React.createElement(EvUp, {
    active: active
  }, /*#__PURE__*/React.createElement(EvHead, {
    ko: "\uC878\uC5C5\uC0DD \uC804\uC6D0",
    en: "Graduates"
  })), /*#__PURE__*/React.createElement(EvUp, {
    delay: .06,
    active: active
  }, /*#__PURE__*/React.createElement(EvFrame, {
    pad: "18px 14px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: '7px 4px'
    }
  }, G.roster.map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontFamily: EF.serif,
      fontSize: 12,
      color: E.ink,
      textAlign: 'center',
      letterSpacing: 0.5
    }
  }, n)))))), /*#__PURE__*/React.createElement(EvSec, {
    bg: E.paper,
    pad: "52px 22px 28px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(EvUp, {
    active: active
  }, /*#__PURE__*/React.createElement(EvHead, {
    ko: "\uB9FA\uB294 \uB9D0",
    en: "Closing"
  })), /*#__PURE__*/React.createElement(EvUp, {
    delay: .08,
    active: active
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: EF.serif,
      fontSize: 14.5,
      lineHeight: 2,
      color: E.ink,
      textAlign: 'center'
    }
  }, G.closing.lines.map((l, i) => {
    const first = i === 0;
    const last = i === G.closing.lines.length - 1;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        minHeight: l === '' ? 12 : 'auto'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-block'
      }
    }, first && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        right: '100%',
        marginRight: 5,
        top: 0,
        color: E.goldTx,
        whiteSpace: 'nowrap'
      }
    }, "\u300E"), l, last && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: '100%',
        marginLeft: 5,
        top: 0,
        color: E.goldTx,
        whiteSpace: 'nowrap'
      }
    }, "\u300F")));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontFamily: EF.serif,
      fontSize: 12.5,
      fontWeight: 700,
      color: E.goldTx,
      letterSpacing: 0.5,
      lineHeight: 1.6
    }
  }, G.closing.sign)), /*#__PURE__*/React.createElement(EvRule, {
    w: 72
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontFamily: EF.serif,
      fontSize: 11,
      letterSpacing: 0.5,
      color: E.inkSoft,
      opacity: .85
    }
  }, "\xA9 ", G.meta.org, " \xB7 ", G.meta.cohortEn, " \xB7 ", G.meta.year)));
}
function EnvelopeApp() {
  const [stage, setStage] = useState('closed'); // closed → opening → out

  const open = () => {
    setStage('opening');
    setTimeout(() => setStage('out'), 1500);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 460,
      height: '100dvh',
      margin: '0 auto',
      overflow: 'hidden',
      background: E.paper,
      boxShadow: '0 0 60px rgba(0,0,0,.16)'
    }
  }, /*#__PURE__*/React.createElement(EvContent, {
    active: stage === 'out'
  }), /*#__PURE__*/React.createElement(EvEnvelope, {
    stage: stage,
    onOpen: open
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(EnvelopeApp, null));