import type { ReactNode } from 'react';
import { EV } from '../../theme/tokens';

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
  return (
    <section
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
