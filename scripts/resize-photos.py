# -*- coding: utf-8 -*-
"""
여정 사진 다운샘플링 — 캐러셀용 thumb(320w) + 라이트박스용 full(1280w)

원본은 스마트폰·DSLR 촬영본이라 장당 수 MB에 이른다(첫 수령분 59장 = 95MB).
그대로 올리면 모바일에서 로딩이 감당이 안 되므로 두 벌로 줄여 public/journey/에 넣는다.

    thumb   320w   카드 폭 128px x DPR 2배 여유
    full   1280w   루트 폭 460px x DPR 2~3배

사용법:
    1) 원본 폴더를 레포 루트에 두고 FOLDERS에 <한글 폴더명>: <영문 slug> 등록
    2) pip install pillow
    3) python scripts/resize-photos.py
    4) FE/src/data/graduation.ts 의 photosOf("<slug>", <장수>, "<라벨>") 갱신

출력 파일명은 원본 이름순으로 01.jpg, 02.jpg ... 로 다시 매긴다.
원본 폴더는 .gitignore 처리되어 저장소에 올라가지 않는다.
"""
import os
from PIL import Image, ImageOps

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(REPO, '제자17기-20260908T041155Z-1-001')
DST = os.path.join(REPO, 'FE', 'public', 'journey')

FOLDERS = {
    '입학식': 'entrance',
    '하나로가족한마당': 'festival',
    '식사모임': 'fellowship',
    # 제자 수업 사진은 아직 미수령 — 확보되면 '제자수업': 'class' 를 추가한다
}

THUMB_W, FULL_W = 320, 1280
THUMB_Q, FULL_Q = 78, 82

total_in = total_out = 0
for ko, slug in FOLDERS.items():
    src = os.path.join(SRC, ko)
    if not os.path.isdir(src):
        print(f'SKIP {ko} — 원본 폴더 없음', flush=True)
        continue

    files = sorted(f for f in os.listdir(src)
                   if f.lower().endswith(('.jpg', '.jpeg', '.png')))
    for sub in ('thumb', 'full'):
        os.makedirs(os.path.join(DST, slug, sub), exist_ok=True)

    for i, f in enumerate(files, 1):
        p = os.path.join(src, f)
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
