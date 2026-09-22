# -*- coding: utf-8 -*-
"""
여정 사진 다운샘플링 — 캐러셀용 thumb(320w) + 라이트박스용 full(1280w)

원본은 스마트폰·DSLR 촬영본이라 장당 수 MB에 이른다(첫 수령분 59장 = 95MB).
그대로 올리면 모바일에서 로딩이 감당이 안 되므로 두 벌로 줄여 public/journey/에 넣는다.

    thumb   320w   카드 폭 128px x DPR 2배 여유
    full   1280w   루트 폭 460px x DPR 2~3배

첫 수령분 59장은 2026-09-11 처리 후 원본 폴더를 삭제했다(레포에 리사이즈본만 남음).
새 사진을 받았을 때 다시 쓰는 스크립트다.

사용법:
    1) 원본 폴더를 레포 루트에 두고 SRC·FOLDERS를 맞춘다
       (SRC 기본값은 첫 수령분 폴더명이므로 새 폴더명으로 바꿀 것)
    2) pip install pillow
    3) python scripts/resize-photos.py
    4) FE/src/data/graduation.ts 의 photosOf("<slug>", <장수>, "<라벨>") 갱신

추가 사진 한 장을 지정 번호로 만들기:
    python scripts/resize-photos.py --source assets/photo-originals/graduation/01.jpg --slug graduation --start 1

출력 파일명은 원본 이름순으로 --start 번호(기본 1)부터 매긴다. 기존 출력은 덮어쓰지 않는다.
원본 폴더는 .gitignore 처리되어 저장소에 올라가지 않는다.
"""
import os
import argparse
import re
import sys
from PIL import Image, ImageOps

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(REPO, '제자17기-20260908T041155Z-1-001')
DST = os.path.join(REPO, 'FE', 'public', 'journey')

FOLDERS = {
    '입학식': 'entrance',
    '하나로가족한마당': 'festival',
    '식사모임': 'fellowship',
}

THUMB_W, FULL_W = 320, 1280
THUMB_Q, FULL_Q = 78, 82

sys.stdout.reconfigure(encoding='utf-8')
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source', help='추가 원본 파일 또는 새 사진만 모아 둔 폴더')
parser.add_argument('--slug', help='출력 시기 이름 (예: graduation)')
parser.add_argument('--start', type=int, default=1, help='첫 출력 번호. 기존 사진 다음 번호를 지정')
args = parser.parse_args()
if bool(args.source) != bool(args.slug):
    parser.error('--source와 --slug를 함께 지정하세요.')
if args.start < 1:
    parser.error('--start는 1 이상이어야 합니다.')
if args.slug and not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', args.slug):
    parser.error('--slug에는 영문 소문자·숫자·하이픈만 쓸 수 있습니다.')
if args.source and not os.path.exists(args.source):
    parser.error('원본 파일 또는 폴더를 찾을 수 없습니다.')

jobs = [(args.slug, args.slug, os.path.abspath(args.source))] if args.source else [
    (ko, slug, os.path.join(SRC, ko)) for ko, slug in FOLDERS.items()
]
total_in = total_out = 0
for ko, slug, src in jobs:
    if not os.path.exists(src):
        print(f'SKIP {ko} — 원본 폴더 없음', flush=True)
        continue

    files = [src] if os.path.isfile(src) else sorted(
        os.path.join(src, f) for f in os.listdir(src)
        if f.lower().endswith(('.jpg', '.jpeg', '.png')) and os.path.isfile(os.path.join(src, f))
    )
    if not files:
        parser.error(f'{src}: 변환할 사진이 없습니다.')
    # 추가 사진 때문에 이미 배치된 사진을 덮어쓰지 않도록 생성 전에 모두 확인한다.
    for i in range(args.start, args.start + len(files)):
        for sub in ('thumb', 'full'):
            target = os.path.join(DST, slug, sub, f'{i:02d}.jpg')
            if os.path.exists(target):
                parser.error(f'기존 파일을 덮어쓸 수 없습니다: {target}. --start를 확인하세요.')
    for sub in ('thumb', 'full'):
        os.makedirs(os.path.join(DST, slug, sub), exist_ok=True)

    for i, p in enumerate(files, args.start):
        total_in += os.path.getsize(p)
        with Image.open(p) as im:
            # 스마트폰 촬영본은 EXIF 회전 정보를 갖고 있어 그대로 저장하면 눕는다.
            im = ImageOps.exif_transpose(im).convert('RGB')
            for sub, w, q in (('thumb', THUMB_W, THUMB_Q), ('full', FULL_W, FULL_Q)):
                out = im.copy()
                if out.width > w:
                    out = out.resize((w, round(out.height * w / out.width)), Image.LANCZOS)
                dst = os.path.join(DST, slug, sub, f'{i:02d}.jpg')
                out.save(dst, 'JPEG', quality=q, optimize=True, progressive=True)
                total_out += os.path.getsize(dst)

    print(f'{slug}: {len(files)}장', flush=True)

print(f'IN  {total_in / 1024 / 1024:.1f} MB', flush=True)
print(f'OUT {total_out / 1024 / 1024:.1f} MB', flush=True)
