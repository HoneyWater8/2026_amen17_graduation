import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  /**
   * false면 관찰을 시작하지 않는다.
   * 봉투가 열리기 전 본문 애니메이션이 미리 소진되는 것을 막는 게이트 — 반드시 유지.
   */
  active?: boolean;
};

/** 스크롤 진입 시 페이드 + 상승. */
export function Reveal({ children, delay = 0, y = 18, active = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref, active);
  const reduced = usePrefersReducedMotion();
  // 모션 감소 모드에선 트랜지션 없이 즉시 visible.
  const visible = reduced || shown;
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : `translateY(${y}px)`,
      transition: reduced
        ? 'none'
        : `opacity .8s ease ${delay}s, transform 1s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}
