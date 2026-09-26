"""공개 R2 Worker의 HEAD와 처음·마지막 바이트를 검증하고 공개 URL 목록을 만든다."""

import argparse
import json
from pathlib import Path
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / "assets/video-work"
SITE = "https://2026amen17graduation.vercel.app"
USER_AGENT = "amen17-video-verifier/1.0"


def read_response(request, limit=0):
    for attempt in range(3):
        try:
            with urlopen(request, timeout=30) as response:
                return response.status, response.headers, response.read(limit), urlparse(response.url).hostname
        except HTTPError as error:
            if error.code not in (502, 503, 504) or attempt == 2:
                raise
        except (TimeoutError, URLError):
            if attempt == 2:
                raise
        print(f"Retrying transient network error ({attempt + 1}/2): {request.full_url}", flush=True)
        time.sleep(1)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", required=True)
    args = parser.parse_args()
    base = args.base_url.rstrip("/")
    parsed = urlparse(base)
    if parsed.scheme != "https" or parsed.username or parsed.password or parsed.query or parsed.fragment or parsed.path:
        raise ValueError("영상 호스트의 HTTPS 주소만 지정해주세요.")
    plan = json.loads((WORK / "r2-upload-plan.json").read_text(encoding="utf-8"))
    results = []
    for index, video in enumerate(plan["videos"], 1):
        url = f"{base}/{video['key']}"
        status, headers, _, _ = read_response(Request(url, method="HEAD", headers={"Origin": SITE, "User-Agent": USER_AGENT}))
        assert status == 200, f"HEAD failed: {url}"
        assert int(headers["Content-Length"]) == video["bytes"], f"Wrong length: {url}"
        assert headers["Content-Type"] == "video/mp4", f"Wrong media type: {url}"
        assert headers["Access-Control-Allow-Origin"] == SITE, f"Wrong CORS: {url}"
        etag = headers["ETag"]
        with (ROOT / video["file"]).open("rb") as stream:
            for start in [0, video["bytes"] - 256]:
                request = Request(url, headers={"Range": f"bytes={start}-{start + 255}", "If-Range": etag, "Origin": SITE, "User-Agent": USER_AGENT})
                status, headers, body, delivery_host = read_response(request, 257)
                assert status == 206, f"Range ignored: {url}"
                assert delivery_host == f"{plan['accountId']}.r2.cloudflarestorage.com", f"Video is not delivered directly by R2: {url}"
                assert headers["Access-Control-Allow-Origin"] == SITE, f"Wrong R2 CORS: {url}"
                assert headers["Content-Range"] == f"bytes {start}-{start + 255}/{video['bytes']}", f"Wrong range: {url}"
                stream.seek(start)
                assert body == stream.read(256), f"Content mismatch: {url}"
        results.append({**video, "url": url, "head": 200, "range": 206, "deliveryHost": delivery_host, "firstAndLastBytesMatch": True})
        print(f"[{index}/22] verified: {video['key']}", flush=True)
    (WORK / "r2-deployment.json").write_text(json.dumps({**plan, "baseUrl": base, "videos": results}, indent=2) + "\n", encoding="utf-8")
    (WORK / "r2-public-urls.env").write_text("".join(f"{video['env']}={video['url']}\n" for video in results), encoding="utf-8")
    print("All 22 public video URLs verified. No credentials are included in the output files.")


if __name__ == "__main__":
    main()
