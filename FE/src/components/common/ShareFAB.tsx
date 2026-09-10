import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { EV, FF } from '../../theme/tokens';
import { shareToKakao, hasKakaoKey } from '../../utils/kakaoShare';
import { canonicalUrl, copyLink, nativeShare, canNativeShare } from '../../utils/share';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { track } from '../../utils/analytics';
import { G } from '../../data/graduation';

const SHEET_TRANSITION_MS = 320;
const CLOSE_DRAG_THRESHOLD = 80;
const TOAST_MS = 1800;

const itemStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 12,
  width: '100%', padding: '14px 12px',
  background: 'transparent', border: 'none', borderRadius: 0,
  cursor: 'pointer',
  fontFamily: FF.serif, fontSize: 14, fontWeight: 700,
  color: EV.ink, textAlign: 'left', outline: 'none',
};

const iconSlotStyle: CSSProperties = {
  width: 26, height: 26, flexShrink: 0,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
};

type ShareFABProps = {
  /** 봉투가 열린 뒤(stage === 'out')에만 노출 */
  active: boolean;
};

/**
 * 공유 FAB + 바텀시트.
 *
 * 카카오톡 공유는 JS키가 있으면 Kakao SDK(sendScrap), 없으면 네이티브 공유 시트로
 * 폴백한다. 둘 다 불가하면 링크 복사만 남는다 — 키가 없어도 기능이 죽지 않는다.
 */
