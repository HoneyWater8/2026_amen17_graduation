/* ─────────────────────────────────────────────────────────
   R2 영상 읽기 전용 공개 주소
   고정 재생 주소에서 R2 직접 읽기 주소를 발급한다.
   ───────────────────────────────────────────────────────── */

import { videoRedirect } from './redirect.mjs';

const VIDEO_KEY = /^video\/(?:testimony\/(?:0[1-9]|10)|graduation)\/(?:preview|hd)-[a-f0-9]{12}\.mp4$/;
const SITE_ORIGIN = 'https://2026amen17graduation.vercel.app';
const CACHE_CONTROL = 'public, max-age=31536000, immutable';
const metadataCaches = new WeakMap();

async function readMetadata(bucket, key) {
  let cache = metadataCaches.get(bucket);
  if (!cache) {
    cache = new Map();
    metadataCaches.set(bucket, cache);
  }
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.metadata;
  const object = await bucket.head(key);
  if (!object) {
    cache.delete(key);
    return null;
  }
  // 영상 본문은 저장하지 않는다. 해시 주소의 메타데이터만 잠시 재사용해 탐색 요청을 줄인다.
  const metadata = { size: object.size, etag: object.etag, httpEtag: object.httpEtag, uploaded: object.uploaded };
  if (cache.size >= 64) cache.delete(cache.keys().next().value);
  cache.set(key, { metadata, expires: Date.now() + 300_000 });
  return metadata;
}

function baseHeaders() {
  return new Headers({
    'Access-Control-Allow-Origin': SITE_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Range, If-Range, If-None-Match, If-Modified-Since',
    'Access-Control-Expose-Headers': 'Accept-Ranges, Content-Length, Content-Range, ETag, Last-Modified',
    'X-Content-Type-Options': 'nosniff',
  });
}

function emptyResponse(status, headers = baseHeaders()) {
  headers.set('Cache-Control', 'no-store');
  return new Response(null, { status, headers });
}

function videoHeaders(object) {
  const headers = baseHeaders();
  headers.set('Content-Type', 'video/mp4');
  headers.set('Content-Disposition', 'inline');
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Content-Length', String(object.size));
  headers.set('ETag', object.httpEtag);
  headers.set('Last-Modified', object.uploaded.toUTCString());
  // 내용 해시가 포함된 주소만 허용하므로 1년 캐시 중 영상이 바뀌지 않는다.
  headers.set('Cache-Control', CACHE_CONTROL);
  return headers;
}

function notModified(request, object) {
  const etags = request.headers.get('If-None-Match');
  if (etags !== null) {
    return etags.split(',').some((value) => {
      const tag = value.trim();
      return tag === '*' || tag.replace(/^W\//, '') === object.httpEtag;
    });
  }
  const since = Date.parse(request.headers.get('If-Modified-Since') || '');
  return Number.isFinite(since) && Math.floor(object.uploaded.getTime() / 1000) <= Math.floor(since / 1000);
}

function ifRangeMatches(value, object) {
  if (value.startsWith('"') || value.startsWith('W/')) return value === object.httpEtag;
  const since = Date.parse(value);
  return Number.isFinite(since) && Math.floor(object.uploaded.getTime() / 1000) <= Math.floor(since / 1000);
}

function parseRange(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(value.trim());
  if (!match || (!match[1] && !match[2]) || size === 0) return null;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return null;
    const length = Math.min(suffix, size);
    return { offset: size - length, length };
  }
  const offset = Number(match[1]);
  const end = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(end) || offset >= size || end < offset) return null;
  return { offset, length: Math.min(end, size - 1) - offset + 1 };
}

export default {
  async fetch(request, env) {
    const headers = baseHeaders();
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      headers.set('Allow', 'GET, HEAD, OPTIONS');
      return emptyResponse(405, headers);
    }

    const key = new URL(request.url).pathname.slice(1);
    if (!VIDEO_KEY.test(key)) return emptyResponse(404);
    if (request.method === 'OPTIONS') {
      headers.set('Access-Control-Max-Age', '86400');
      return new Response(null, { status: 204, headers });
    }

    try {
      // 본문을 Worker가 중계하면 일부 네트워크에서 느린 해외 경로를 지난다.
      // 고정 주소에서 GET 전용 서명 URL만 발급하고 R2가 브라우저에 직접 전송한다.
      if (request.method === 'GET' && env.R2_ACCOUNT_ID) {
        return await videoRedirect(key, env, headers);
      }
      // HEAD로 크기를 확인한 뒤 필요한 구간만 읽어 탐색 시 전체 다운로드를 막는다.
      const metadata = await readMetadata(env.VIDEOS, key);
      if (!metadata) return emptyResponse(404);
      const responseHeaders = videoHeaders(metadata);
      if (notModified(request, metadata)) {
        responseHeaders.delete('Content-Length');
        return new Response(null, { status: 304, headers: responseHeaders });
      }
      if (request.method === 'HEAD') return new Response(null, { headers: responseHeaders });

      let range;
      const rangeHeader = request.headers.get('Range');
      const ifRange = request.headers.get('If-Range');
      if (rangeHeader && (!ifRange || ifRangeMatches(ifRange, metadata))) {
        range = parseRange(rangeHeader, metadata.size);
        if (!range) {
          responseHeaders.set('Content-Range', `bytes */${metadata.size}`);
          responseHeaders.delete('Content-Length');
          return emptyResponse(416, responseHeaders);
        }
      }

      const object = await env.VIDEOS.get(key, {
        onlyIf: { etagMatches: metadata.etag },
        ...(range ? { range } : {}),
      });
      if (!object) {
        metadataCaches.get(env.VIDEOS)?.delete(key);
        return emptyResponse(404);
      }
      // 조회 도중 교체된 객체에 이전 크기를 붙이지 않는다. 교체 영상은 새 해시 주소로 올린다.
      if (!('body' in object)) {
        metadataCaches.get(env.VIDEOS)?.delete(key);
        return emptyResponse(412);
      }
      if (range) {
        responseHeaders.set('Content-Length', String(range.length));
        responseHeaders.set('Content-Range', `bytes ${range.offset}-${range.offset + range.length - 1}/${metadata.size}`);
      }
      return new Response(object.body, { status: range ? 206 : 200, headers: responseHeaders });
    } catch {
      // 저장소 장애를 장기 캐시하거나 내부 오류를 공개하지 않는다.
      return emptyResponse(503);
    }
  },
};
