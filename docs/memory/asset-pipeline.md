---
name: asset-pipeline
description: 사진·영상 원본은 커밋하지 않고 리사이즈본만 넣는다. 원본 폴더 위치와 재생성 절차
metadata:
  type: project
---

**원본 자산은 저장소에 넣지 않습니다.** 리사이즈본만 커밋하고, 원본은 로컬에만 둡니다.

| 자산 | 원본 | 저장소 |
|---|---|---|
| 여정 사진 | `제자17기-*/` (레포 루트, **95MB**, `.gitignore`) | `FE/public/journey/<slug>/{thumb,full}/NN.jpg` (11.6MB) |
| 영상 | 미수령 | `public/video/*`도 `.gitignore`. Vercel Blob 권장 |

**Why:** 원본은 장당 수 MB입니다(하나로가족한마당 19장은 전부 7728×5152). 저장소에 넣으면 클론이 무거워지고, 어차피 화면에는 훨씬 작은 크기로만 쓰입니다. 재생성 스크립트가 있으면 원본을 커밋할 이유가 없습니다.

**How to apply:**

- 새 사진을 받으면 `scripts/resize-photos.py`의 `FOLDERS`에 `<한글 폴더명>: <영문 slug>`를 등록하고 실행합니다. `pip install pillow` 필요.
- 그다음 `FE/src/data/graduation.ts`에서 **장수만** 고칩니다 — 경로는 `photosOf(slug, count, label)`이 규칙으로 만듭니다. 파일명을 나열하지 마세요.
- 원본 폴더가 없는 사람은 리사이즈본으로 작업하면 됩니다. 원본이 필요하면 발주 측에 요청해야 합니다.

## 아이콘 · 썸네일

`FE/public/icons/`의 파일들도 원본에서 가공한 것이며 원본은 커밋하지 않습니다. 생성 스크립트를 따로 두지 않았으므로 방법만 적어둡니다 (Pillow).

| 파일 | 만든 방법 |
|---|---|
| `thumbnail.png` 1200×630 | 시안 스크린샷에서 배경색과 다른 픽셀의 bbox를 재어 콘텐츠만 크롭 → 상하 여백 14%를 두고 중앙 배치 → 남는 자리는 원본 배경색으로 채움 |
| `favicon-32/180.png` | `seal/wax-seal.png`의 알파 bbox를 크롭해 정사각 캔버스에 여백 8%로 중앙 배치 (투명 유지) |
| `apple-touch-icon.png` | 위와 같되 배경을 `EV.paper`로 채움 — iOS는 투명 영역을 검게 채운다 |

**아직 없는 것** (2026-09-11 기준) — 제자 수업 사진, 영상 2종. 셋 다 placeholder로 자리만 잡혀 있습니다.
