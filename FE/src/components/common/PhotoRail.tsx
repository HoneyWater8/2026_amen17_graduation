import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { EV, FF, LAYOUT } from '../../theme/tokens';
import { useShuffled } from '../../hooks/useShuffled';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useInView } from '../../hooks/useInView';
import { usePageVisible } from '../../hooks/usePageVisible';
import { Lightbox } from './Lightbox';
import { track } from '../../utils/analytics';
import type { JourneyPhoto } from '../../data/types';

// 카드 크기 — wrap 거리 계산에 쓰이므로 아래 인라인 스타일과 반드시 일치해야 한다.
const CARD_W = 128;
const CARD_GAP = 8;
const CARD_STRIDE = CARD_W + CARD_GAP;

/**
 * 카드 하나가 지나가는 데 걸리는 시간(초). 카드가 많을수록 한 바퀴가 길어진다.
 * 사진을 훑어볼 여유를 주려고 느리게 잡았다 — 23장이면 한 바퀴 약 4분.
 */
const SECONDS_PER_CARD = 10;
/** 이 거리 이상 끌면 탭이 아니라 드래그로 본다 */
const DRAG_THRESHOLD = 6;

type DragState = {
  startX: number; startOffset: number;
  lastX: number; lastT: number;
  vel: number; moved: number;
  pointerDown: boolean; pointerId?: number;
};

type PhotoRailProps = {
  photos: JourneyPhoto[];
  active: boolean;
  lightboxOpen: boolean;
  onLightboxChange: (open: boolean) => void;
};

/**
 * 시기별 사진 가로 캐러셀.
 *
 * 마운트 시 순서를 한 번 셔플하고, 화면을 채울 만큼 이어 붙여 rAF로 흘려보낸다.
 * 사진이 한 장이면 복제와 자동 이동 없이 표시한다.
 * 손으로 끌면 멈추고, 놓으면 관성이 붙었다가 다시 자동 흐름으로 돌아온다.
 * 카드를 탭하면 라이트박스로 원본을 크게 본다.
 */
