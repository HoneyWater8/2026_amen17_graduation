import { useEffect, useRef, useState } from 'react';
import { EV, FF, MOTION } from '../../theme/tokens';
import { useScrolled } from '../../hooks/useScrolled';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type ScrollHintProps = {
  /** 봉투가 열린 뒤(stage === 'out')에만 등장 */
  active: boolean;
  /** active가 된 뒤 힌트가 뜨기까지의 지연 (ms). 표지 Reveal이 끝난 다음에 나오도록 */
  delay?: number;
};

/**
 * 표지 하단 스크롤 힌트.
 * 아래에 더 있다는 것을 알리고, 사용자가 한 번이라도 스크롤하면 영구히 사라진다.
 */
export function ScrollHint({ active, delay = 1500 }: ScrollHintProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrolled = useScrolled(ref);
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(timer);
  }, [active, delay]);

  const visible = active && ready && !scrolled;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: 'absolute', left: '50%', bottom: 24,
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
        opacity: visible ? 1 : 0,
        transition: 'opacity .6s ease',
        pointerEvents: 'none', zIndex: 3, whiteSpace: 'nowrap',
      }}
    >
      {/* 11px 텍스트라 장식용 gold(paper 위 3.21:1)가 아니라 goldTx를 써야 한다 */}
      <span style={{ fontFamily: FF.serif, fontSize: 11, letterSpacing: 1, color: EV.goldTx }}>
        아래로 스크롤
      </span>

      <div style={{ position: 'relative', width: 9, height: 27 }}>
        {/* 다이아몬드가 올라갈 궤적. 출발점(아래)이 진하고 위로 갈수록 옅어진다 */}
        <div style={{
          position: 'absolute', left: '50%', top: 1, width: 1, height: 25,
          transform: 'translateX(-50%)',
          background: `linear-gradient(transparent, ${EV.gold})`, opacity: 0.5,
        }} />
        {/* Rule의 ◆ 모티프를 그대로 가져와 톤을 맞춘다. 아래에서 시작해 위로 올라간다 */}
        <div style={{
          position: 'absolute', left: '50%', bottom: 0, width: 7, height: 7,
          background: EV.seal,
          transform: 'translateX(-50%) rotate(45deg)',
          animation: reduced ? undefined : MOTION.scrollHint,
        }} />
      </div>
    </div>
  );
}