export const ShareFAB = memo(function ShareFAB({ active }: ShareFABProps) {
  // mount/visible 분리 — mount 후 다음 프레임에 visible=true로 슬라이드업,
  // 닫을 땐 visible=false 후 transition이 끝나면 unmount.
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [iconFailed, setIconFailed] = useState(false);
  const dragStartYRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
  }, []);

  const openSheet = useCallback(() => {
    track('share_open');
    setDragY(0);
    setMounted(true);
    // 두 번의 rAF — 첫 렌더에 translateY(100%)가 적용된 뒤 다음 프레임에 0으로 transition.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  const closeSheet = useCallback(() => {
    setVisible(false);
    window.setTimeout(() => {
      setMounted(false);
      setDragY(0);
    }, reduced ? 0 : SHEET_TRANSITION_MS);
  }, [reduced]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSheet(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted, closeSheet]);

  const onHandleDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    dragStartYRef.current = e.clientY;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onHandleMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartYRef.current === null) return;
    setDragY(Math.max(0, e.clientY - dragStartYRef.current));
  }, []);

  const onHandleUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartYRef.current === null) return;
    const finalY = e.clientY - dragStartYRef.current;
    dragStartYRef.current = null;
    setDragging(false);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    if (finalY > CLOSE_DRAG_THRESHOLD) closeSheet();
    else setDragY(0);
  }, [closeSheet]);

  const handleCopy = useCallback(async () => {
    const ok = await copyLink(canonicalUrl());
    track('share_copy', { ok });
    closeSheet();
    showToast(ok ? '링크가 복사되었어요' : '복사에 실패했어요');
  }, [closeSheet, showToast]);

  const handleKakao = useCallback(async () => {
    const url = canonicalUrl();
    // 카카오 SDK / 네이티브 시트 중 어느 경로로 나갔는지 구분해 집계한다.
    if (await shareToKakao(url)) { track('share_kakao'); closeSheet(); return; }
    // JS키가 없거나 SDK가 실패하면 네이티브 공유 시트로 넘긴다.
    if (await nativeShare(url, `${G.meta.org} · ${G.meta.cohort} 졸업`)) { track('share_native'); closeSheet(); return; }
    closeSheet();
    showToast('공유에 실패했어요. 링크를 복사해 주세요');
  }, [closeSheet, showToast]);

  // 카카오 JS키도 없고 네이티브 공유도 못 쓰는 환경(데스크톱 Firefox 등)에서는
  // 눌러도 실패만 하는 막다른 버튼이 되므로 아예 감추고 링크 복사만 남긴다.
  const canShare = hasKakaoKey() || canNativeShare();
  const shareLabel = hasKakaoKey() ? '카카오톡으로 공유' : '공유하기';

  return (
    <>
      {/* FAB — 왁스 씰의 원형을 따르되 종이·금박 톤 */}
      <button
        onClick={openSheet}
        aria-label="공유하기"
        style={{
          position: 'absolute', bottom: 24, right: 20,
          width: 52, height: 52, borderRadius: '50%',
          background: EV.paper,
          border: `1.5px solid ${EV.gold}`,
          color: EV.seal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0, zIndex: 40,
          boxShadow: '0 6px 18px rgba(30,27,22,.18)',
          // 봉투가 걷힌 뒤에 조용히 나타난다 (봉투 오버레이보다 z-index가 높아 게이트 필수)
          opacity: active ? 1 : 0,
          pointerEvents: active ? 'auto' : 'none',
          transition: reduced ? 'none' : 'opacity .5s ease .6s',
        }}
      >
        {/* 업로드(공유) 아이콘 — fill을 currentColor로 두어 버튼의 EV.seal 색을 상속받는다 */}
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M28 18.9998V25.9998C28 26.5302 27.7893 27.0389 27.4142 27.414C27.0391 27.7891 26.5304 27.9998 26 27.9998H6C5.46957 27.9998 4.96086 27.7891 4.58579 27.414C4.21071 27.0389 4 26.5302 4 25.9998V18.9998C4 18.7346 4.10536 18.4802 4.29289 18.2927C4.48043 18.1052 4.73478 17.9998 5 17.9998C5.26522 17.9998 5.51957 18.1052 5.70711 18.2927C5.89464 18.4802 6 18.7346 6 18.9998V25.9998H26V18.9998C26 18.7346 26.1054 18.4802 26.2929 18.2927C26.4804 18.1052 26.7348 17.9998 27 17.9998C27.2652 17.9998 27.5196 18.1052 27.7071 18.2927C27.8946 18.4802 28 18.7346 28 18.9998ZM11.7075 10.7073L15 7.41356V18.9998C15 19.265 15.1054 19.5194 15.2929 19.7069C15.4804 19.8945 15.7348 19.9998 16 19.9998C16.2652 19.9998 16.5196 19.8945 16.7071 19.7069C16.8946 19.5194 17 19.265 17 18.9998V7.41356L20.2925 10.7073C20.4801 10.895 20.7346 11.0004 21 11.0004C21.2654 11.0004 21.5199 10.895 21.7075 10.7073C21.8951 10.5197 22.0006 10.2652 22.0006 9.99981C22.0006 9.73445 21.8951 9.47995 21.7075 9.29231L16.7075 4.29231C16.6146 4.19933 16.5043 4.12557 16.3829 4.07525C16.2615 4.02493 16.1314 3.99902 16 3.99902C15.8686 3.99902 15.7385 4.02493 15.6171 4.07525C15.4957 4.12557 15.3854 4.19933 15.2925 4.29231L10.2925 9.29231C10.1049 9.47995 9.99944 9.73445 9.99944 9.99981C9.99944 10.2652 10.1049 10.5197 10.2925 10.7073C10.4801 10.895 10.7346 11.0004 11 11.0004C11.2654 11.0004 11.5199 10.895 11.7075 10.7073Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* 배경 — 탭하면 닫힘 */}
      {mounted && (
        <div
          onClick={closeSheet}
          style={{
            position: 'absolute', inset: 0, zIndex: 50,
            background: 'rgba(30,27,22,0.45)',
            opacity: visible ? 1 : 0,
            transition: reduced ? 'none' : 'opacity .28s ease',
          }}
        />
      )}

      {/* 바텀시트 */}
      {mounted && (
        <div
          role="dialog"
          aria-label="공유하기"
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51,
            background: EV.paper,
            borderTop: `1.5px solid ${EV.gold}`,
            // 본문은 졸업장 톤이라 radius 0이지만, 바텀시트는 물리적으로 올라오는
            // UI라 상단 모서리만 둥글게 둔다 (참고 레포와 같은 18px).
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: '14px 20px 28px',
            boxShadow: '0 -8px 30px rgba(30,27,22,0.18)',
            transform: visible ? `translateY(${dragY}px)` : 'translateY(100%)',
            transition: dragging || reduced
              ? 'none'
              : `transform ${SHEET_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            willChange: 'transform',
          }}
        >
          {/* 핸들 — 아래로 드래그하면 닫힘 */}
          <div
            onPointerDown={onHandleDown}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleUp}
            onPointerCancel={onHandleUp}
            style={{
              padding: '4px 0 14px',
              cursor: dragging ? 'grabbing' : 'grab',
              touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none',
            }}
          >
            <div style={{ width: 36, height: 3, background: `${EV.gold}88`, margin: '0 auto' }} />
          </div>

          {/* 라틴 전용이라 Cinzel Decorative를 써도 서체가 갈라지지 않는다 */}
          <div style={{
            fontFamily: FF.latin, fontSize: 11, letterSpacing: 3,
            color: EV.seal, marginBottom: 6, padding: '0 12px',
          }}>SHARE</div>

          <button onClick={handleCopy} style={itemStyle}>
            <span style={iconSlotStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke={EV.seal} strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
                <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
              </svg>
            </span>
            <span>링크 복사하기</span>
          </button>

          {canShare && (
            <button onClick={handleKakao} style={itemStyle}>
              <span style={iconSlotStyle}>
                {iconFailed ? (
                  // 아이콘 파일이 아직 없을 때의 폴백 (말풍선)
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={EV.seal} aria-hidden>
                    <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.2 4.7 6.6l-1 3.6c-.1.3.2.6.5.4l4.3-2.8c.5.1 1 .1 1.5.1 5.5 0 10-3.5 10-7.9S17.5 3 12 3z" />
                  </svg>
                ) : (
                  <img src="/icons/kakaotalk.png" alt="" width={20} height={20}
                    onError={() => setIconFailed(true)} />
                )}
              </span>
              <span>{shareLabel}</span>
            </button>
          )}
        </div>
      )}

      {/* 토스트 */}
      {toast && (
        <div
          role="status"
          style={{
            position: 'absolute', bottom: 96, left: '50%',
            transform: 'translateX(-50%)', zIndex: 60,
            padding: '11px 20px', borderRadius: 999,
            background: EV.ink, color: EV.paper,
            fontFamily: FF.serif, fontSize: 13, whiteSpace: 'nowrap',
            boxShadow: '0 8px 24px rgba(30,27,22,0.28)',
            animation: reduced ? undefined : 'ev-toast-in .25s ease backwards',
            pointerEvents: 'none',
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
});