export function PhotoRail({ photos, active, lightboxOpen, onLightboxChange }: PhotoRailProps) {
  const shuffled = useShuffled(photos);
  const many = shuffled.length > 1;
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef(0);
  const cycleRef = useRef(0);
  const inertiaRef = useRef(0);
  const draggingRef = useRef(false);
  const dragRef = useRef<DragState>({
    startX: 0, startOffset: 0, lastX: 0, lastT: 0,
    vel: 0, moved: 0, pointerDown: false,
  });

  const [dragging, setDragging] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(viewportRef, active);
  const loadPhotos = useInView(viewportRef, active, '400px 0px', true);
  const pageVisible = usePageVisible();

  // 화면 밖·숨긴 탭·확대 보기에서는 모든 레일의 프레임 예약을 중지한다.
  const paused = !many || !inView || !pageVisible || lightboxOpen || reduced || dragging;

  const wrap = (x: number) => {
    const c = cycleRef.current;
    if (c <= 0) return x;
    return (((x % c) + c) % c) - c;
  };

  useEffect(() => {
    // 한 사이클 = 카드 수 × stride. scrollWidth/2로 재면 좌우 padding이 끼어들어
    // 매 바퀴 어긋나며 끊긴다 (참고 레포에서 실제로 겪은 버그).
    cycleRef.current = shuffled.length > 1 ? shuffled.length * CARD_STRIDE : 0;
    offsetRef.current = cycleRef.current ? wrap(offsetRef.current) : 0;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  }, [shuffled.length]);

  useEffect(() => {
    if (paused) return;
    // 정지한 시간까지 이동 거리로 합산하지 않아 재진입 때 사진이 튀지 않는다.
    lastTimeRef.current = 0;
    let raf = 0;
    const tick = (t: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      const dt = Math.min(t - lastTimeRef.current, 64);
      lastTimeRef.current = t;

      if (!paused && !draggingRef.current && cycleRef.current > 0) {
        // 놓은 뒤 남은 속도를 지수적으로 감쇠시켜 자동 흐름에 자연스럽게 합류시킨다.
        inertiaRef.current *= Math.exp(-dt / 250);
        const base = -cycleRef.current / (shuffled.length * SECONDS_PER_CARD * 1000);
        offsetRef.current = wrap(offsetRef.current + (base + inertiaRef.current) * dt);
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); inertiaRef.current = 0; };
  }, [paused, shuffled.length]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!many || e.button !== 0) return;
    dragRef.current = {
      startX: e.clientX, startOffset: offsetRef.current,
      lastX: e.clientX, lastT: performance.now(),
      vel: 0, moved: 0, pointerDown: true, pointerId: e.pointerId,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const st = dragRef.current;
    if (!st.pointerDown) return;
    const dx = e.clientX - st.startX;
    st.moved = Math.max(st.moved, Math.abs(dx));

    if (!draggingRef.current) {
      if (st.moved < DRAG_THRESHOLD) return;
      draggingRef.current = true;
      setDragging(true);
      inertiaRef.current = 0;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
    }

    const now = performance.now();
    const dt = Math.max(1, now - st.lastT);
    st.vel = (e.clientX - st.lastX) / dt;
    st.lastX = e.clientX;
    st.lastT = now;

    offsetRef.current = wrap(st.startOffset + dx);
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const st = dragRef.current;
    if (!st.pointerDown) return;
    st.pointerDown = false;
    if (draggingRef.current) {
      draggingRef.current = false;
      setDragging(false);
      inertiaRef.current = st.vel;
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    }
  };

  // 끌고 난 직후의 pointerup은 탭으로 치지 않는다.
  const handleCardClick = (i: number) => {
    if (dragRef.current.moved > DRAG_THRESHOLD) return;
    if (shuffled[i]?.full) {
      track('photo_open');
      onLightboxChange(true);
      setOpenIndex(i);
    }
  };

  // 두세 장만 있을 때도 한 사이클 뒤에 앱 최대 폭만큼의 사진을 이어 빈틈을 막는다.
  const copies = many ? Math.ceil(LAYOUT.maxWidth / (shuffled.length * CARD_STRIDE)) + 1 : 1;
  const cards = Array.from({ length: copies }, () => shuffled).flat();

  return (
    <>
      <div
        ref={viewportRef}
        data-role="photo-rail"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          marginTop: 9,
          // 섹션 좌측 패딩(22px)만큼 오른쪽으로 흘려보내 화면 끝까지 이어지게 한다.
          marginRight: -22,
          overflow: 'hidden',
          // 양 끝을 흐려 잘린 카드가 아니라 이어지는 흐름으로 보이게 한다.
          maskImage: many ? 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)' : undefined,
          WebkitMaskImage: many ? 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)' : undefined,
          // 세로 스크롤은 페이지에 양보하고 가로만 이 트랙이 가져간다.
          touchAction: 'pan-y',
          cursor: many ? (dragging ? 'grabbing' : 'grab') : 'default',
          userSelect: 'none', WebkitUserSelect: 'none',
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex', gap: CARD_GAP,
            width: 'max-content', willChange: !paused ? 'transform' : undefined,
          }}
        >
          {cards.map((p, i) => {
            const realIndex = i % shuffled.length;
            return (
              <div
                key={i}
                onClick={() => handleCardClick(realIndex)}
                data-role="photo-slot"
                style={{
                  flex: '0 0 auto', width: CARD_W,
                  background: EV.paperDeep, border: `1px solid ${EV.line}`,
                  padding: 5,
                  cursor: p.full ? 'pointer' : 'default',
                }}
              >
                <div style={{
                  position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden',
                  border: p.thumb ? 'none' : `1px dashed ${EV.gold}66`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FF.latin, fontSize: 15, letterSpacing: 1, color: EV.seal,
                }}>
                  {p.thumb
                    ? <img
                        src={loadPhotos ? p.thumb : undefined}
                        alt={p.caption}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    : p.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Lightbox
        photos={shuffled}
        index={openIndex}
        onClose={() => { setOpenIndex(null); onLightboxChange(false); }}
        onMove={(next) => setOpenIndex((next + shuffled.length) % shuffled.length)}
      />
    </>
  );
}
