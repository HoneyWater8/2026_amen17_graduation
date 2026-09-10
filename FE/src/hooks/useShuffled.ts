import { useState } from 'react';

function shuffle<T>(items: T[]): T[] {
  // Fisher-Yates — 원본은 건드리지 않는다.
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 배열을 마운트 시 1회 셔플. 새로고침할 때마다 순서가 달라진다.
 *
 * useMemo가 아니라 useState의 lazy initializer를 쓴다.
 * useMemo는 순수해야 하므로 Math.random()을 넣으면 react-hooks/purity에 걸리고,
 * 언제든 재계산될 수 있어 순서가 도중에 뒤바뀔 수도 있다.
 */
export function useShuffled<T>(items: T[]): T[] {
  const [shuffled] = useState(() => shuffle(items));
  return shuffled;
}
