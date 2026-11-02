# 2026-11-02 · 「함께 걸어온 길」에 성전청소 추가

> 사용자가 보낸 사진 4장으로 식사 모임과 졸업 예배 사이에 「성전청소」 시기를 새로 만들었다. 여정 사진은 65장이 되었다.

## 한 일

| 파일 | 내용 |
|---|---|
| `FE/src/data/graduation.ts` | `journey`에 `{ period: "2026", title: "성전청소", photos: photosOf("cleaning", 4, "성전청소") }`를 식사 모임 다음에 추가. 머리 주석의 사진 수 61 → 65 |
| `FE/public/journey/cleaning/{thumb,full}/01~04.webp` | 기존 도구 `scripts/resize-photos.py --source assets/photo-originals/cleaning --slug cleaning --start 1`로 생성 (thumb 320×240 · full 1280×960) |
| `assets/photo-originals/cleaning/` (Git 제외) | 원본 4장을 `01~04.jpg`로 복사하고 `inventory.json`에 수령 파일명·SHA-256·크기 기록 |
| `README.md` · `docs/requirements.md` | 사진 수(65장, 시기별 내역), 타임라인 5개 시기, WebP 합계 9.00MB → 9.65MB, 시기 slug 목록 |
| `docs/memory/asset-pipeline.md` | 원본 보관 위치와 표시 시기 판단 |

## 판단한 것

**1. slug는 `cleaning`** — 기존 slug(`entrance` · `festival` · `fellowship` · `graduation`)처럼 영문 한 단어로 두었다. 제목 「성전청소」는 사용자가 지정했다.

**2. 시기 표기는 `2026`만** — 원본에 EXIF 촬영일이 없고(카카오톡 전송본, 1400×1050), 파일명의 `20261028`은 받은 날짜다. 월을 지어내지 않고, 시기를 특정하지 않은 식사 모임과 같은 형식을 따랐다.

**3. 번호는 사용자가 첨부한 순서대로** — 카카오톡 파일명 순서(`…066` → `_01` → `_02` → `_03`)와 반대지만, 캐러셀이 사진을 섞어 보여 주므로 화면에는 영향이 없다. 대응 관계는 `inventory.json`에 남겼다.

**4. 원본은 지우지 않음** — 기존 규칙대로 리사이즈본만 커밋하고, 원본은 Git 제외 폴더에 복사했다. `Downloads`의 받은 파일도 그대로 두었다.

## 확인한 것

| 항목 | 결과 |
|---|---|
| 원본 복사 | 4장 모두 복사 전후 SHA-256 일치 |
| 생성 파일 | thumb 4장 320×240, full 4장 1280×960 디코딩 확인. 4장 합계 0.62MiB |
| 화면 | 빌드 결과를 로컬 미리보기로 띄워 390×844(DPR 2)에서 봉투를 열고 확인. 시기 순서 입학식 → 하나로가족한마당 → 식사 모임 → **성전청소** → 졸업 예배, 성전청소 캐러셀에 사진이 표시됨 |
| 폰트 | 빌드의 부분 폰트 검사 통과 — 「성전청소」 글자는 기존 서브셋에 있음 |
| 검증 명령 | `npm run build` · `npm run lint` 통과 |

라이트박스(확대 보기)는 직접 열어 보지 않았다. 다른 시기와 같은 컴포넌트·같은 규격 파일이라 따로 확인하지 않았다. 로컬 미리보기의 `/_vercel/insights/script.js` 404는 Vercel에서만 제공되는 스크립트라 정상이다.

## 남긴 것

- 성전청소 날짜(월)를 알게 되면 `graduation.ts`의 `period`만 `"2026 · MM"`으로 고친다.
