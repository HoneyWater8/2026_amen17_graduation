"""기존 R2 키를 Worker의 서버 전용 서명 Secret으로 설정한다."""

import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
ACCOUNT = "f59ada602e45f4585fa7fca0becf52e7"
BUCKET = "amen17-graduation-videos"


def main():
    values = {}
    for line in (ROOT / "assets/video-work/.env.r2.local").read_text(encoding="utf-8-sig").splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            key, value = line.split("=", 1)
            values[key.strip()] = value.strip().strip('"').strip("'")
    if values.get("R2_ACCOUNT_ID") != ACCOUNT or values.get("R2_BUCKET") != BUCKET:
        raise RuntimeError("R2 계정과 버킷이 프로젝트 설정과 일치해야 합니다.")
    keys = ["R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"]
    if not all(values.get(key) for key in keys):
        raise RuntimeError("R2 서명 키가 없습니다.")
    npx = shutil.which("npx.cmd") or shutil.which("npx")
    if not npx:
        raise RuntimeError("Node.js/npm is required")

    # 인증 값은 stdin으로만 넘기고 CLI 출력과 명령 인수에는 남기지 않는다.
    result = subprocess.run([npx, "--yes", "wrangler@4.141.0", "secret", "bulk", "--config",
                             str(ROOT / "cloudflare/video-worker/wrangler.jsonc")], cwd=ROOT,
                            input=json.dumps({key: values[key] for key in keys}),
                            capture_output=True, text=True, encoding="utf-8", errors="replace")
    if result.returncode:
        raise RuntimeError(f"Worker Secret 등록 실패 (종료 코드 {result.returncode}). 인증 값은 출력하지 않았습니다.")
    print("Two server-only Worker secrets configured; no credentials were printed.")


if __name__ == "__main__":
    main()
