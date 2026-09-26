import type { CSSProperties } from 'react';
import waxSeal from '../../assets/wax-seal.webp';

type SealProps = {
  size?: number;
  style?: CSSProperties;
};

/** 같은 360×300 이미지를 무손실 WebP로 제공하며 빌드 시 해시 경로로 캐시한다. */
export function Seal({ size = 74, style }: SealProps) {
  return (
    <img
      src={waxSeal}
      alt="AMEN 17 실링왁스"
      style={{
        width: size, height: size,
        objectFit: 'contain', display: 'block',
        ...style,
      }}
    />
  );
}
