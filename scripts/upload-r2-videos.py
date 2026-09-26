"""현재 재생본 22개의 R2 업로드 목록을 만들고 명시적으로 요청했을 때만 업로드한다."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess


ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / "assets/video-work"
ACCOUNT = "f59ada602e45f4585fa7fca0becf52e7"
BUCKET = "amen17-graduation-videos"


def make_plan():
    videos = []
    for number in range(1, 12):
        folder = f"testimony/{number:02d}" if number <= 10 else "graduation"
        prefix = f"VITE_TESTIMONY_{number}_VIDEO" if number <= 10 else "VITE_GRADUATION_VIDEO"
        for quality, suffix in [("preview", "_URL"), ("hd", "_FULL_URL")]:
            source = ROOT / f"FE/public/video/{folder}/{quality}.mp4"
            with source.open("rb") as stream:
                digest = hashlib.file_digest(stream, "sha256").hexdigest()
            videos.append({
                "file": source.relative_to(ROOT).as_posix(),
                "key": f"video/{folder}/{quality}-{digest[:12]}.mp4",
                "env": prefix + suffix,
                "bytes": source.stat().st_size,
                "sha256": digest,
            })
    return {"accountId": ACCOUNT, "bucket": BUCKET, "bytes": sum(v["bytes"] for v in videos), "videos": videos}


def upload(plan):
    # 인증 값은 Git 제외 파일에서만 읽고 명령 인수나 출력에 포함하지 않는다.
    values = {}
    for line in (WORK / ".env.r2.local").read_text(encoding="utf-8-sig").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        values[name.strip()] = value.strip().strip('"').strip("'")
    if values.get("R2_ACCOUNT_ID") != ACCOUNT or values.get("R2_BUCKET") != BUCKET:
        raise RuntimeError("R2 계정 또는 버킷이 이 프로젝트와 일치하지 않습니다.")
    if not all(values.get(key) for key in ["R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"]):
        raise RuntimeError("assets/video-work/.env.r2.local에 R2 업로드 키가 필요합니다.")

    cli = shutil.which("aws")
    if not cli:
        raise RuntimeError("AWS CLI가 필요합니다. https://aws.amazon.com/cli/")
    env = {key: value for key, value in os.environ.items() if not key.startswith("AWS_")}
    env.update({
        "AWS_ACCESS_KEY_ID": values["R2_ACCESS_KEY_ID"],
        "AWS_SECRET_ACCESS_KEY": values["R2_SECRET_ACCESS_KEY"],
        "AWS_EC2_METADATA_DISABLED": "true",
        "AWS_REQUEST_CHECKSUM_CALCULATION": "when_required",
        "AWS_RESPONSE_CHECKSUM_VALIDATION": "when_required",
        "AWS_PAGER": "",
    })
    endpoint = f"https://{ACCOUNT}.r2.cloudflarestorage.com"

    def aws(*args):
        return subprocess.run(
            [cli, *args, "--endpoint-url", endpoint, "--region", "auto"],
            env=env, capture_output=True, text=True, encoding="utf-8", errors="replace", check=False,
        )

    def head(key):
        result = aws("s3api", "head-object", "--bucket", BUCKET, "--key", key, "--output", "json")
        if result.returncode == 0:
            return json.loads(result.stdout)
        if re.search(r"\(404\)|\(NoSuchKey\)|\(NotFound\)", result.stderr):
            return None
        raise RuntimeError(f"R2 객체 조회에 실패했습니다. AWS CLI 종료 코드: {result.returncode}")

    for index, video in enumerate(plan["videos"], 1):
        remote = head(video["key"])
        if remote is not None:
            if remote["ContentLength"] != video["bytes"] or remote.get("Metadata", {}).get("sha256") != video["sha256"]:
                raise RuntimeError(f"기존 객체가 로컬 파일과 다릅니다. 덮어쓰지 않습니다: {video['key']}")
            print(f"[{index}/22] verified existing: {video['key']}", flush=True)
            continue
        # AWS CLI의 multipart 업로드로 300MiB가 넘는 감사 영상도 그대로 보존한다.
        result = aws(
            "s3", "cp", str(ROOT / video["file"]), f"s3://{BUCKET}/{video['key']}",
            "--content-type", "video/mp4", "--cache-control", "public, max-age=31536000, immutable",
            "--metadata", f"sha256={video['sha256']}", "--no-progress", "--only-show-errors",
        )
        if result.returncode:
            raise RuntimeError(f"업로드 실패: {video['key']} (AWS CLI 종료 코드 {result.returncode})")
        remote = head(video["key"])
        if remote is None or remote["ContentLength"] != video["bytes"] or remote.get("Metadata", {}).get("sha256") != video["sha256"]:
            raise RuntimeError(f"업로드 검증 실패: {video['key']}")
        print(f"[{index}/22] uploaded: {video['key']} ({video['bytes']} B)", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--upload", action="store_true", help="R2로 업로드한다. 기본 실행은 로컬 목록만 생성한다.")
    args = parser.parse_args()
    plan = make_plan()
    WORK.mkdir(parents=True, exist_ok=True)
    (WORK / "r2-upload-plan.json").write_text(json.dumps(plan, indent=2) + "\n", encoding="utf-8")
    print(f"Prepared {len(plan['videos'])} videos, {plan['bytes']:,} bytes.", flush=True)
    if args.upload:
        upload(plan)
        (WORK / "r2-uploaded.json").write_text(json.dumps(plan, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
