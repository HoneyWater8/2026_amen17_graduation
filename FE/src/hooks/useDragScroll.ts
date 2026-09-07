import { useEffect, useRef } from 'react';

/**
 * 가로 캐러셀 조작 3종을 한 컨테이너에 부착.
 *
 *  1. 터치      — 네이티브 스크롤. JS가 개입하지 않는다 (touch-action: pan-x pan-y).
 *  2. 마우스 드래그 — pointer 이벤트로 scrollLeft 조작. pointerType === 'touch'는 제외.
 *  3. Shift + 휠  — 양 끝에 닿으면 preventDefault 하지 않아 페이지 세로 스크롤로 양보.
 *
 * React state를 쓰지 않고 DOM ref + 리스너만 사용 — 60fps 드래그를 위한 의도적 선택.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false, startX = 0, startLeft = 0, moved = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (e.button !== undefined && e.button !== 0) return;
      down = true; moved = 0;
      startX = e.clientX; startLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };

    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) {
        if (!el.hasPointerCapture?.(e.pointerId)) {
          try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
        }
        el.style.scrollSnapType = 'none';
      }
      moved = Math.max(moved, Math.abs(dx));
      el.scrollLeft = startLeft - dx;
    };

    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      el.style.cursor = 'grab';
      // ⚠ ''로 지우면 안 된다. 인라인 스타일로만 지정된 값이라 fallback CSS가 없어
      //    스냅이 영구히 꺼진다. 반드시 원래 값으로 명시 복원.
      el.style.scrollSnapType = 'x mandatory';
      try { el.releasePointerCapture?.(e.pointerId); } catch { /* ignore */ }
    };

    const onWheel = (e: WheelEvent) => {
      const horiz = e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!horiz) return;
      const d = e.shiftKey && Math.abs(e.deltaX) < Math.abs(e.deltaY) ? e.deltaY : e.deltaX || e.deltaY;
      const max = el.scrollWidth - el.clientWidth;
      // 양 끝에 도달하면 양보 — 페이지 세로 스크롤이 이어진다.
      if ((d < 0 && el.scrollLeft <= 0) || (d > 0 && el.scrollLeft >= max)) return;
      e.preventDefault();
      el.scrollLeft += d;
    };

    // 드래그로 4px 이상 움직였다면 뒤따르는 click을 capture 단계에서 차단.
    const onClickCapture = (e: MouseEvent) => {
      if (moved > 4) { e.stopPropagation(); e.preventDefault(); }
    };

    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('click', onClickCapture, true);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  return ref;
}
