/* ─────────────────────────────────────────────────────────
   Kakao JavaScript SDK 동적 로더 + Share 호출
   - VITE_KAKAO_JS_KEY (JS키) 사용. 카카오 개발자 콘솔 Web 플랫폼에
     배포 도메인이 등록되어 있어야 동작한다.
   - sendScrap으로 페이지의 OG 태그를 스크랩해 카드 전송.
     제목·설명·이미지는 전부 index.html의 og:* meta에서 가져오므로
     카드 내용을 바꾸려면 여기가 아니라 index.html을 고쳐야 한다.
   ───────────────────────────────────────────────────────── */

type KakaoSDK = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share?: {
    sendScrap: (params: { requestUrl: string }) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

const SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js';
const SDK_INTEGRITY = 'sha384-OL+ylM/iuPLtW5U3XcvLSGhE8JzReKDank5InqlHGWPhb4140/yrBw0bg0y7+C9J';

let sdkPromise: Promise<void> | null = null;

function loadKakaoSdk(): Promise<void> {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('SSR'));
    if (window.Kakao?.Share) return resolve();
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.integrity = SDK_INTEGRITY;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Kakao SDK'));
    document.head.appendChild(script);
  });
  return sdkPromise;
}

/** JS키가 주입되어 있는지. 없으면 SDK를 부르지 않고 곧바로 폴백으로 넘긴다. */
export function hasKakaoKey(): boolean {
  return Boolean(import.meta.env.VITE_KAKAO_JS_KEY);
}

/** 카카오톡 공유 시도. 실패하면 false를 반환하고 호출부가 폴백을 고른다. */
export async function shareToKakao(url: string): Promise<boolean> {
  if (!hasKakaoKey()) return false;
  try {
    await loadKakaoSdk();
    const Kakao = window.Kakao;
    if (!Kakao) return false;
    const key = import.meta.env.VITE_KAKAO_JS_KEY;
    if (key && !Kakao.isInitialized()) Kakao.init(key);
    if (!Kakao.Share) return false;
    Kakao.Share.sendScrap({ requestUrl: url });
    return true;
  } catch (e) {
    console.error('[Kakao Share]', e);
    return false;
  }
}
