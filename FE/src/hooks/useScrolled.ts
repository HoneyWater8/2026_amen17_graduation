import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * data-scroll-root 컨테이너가 threshold(px) 이상 스크롤됐는지 판정.
 *
 * 한 번 true가 되면 되돌아가지 않는다 — 스크롤 힌트처럼 "사용자가 이미 알아챘다"를
 * 다루는 용도라, 다시 맨 위로 올라가도 힌트가 되살아나면 잔소리처럼 느껴진다.
 *
 * @param ref 스크롤 컨테이너 안에 있는 아무 요소 (useReveal과 같은 방식으로 root를 찾는다)
 */
export function useScrolled(ref: RefObject<HTMLElement | null>, threshold = 60) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || scrolled) return;
    const root = el.closest('[data-scroll-root]');
    if (!root) return;

    const onScroll = () => {
      if (root.scrollTop > threshold) setScrolled(true);
    };
    root.addEventListener('scroll', onScroll, { passive: true });
    // 새로고침으로 이미 내려가 있는 상태를 대비해 한 번 즉시 판정.
    onScroll();
    return () => root.removeEventListener('scroll', onScroll);
  }, [ref, scrolled, threshold]);

  return scrolled;
}
