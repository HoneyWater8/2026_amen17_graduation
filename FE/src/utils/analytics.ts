/* ─────────────────────────────────────────────────────────
   사용자 집계 — 커스텀 이벤트 전송

   GA4 초기화(gtag.js 로드 + config)는 index.html의 표준 스니펫이 담당한다.
   모듈로 감싸 동적 로드했을 때 page_view가 `en` 파라미터 없이 나가
   GA가 이벤트를 인식하지 못하는 문제가 있었다 (2026-09-11).

   방문자 수·페이지뷰·유입 경로는 Vercel Web Analytics(<Analytics />)가 맡고,
   여기서는 Hobby 플랜이 지원하지 않는 행동 이벤트만 GA4로 보낸다.
   ───────────────────────────────────────────────────────── */

type GtagParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** 같은 이벤트가 스크롤 왕복 등으로 중복 발사되는 것을 막는다 */
const fired = new Set<string>();

/**
 * 커스텀 이벤트 전송.
 *
 * @param once true면 같은 키로 한 번만 보낸다 (섹션 도달처럼 왕복하는 이벤트용)
 */
export function track(name: string, params?: GtagParams, once = false) {
  if (once) {
    const key = `${name}:${JSON.stringify(params ?? {})}`;
    if (fired.has(key)) return;
    fired.add(key);
  }
  window.gtag?.('event', name, params);
}
