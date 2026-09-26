/* ───── 화면 근처 자산 준비와 실제 표시 중 모션을 구분한다 ───── */
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

export function useInView(
  ref: RefObject<HTMLElement | null>, active: boolean, rootMargin = '0px', once = false,
) {
  const [inView, setInView] = useState(false);
  const enteredOnce = once && inView;
  useEffect(() => {
    const element = ref.current;
    if (!active || !element || enteredOnce) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { root: element.closest('[data-scroll-root]'), rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, active, rootMargin, enteredOnce]);
  return active && inView;
}
