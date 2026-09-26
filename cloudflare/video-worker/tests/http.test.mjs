import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../src/index.mjs';

const KEY = 'video/testimony/01/preview-0123456789ab.mp4';
const URL = `https://videos.example/${KEY}`;
const bytes = new TextEncoder().encode('0123456789');
const metadata = {
  size: bytes.length,
  etag: 'version-one',
  httpEtag: '"version-one"',
  uploaded: new Date('2026-09-27T00:00:00Z'),
};

function bucket(overrides = {}) {
  const reads = [];
  return {
    reads,
    async head(key) {
      assert.equal(key, KEY);
      return metadata;
    },
    async get(key, options) {
      assert.equal(key, KEY);
      reads.push(options);
      const data = options.range
        ? bytes.slice(options.range.offset, options.range.offset + options.range.length)
        : bytes;
      return { ...metadata, body: new Blob([data]).stream() };
    },
    ...overrides,
  };
}

function request(headers = {}, method = 'GET', storage = bucket(), url = URL) {
  return worker.fetch(new Request(url, { method, headers }), { VIDEOS: storage });
}

test('ordinary playback returns the MP4 stream, public cache metadata and CORS', async () => {
  const response = await request();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Content-Type'), 'video/mp4');
  assert.equal(response.headers.get('Content-Length'), '10');
  assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://2026amen17graduation.vercel.app');
  assert.match(response.headers.get('Cache-Control'), /immutable/);
  assert.equal(await response.text(), '0123456789');
});

for (const [range, body, contentRange] of [
  ['bytes=0-0', '0', 'bytes 0-0/10'],
  ['bytes=3-5', '345', 'bytes 3-5/10'],
  ['bytes=7-', '789', 'bytes 7-9/10'],
  ['bytes=-3', '789', 'bytes 7-9/10'],
  ['bytes=8-99', '89', 'bytes 8-9/10'],
  ['bytes=-99', '0123456789', 'bytes 0-9/10'],
]) {
  test(`seeking ${range} reads only the requested bytes`, async () => {
    const storage = bucket();
    const response = await request({ Range: range }, 'GET', storage);
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('Content-Range'), contentRange);
    assert.equal(Number(response.headers.get('Content-Length')), body.length);
    assert.equal(storage.reads[0].range.length, body.length);
    assert.equal(await response.text(), body);
  });
}

for (const range of ['bytes=10-', 'bytes=5-3', 'bytes=-0', 'bytes=-', 'bytes=0-1,4-5', 'bytes=9007199254740992-']) {
  test(`invalid or unsupported range ${range} does not download the entire file`, async () => {
    const storage = bucket();
    const response = await request({ Range: range }, 'GET', storage);
    assert.equal(response.status, 416);
    assert.equal(response.headers.get('Content-Range'), 'bytes */10');
    assert.equal(storage.reads.length, 0);
    assert.equal(await response.text(), '');
  });
}

test('HEAD ignores a range and never reads the body', async () => {
  const storage = bucket();
  const response = await request({ Range: 'bytes=0-0' }, 'HEAD', storage);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Content-Length'), '10');
  assert.equal(await response.text(), '');
  assert.equal(storage.reads.length, 0);
});

test('ETag and modification date validation return 304 without reading the file', async () => {
  for (const headers of [
    { 'If-None-Match': 'W/"version-one"' },
    { 'If-None-Match': '*' },
    { 'If-Modified-Since': metadata.uploaded.toUTCString() },
  ]) {
    const storage = bucket();
    const response = await request(headers, 'GET', storage);
    assert.equal(response.status, 304);
    assert.equal(storage.reads.length, 0);
    assert.equal(response.headers.get('Content-Length'), null);
  }
  const response = await request({
    'If-None-Match': '"different"',
    'If-Modified-Since': metadata.uploaded.toUTCString(),
  });
  assert.equal(response.status, 200, 'If-None-Match takes precedence');
});

test('If-Range accepts the current strong ETag and ignores stale or weak validators', async () => {
  for (const [tag, status] of [['"version-one"', 206], ['"old"', 200], ['W/"version-one"', 200]]) {
    const response = await request({ Range: 'bytes=3-5', 'If-Range': tag });
    assert.equal(response.status, status);
    assert.equal(await response.text(), status === 206 ? '345' : '0123456789');
  }
});

test('preflight succeeds without any storage read', async () => {
  const response = await request({}, 'OPTIONS', {});
  assert.equal(response.status, 204);
  assert.match(response.headers.get('Access-Control-Allow-Headers'), /Range/);
});

test('public endpoint cannot upload, delete, list, or read unrelated objects', async () => {
  for (const method of ['PUT', 'POST', 'DELETE', 'PATCH']) {
    assert.equal((await request({}, method, {})).status, 405);
  }
  for (const path of ['', '.env', 'video/graduation/full.mp4', 'video/testimony/11/hd-0123456789ab.mp4']) {
    assert.equal((await request({}, 'GET', {}, `https://videos.example/${path}`)).status, 404);
  }
});

test('storage errors, missing files and changed objects cannot be cached as successful videos', async () => {
  const unavailable = await request({}, 'GET', bucket({ head() { throw new Error('private details'); } }));
  assert.equal(unavailable.status, 503);
  assert.equal(unavailable.headers.get('Cache-Control'), 'no-store');
  assert.equal(await unavailable.text(), '');
  assert.equal((await request({}, 'GET', bucket({ head: async () => null }))).status, 404);
  assert.equal((await request({}, 'GET', bucket({ get: async () => metadata }))).status, 412);
});

test('successive seeks reuse file metadata while each request reads its own byte range', async () => {
  let heads = 0;
  const storage = bucket({ head: async () => { heads++; return metadata; } });
  for (const [range, body] of [['bytes=1-2', '12'], ['bytes=8-', '89']]) {
    const response = await request({ Range: range }, 'GET', storage);
    assert.equal(response.status, 206);
    assert.equal(await response.text(), body);
  }
  assert.equal(heads, 1);
  assert.equal(storage.reads.length, 2);
});

test('a removed file invalidates cached metadata', async () => {
  let exists = true;
  let heads = 0;
  const storage = bucket({
    head: async () => { heads++; return exists ? metadata : null; },
    get: async () => null,
  });
  assert.equal((await request({}, 'HEAD', storage)).status, 200);
  exists = false;
  assert.equal((await request({}, 'GET', storage)).status, 404);
  assert.equal((await request({}, 'HEAD', storage)).status, 404);
  assert.equal(heads, 2);
});
