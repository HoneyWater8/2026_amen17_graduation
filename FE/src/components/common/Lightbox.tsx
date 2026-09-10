import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react';
import { EV, FF, LAYOUT } from '../../theme/tokens';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { JourneyPhoto } from '../../data/types';

/** 이만큼 끌면 다음/이전으로 넘긴다 */
const SWIPE_THRESHOLD = 55;
/** 손가락을 따라가는 정도. 낮을수록 저항감이 생긴다 */
const DRAG_FOLLOW = 0.5;
/** 휠 한 번에 여러 장이 넘어가지 않도록 두는 쿨다운(ms) */
const WHEEL_COOLDOWN = 320;

type LightboxProps = {
  photos: JourneyPhoto[];
  /** 열려 있는 사진의 인덱스. null이면 닫힘 */
  index: number | null;
  onClose: () => void;
  onMove: (next: number) => void;
};

/**
 * 사진 확대 보기 — 배경을 흐리고 그 위에 모달 하나를 띄운다.
 *
 * 모달은 사진 비율을 그대로 따른다 — 고정 틀에 넣으면 위아래로 검은 여백이 생긴다.
 * 이동은 좌우 스와이프 · 가로 휠 · 화살표 버튼 · 키보드,
 * 닫기는 배경 탭 · 닫기 버튼 · Esc.
 *
 * ⚠️ position은 fixed. absolute로 두면 조상인 Section(position: relative)에
 *    갇혀 화면이 아니라 섹션 전체 높이를 덮는다.
 */
export function Lightbox({ photos, index, onClose, onMove }: LightboxProps) {
  const reduced = usePrefersReducedMotion();
  const open = index !== null;

  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const wheelAtRef = useRef(0);

  const close = useCallback(() => {
    setDragX(0);
    onClose();
  }, [onClose]);

  const go = useCallback((delta: number) => {
    if (index === null) return;
    setDragX(0);
    onMove(index + delta);
  }, [index, onMove]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, go]);

  if (!open) return null;
  const photo = photos[index];
  if (!photo?.full) return null;

  const many = photos.length > 1;

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!many || e.button !== 0) return;
    startXRef.current = e.clientX;
    setDragging(true);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragX((e.clientX - startXRef.current) * DRAG_FOLLOW);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    const dx = e.clientX - startXRef.current;
    if (dx > SWIPE_THRESHOLD) go(-1);
    else if (dx < -SWIPE_THRESHOLD) go(1);
    else setDragX(0);
  };

  // 트랙패드 가로 스크롤. 연속으로 들어오므로 쿨다운을 두어 한 장씩만 넘긴다.
  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    if (!many) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
    if (!d) return;
    const now = performance.now();
    if (now - wheelAtRef.current < WHEEL_COOLDOWN) return;
    wheelAtRef.current = now;
    go(d > 0 ? 1 : -1);
  };

  const navStyle = {
    position: 'absolute' as const, top: '50%',
    width: 36, height: 36, border: 'none', borderRadius: '50%',
    background: 'rgba(251,247,238,.82)', color: EV.ink,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', padding: 0,
    boxShadow: '0 2px 8px rgba(0,0,0,.3)',
  };

  return (
    <div
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="사진 확대 보기"
      style={{
        // 화면 기준. 앱 폭(460px)에 맞춰 가운데 정렬한다.
        position: 'fixed', top: 0, bottom: 0, left: '50%',
        width: '100%', maxWidth: LAYOUT.maxWidth,
        transform: 'translateX(-50%)',
        zIndex: 70,
        // 살짝 어둡게 + 흐리게 — 본문이 비쳐 보이되 시선은 모달로 모인다.
        background: 'rgba(30,27,22,.42)',
        backdropFilter: 'blur(7px)', WebkitBackdropFilter: 'blur(7px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 18,
        animation: reduced ? undefined : 'ev-lightbox-in .22s ease backwards',
      }}
    >
      {/* 모달 — 사진 비율 그대로. 테두리와 버튼이 사진 가장자리에 붙는다 */}
      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        style={{
          // 크기를 고정하지 않고 사진에 맞춘다. 4:3 틀에 넣으면 비율이 다른 사진에
          // 위아래 검은 여백이 생긴다.
          position: 'relative',
          display: 'inline-block',
          maxWidth: '100%', maxHeight: '100%',
          border: `1px solid ${EV.gold}`,
          boxShadow: '0 20px 50px rgba(0,0,0,.45)',
          // 세로 스크롤은 페이지에 넘기고 가로 제스처만 받는다.
          touchAction: 'pan-y',
          cursor: many ? (dragging ? 'grabbing' : 'grab') : 'default',
          userSelect: 'none', WebkitUserSelect: 'none',
          transform: `translateX(${dragX}px)`,
          transition: dragging ? 'none' : 'transform .25s cubic-bezier(.22,1,.36,1)',
          animation: reduced ? undefined : 'ev-modal-in .28s cubic-bezier(.22,1,.36,1) backwards',
        }}
      >
        <img
          key={photo.full}
          src={photo.full}
          alt={photo.caption}
          draggable={false}
          style={{
            display: 'block', verticalAlign: 'bottom',
            maxWidth: '100%',
            // 화면 높이에서 backdrop 패딩(18px x 2)과 테두리를 뺀 만큼이 상한.
            maxHeight: 'calc(100dvh - 38px)',
            width: 'auto', height: 'auto',
            animation: reduced ? undefined : 'ev-lightbox-in .2s ease backwards',
          }}
        />

        <button onClick={close} aria-label="닫기" style={{
          position: 'absolute', top: 8, right: 8,
          width: 32, height: 32, border: 'none', borderRadius: '50%',
          background: 'rgba(251,247,238,.82)', color: EV.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,.3)',
        }}>
          <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden>
            <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        {many && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="이전 사진"
              style={{ ...navStyle, left: 8, transform: 'translateY(-50%)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
                <path d="M10 2 L4 8 L10 14" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button
              onClick={() => go(1)}
              aria-label="다음 사진"
              style={{ ...navStyle, right: 8, transform: 'translateY(-50%)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
                <path d="M6 2 L12 8 L6 14" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>

            <div style={{
              position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
              padding: '3px 10px', borderRadius: 999,
              background: 'rgba(30,27,22,.55)',
              fontFamily: FF.latin, fontSize: 11, letterSpacing: 1.5, lineHeight: 1.5,
              color: EV.goldLt, pointerEvents: 'none', whiteSpace: 'nowrap',
            }}>{index + 1} / {photos.length}</div>
          </>
        )}
      </div>
    </div>
  );
}
