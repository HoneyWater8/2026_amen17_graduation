import type { CSSProperties } from 'react';
import { EV } from '../../theme/tokens';

/** [x, y] — 0이면 left/top, 1이면 right/bottom */
const CORNERS: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];

type CornerOrnamentsProps = {
  size?: number;
  /** 부모 모서리로부터의 거리 */
  inset?: number;
  dotRadius?: number;
};

/** 금박 프레임 네 모서리 장식. 부모가 position: relative 여야 함. */
export function CornerOrnaments({ size = 16, inset = 2, dotRadius = 1.4 }: CornerOrnamentsProps) {
  return (
    <>
      {CORNERS.map(([x, y], i) => {
        const style: CSSProperties = {
          position: 'absolute',
          transform: `scale(${x ? -1 : 1},${y ? -1 : 1})`,
          pointerEvents: 'none',
          ...(x ? { right: inset } : { left: inset }),
          ...(y ? { bottom: inset } : { top: inset }),
        };
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 18 18" style={style}>
            <path d="M1 1 L1 8 M1 1 L8 1 M1 1 L6 6" stroke={EV.gold} strokeWidth="1" fill="none" />
            <circle cx="9" cy="9" r={dotRadius} fill={EV.gold} />
          </svg>
        );
      })}
    </>
  );
}
