/* ─────────────────────────────────────────────────────────
   사용자 집계 — Vercel Web Analytics + Google Analytics 4

   역할을 나눠 쓴다.
     Vercel : 방문자 수 · 페이지뷰 · 유입 경로 · 기기.
              <Analytics /> 컴포넌트만 붙이면 되고 쿠키를 쓰지 않는다.
              단 Hobby 플랜은 커스텀 이벤트를 지원하지 않고 보존 기간이 1개월이다.
     GA4    : 봉투 열기 · 섹션 도달 · 영상 재생 · 공유 클릭 같은 행동 추적.
              Hobby의 두 한계(커스텀 이벤트 없음, 1개월 보존)를 메우는 쪽.

   VITE_GA_ID가 없으면 GA4 스크립트를 아예 로드하지 않는다 —
   측정 ID를 받기 전에도 페이지는 그대로 동작한다.
   ───────────────────────────────────────────────────────── */

type GtagParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

/** 같은 이벤트가 스크롤 왕복 등으로 중복 발사되는 것을 막는다 */
const fired = new Set<string>();

/** GA4 스크립트를 1회 로드하고 초기화. ID가 없으면 아무것도 하지 않는다. */
export function initAnalytics() {
  if (!GA_ID || typeof window === 'undefined' || window.gtag) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  const gtag: Window['gtag'] = (...args) => { window.dataLayer!.push(args); };
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
}

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
