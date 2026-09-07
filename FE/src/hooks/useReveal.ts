import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * 요소가 뷰포트에 들어왔는지 1회 판정. data-scroll-root 컨테이너 기준.
 *
 * @param active false면 관찰 자체를 시작하지 않는다.
 *   봉투가 열리기 전(stage !== 'out') 본문 등장 애니메이션이 미리 소진되는 것을 막는 게이트.
 */
export function useReveal(ref: RefObject<HTMLElement | null>, active = true) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!active || !el || shown) return;
    const root = el.closest('[data-scroll-root]');
    const rect = el.getBoundingClientRect();
    const rootRect = root
      ? (root as HTMLElement).getBoundingClientRect()
      : { top: 0, bottom: window.innerHeight };
    // 이미 화면 안이면 관찰 없이 즉시 표시.
    if (rect.top < rootRect.bottom && rect.bottom > rootRect.top) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShown(true); },
      { threshold: 0.12, root: root as Element | null, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, shown, active]);
  return shown;
}
