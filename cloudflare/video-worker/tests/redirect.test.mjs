import assert from 'node:assert/strict';
import { createHash, createHmac } from 'node:crypto';
import test from 'node:test';
import worker from '../src/index.mjs';
import { videoRedirect } from '../src/redirect.mjs';

const KEY = 'video/graduation/hd-0123456789ab.mp4';
const env = {
  R2_ACCOUNT_ID: '0123456789abcdef0123456789abcdef',
  R2_BUCKET: 'amen17-graduation-videos',
  R2_ACCESS_KEY_ID: 'example-access-id',
  R2_SECRET_ACCESS_KEY: 'example-secret-not-a-real-key',
};
const hmac = (key, value) => createHmac('sha256', key).update(value).digest();
const hash = value => createHash('sha256').update(value).digest('hex');
const encode = value => encodeURIComponent(value).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());

// SDK와 별개로 SigV4를 재구성해 GET 권한·대상·만료 시간이 서명에 묶이는지 확인한다.
function signature(url, method = 'GET') {
  const date = url.searchParams.get('X-Amz-Date');
  const scope = `${date.slice(0, 8)}/auto/s3/aws4_request`;
  const params = [...url.searchParams].filter(([key]) => key !== 'X-Amz-Signature')
    .sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${encode(key)}=${encode(value)}`).join('&');
  const canonical = [method, url.pathname, params, `host:${url.host}\n`, 'host', 'UNSIGNED-PAYLOAD'].join('\n');
  let signing = hmac('AWS4' + env.R2_SECRET_ACCESS_KEY, date.slice(0, 8));
  for (const part of ['auto', 's3', 'aws4_request']) signing = hmac(signing, part);
  return hmac(signing, ['AWS4-HMAC-SHA256', date, scope, hash(canonical)].join('\n')).toString('hex');
}

test('redirect grants GET access to one R2 object, without a storage read or secret disclosure', async () => {
  const response = await worker.fetch(new Request(`https://videos.example/${KEY}?host=attacker.test`, { headers: { Range: 'bytes=100-' } }), env);
  assert.equal(response.status, 307);
  const url = new URL(response.headers.get('Location'));
  assert.equal(url.host, env.R2_ACCOUNT_ID + '.r2.cloudflarestorage.com');
  assert.equal(url.pathname, '/' + env.R2_BUCKET + '/' + KEY);
  assert.equal(url.searchParams.has('host'), false);
  assert.equal(url.searchParams.get('X-Amz-SignedHeaders'), 'host');
  assert.equal(url.searchParams.get('X-Amz-Signature'), signature(url));
  assert.notEqual(url.searchParams.get('X-Amz-Signature'), signature(url, 'PUT'));
  assert.equal(JSON.stringify([...response.headers]).includes(env.R2_SECRET_ACCESS_KEY), false);
  assert.equal(await response.text(), '');
  assert.equal(response.headers.get('Cache-Control'), 'private, max-age=300');
});

test('same-hour seeks reuse the URL; later visits renew it without expiring the fixed public address', async () => {
  const at = async time => new URL((await videoRedirect(KEY, env, new Headers(), Date.parse(time))).headers.get('Location'));
  const first = await at('2026-09-27T10:01:00Z');
  assert.equal(first.href, (await at('2026-09-27T10:59:59Z')).href);
  assert.equal(first.searchParams.get('X-Amz-Date'), '20260927T100000Z');
  assert.equal(first.searchParams.get('X-Amz-Expires'), '86400');
  const later = await at('2026-09-28T10:01:00Z');
  assert.notEqual(first.href, later.href);
  assert.equal(later.searchParams.get('X-Amz-Signature'), signature(later));
  later.searchParams.set('X-Amz-Expires', '604800');
  assert.notEqual(later.searchParams.get('X-Amz-Signature'), signature(later));
});

test('direct mode still rejects writes and unrelated file paths before signing', async () => {
  for (const method of ['PUT', 'POST', 'DELETE']) {
    assert.equal((await worker.fetch(new Request(`https://videos.example/${KEY}`, { method }), env)).status, 405);
  }
  for (const path of ['.env', 'video/graduation/full.mp4', 'video/testimony/11/hd-0123456789ab.mp4']) {
    assert.equal((await worker.fetch(new Request(`https://videos.example/${path}`), env)).status, 404);
  }
});

test('missing signing secrets fail without leaking configuration or falling back to slow streaming', async () => {
  const response = await worker.fetch(new Request(`https://videos.example/${KEY}`), { ...env, R2_SECRET_ACCESS_KEY: '' });
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(await response.text(), '');
});

test('HEAD and preflight keep the public endpoint contract without signing a GET for HEAD', async () => {
  const storage = { async head() { return { size: 100, etag: 'test', httpEtag: '"test"', uploaded: new Date() }; } };
  const head = await worker.fetch(new Request(`https://videos.example/${KEY}`, { method: 'HEAD' }), { ...env, VIDEOS: storage });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('Content-Length'), '100');
  assert.equal(head.headers.get('Location'), null);
  assert.equal((await worker.fetch(new Request(`https://videos.example/${KEY}`, { method: 'OPTIONS' }), env)).status, 204);
});
