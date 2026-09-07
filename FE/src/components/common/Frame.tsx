import type { ReactNode } from 'react';
import { EV } from '../../theme/tokens';
import { CornerOrnaments } from './CornerOrnaments';

type FrameProps = {
  children: ReactNode;
  /** 내용 패딩 (CSS padding 문자열 또는 px 숫자) */
  pad?: string | number;
  /** true면 섹션 전체를 채우도록 늘어남 */
  fill?: boolean;
};

/** 금박 이중 테두리 + 모서리 장식 프레임. */
export function Frame({ children, pad = 22, fill = false }: FrameProps) {
  return (
    <div style={{
      position: 'relative', padding: 9,
      ...(fill ? { flex: 1, alignSelf: 'stretch', display: 'flex' } : {}),
    }}>
      <div style={{ position: 'absolute', inset: 0, border: `1.5px solid ${EV.gold}`, opacity: 0.75 }} />
      <div style={{ position: 'absolute', inset: 4, border: `.5px solid ${EV.gold}`, opacity: 0.5 }} />
      <CornerOrnaments size={16} inset={2} dotRadius={1.4} />
      <div style={{
        position: 'relative', padding: pad,
        ...(fill ? { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' } : {}),
      }}>
        {children}
      </div>
    </div>
  );
}
