import type { CSSProperties } from 'react';

type SealProps = {
  size?: number;
  style?: CSSProperties;
};

/** 왁스 씰. 원본 670×559 / 222KB를 배포 용량 문제로 360×300 / 73KB로 축소한 버전. */
export function Seal({ size = 74, style }: SealProps) {
  return (
    <img
      src="/seal/wax-seal.png"
      alt="AMEN 17 실링왁스"
      style={{
        width: size, height: size,
        objectFit: 'contain', display: 'block',
        ...style,
      }}
    />
  );
}
