/* ─────────────────────────────────────────────────────────
   R2 직접 재생 주소 · Secret은 서버에만 보관하고 GET만 서명한다.
   ───────────────────────────────────────────────────────── */

import { AwsClient } from 'aws4fetch';

const signingKeys = new Map();
const HOUR = 3_600_000;

export async function videoRedirect(key, env, headers, now = Date.now()) {
  if (!/^[a-f0-9]{32}$/.test(env.R2_ACCOUNT_ID) || env.R2_BUCKET !== 'amen17-graduation-videos' ||
      !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) throw new Error('R2 signing configuration missing');
  const url = new URL(`https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET}/${key}`);
  // 같은 시간대의 탐색·왕복은 같은 URL을 써 브라우저 캐시를 재사용한다.
  // 최소 23시간 유효하며 고정 Worker 주소는 다음 방문 때 새 URL을 발급한다.
  const datetime = new Date(Math.floor(now / HOUR) * HOUR).toISOString().replace(/[:-]|\.\d{3}/g, '');
  url.searchParams.set('X-Amz-Expires', '86400');
  const client = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: 's3', region: 'auto', cache: signingKeys,
  });
  const signed = await client.sign(url, { method: 'GET', aws: { signQuery: true, datetime } });
  headers.set('Location', signed.url);
  // 만료된 서명으로 영구 이동하지 않도록 짧은 임시 리다이렉트만 캐시한다.
  headers.set('Cache-Control', 'private, max-age=300');
  headers.set('Referrer-Policy', 'no-referrer');
  return new Response(null, { status: 307, headers });
}
