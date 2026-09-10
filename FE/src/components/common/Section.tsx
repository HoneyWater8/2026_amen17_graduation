import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { EV } from '../../theme/tokens';
import { track } from '../../utils/analytics';

type SectionProps = {
  children: ReactNode;
  bg?: string;
  pad?: string;
  /** 개발용 섹션 식별 라벨 (예: "01 Cover") */
  label?: string;
};

/**
 * 섹션 래퍼.
 * min-height: 100% 로 스크롤 리듬을 통일하고, 내용이 적어도 세로 중앙에 놓는다.
 */
export function Section({ children, bg = EV.paper, pad = '52px 22px', label }: SectionProps) {
  const ref = useRef<HTMLElement>(null);

  // 어느 섹션까지 내려갔는지 — 스크롤 깊이를 섹션 단위로 집계한다.
  useEffect(() => {
    const el = ref.current;
    if (!el || !label) return;
    const root = el.closest('[data-scroll-root]');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) track('section_view', { section: label }, true);
      },
      { threshold: 0.4, root: root as Element | null }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [label]);

  return (
    <section
      ref={ref}
      data-screen-label={label}
      style={{
        background: bg, padding: pad, position: 'relative',
        minHeight: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {children}
    </section>
  );
}
