# 아멘 제자 17기 졸업 · 모바일 졸업장

> 하나로교회 **아멘 제자 17기**의 졸업을 축하하고 알리는 모바일 웹 페이지.

- 🎓 **일시** — **2026.09.20 (주) 오후예배 14:30**
- 📍 **장소** — 하나로교회 **다윗성전**
- 🌐 **배포** — https://2026amen17graduation.vercel.app *(2026-09-07 프로덕션 배포 · 상시 공개)*

봉투를 눌러 열면 졸업장 톤의 세로 스크롤 본문이 드러나는 단일 페이지. 카카오톡으로 링크를 공유해 전 교인이 열람하는 것이 목적이며, **모바일 세로 화면이 기본 환경**입니다.

이 페이지의 중심 콘텐츠는 **10개 초원의 졸업 간증 영상**입니다. 초원별 영상과 이름을 2열 × 5행으로 표시합니다. 최초 기획 배경과 변경 사항은 [`docs/requirements.md`](./docs/requirements.md) 참고.

---

## 현재 상태

**디자인·명단·여정 사진 반영 완료. 2026-09-25 수령한 새 간증 영상 10편을 변환해 Vercel Blob으로 공개 배포했습니다. 간증 10편과 졸업 예배 감사 합본을 재생할 수 있습니다.**

졸업 예배는 2026-09-20에 진행되었으며 명단 128명, 여정 사진 61장이 반영되어 있습니다. 초원명과 영상 등 콘텐츠는 [`FE/src/data/graduation.ts`](./FE/src/data/graduation.ts)에서 변경합니다.

| 항목 | 상태 |
|---|---|
| 봉투 개봉 연출 | ✅ 구현 |
| 5개 섹션 레이아웃 · 모션 | ✅ 구현 |
| 사진 캐러셀 (터치/드래그/Shift+휠) | ✅ 구현 |
| 졸업 일시 · 장소 | ✅ 2026-09-20 (주) 오후예배 14:30 · 다윗성전 |
| 졸업생 명단 | ✅ **128명** 실명 반영 (2026-09-11) |
| 여정 사진 | ✅ 61장 배치 (입학식 23 · 하나로가족한마당 19 · 식사 모임 18 · 졸업 예배 1) |
| 공유 썸네일 · 탭 아이콘 | ✅ 1200×630 썸네일, 왁스 씰 favicon |
| 졸업 예배 영상 | ✅ 감사 영상 7개 통합본의 경량·고화질 파일 준비, 사진 아래 경량본 연결 및 Vercel Blob 공개 배포 |
| 졸업 간증 영상 | ✅ 초원별 10개 카드와 실제 초원명<br>✅ 2026-09-26 새 수령본 10편의 변환·공개 URL 등록·교체 |
| 열람 기한 처리 | ❌ **구현 안 함** — 배포를 직접 내릴 때까지 상시 공개 (2026-09-07 결정) |
| 어워드(시상) 섹션 | ⏳ 후속 과제 |

---

## 기술 스택

| 영역 | 라이브러리 |
|---|---|
| Build/Dev | Vite 8 |
| UI | React 19 + TypeScript 6 |
| 배포 | Vercel (정적) |
| Fonts | Nanum Myeongjo · Cinzel Decorative (Google Fonts) |
| Lint | typescript-eslint, eslint-plugin-react-hooks |

런타임 의존성은 `react`, `react-dom`, `@vercel/analytics` 세 개뿐입니다. 라우터·상태관리·CSS 프레임워크 없이 인라인 스타일과 로컬 state로 처리합니다. API·서버 상태가 없어 서버리스 함수도 두지 않았습니다.

---

## 화면 구조

```
┌─ App (root, max-width 460px, height 100dvh) ─────────┐
│                                                       │
│  [z 20] Envelope   — 봉투 오버레이                     │
│         stage: closed → opening → out                 │
│                                                       │
│  [z 10] 본문       — [data-scroll-root] 세로 스크롤     │
│         01 Cover / 02 Testimony / 03 Journey          │
│         04 Graduates / 05 Closing                     │
└───────────────────────────────────────────────────────┘
```

`stage === 'out'`이 되면 봉투 레이어가 `opacity 0` + `pointer-events: none`이 되어 본문만 남습니다.

| # | 섹션 | 핵심 요소 |
|---|---|---|
| — | **Envelope** | **진입**: 라벨 → 봉투 → 안내 문구 순으로 도착 (~1.55s)<br>**열기**: 화면 아무 곳이나 탭 → 기존 속도로 플랩 `rotateX(-172°)`·안쪽 카드 `-72%` 상승 → 카드 상승 완료 후 지연 없이 오버레이 페이드아웃 (클릭 후 ~1.7s). 첫 섹션 내용은 ~2.2s에 완전히 표시 |
| 01 | **Cover** | 금박 이중 프레임, `AMEN 17TH`, 대형 타이틀, 왁스 씰, 일시·장소 한 줄<br>하단에 스크롤 힌트 — 한 번이라도 스크롤하면 영구히 사라짐 |
| 02 | **Testimony** | 초원별 16:9 영상 10개, 2열 × 5행. 각 영상 아래 초원명 표시. URL이 없거나 로드 실패 시 해당 카드만 준비 안내로 폴백 |
| 03 | **Our Journey** | 4개 시기 세로 타임라인<br>입학식 → 하나로가족한마당 → 식사 모임 → **졸업 예배**<br>각 시기에 **사진 캐러셀**(셔플 · 자동 흐름 · 드래그 · 확대 보기), 졸업 예배는 사진 아래 **감사 영상**도 표시. 한 장인 사진은 복제·자동 이동 없이 표시 |
| 04 | **Graduates** | 4열 이름 그리드 |
| 05 | **Closing** | 느헤미야 8:6 · 겹낫표 · 푸터 |

스크롤과 무관하게 떠 있는 요소:

- **ShareFAB** — 우하단 공유 버튼. 봉투가 걷힌 뒤에만 나타나며(오버레이보다 z-index가 높아 게이트 필수), 탭하면 바텀시트가 올라옵니다. 링크 복사 / 카카오톡 공유 두 가지, 핸들을 아래로 끌거나 배경 탭·`Esc`로 닫힙니다.

---

## 폴더 구조

```
2026_amen17_graduation/
├── FE/                                 # 프론트엔드 (Vite + React + Vercel)
│   ├── public/
│   │   ├── seal/wax-seal.png           # 왁스 씰 (360×300, 73KB)
│   │   ├── journey/<slug>/             # 여정 사진 — thumb(320w) · full(1280w) 2벌
│   │   ├── video/                      # 재생용 영상 — testimony/NN/ · graduation/ (git 제외)
│   │   ├── video-posters/              # 재생 전 표시할 WebP 썸네일 11장 (Git 포함)
│   │   └── icons/                      # thumbnail(공유 카드) · favicon · apple-touch-icon
│   ├── src/
│   │   ├── App.tsx                     # 봉투 stage + 2레이어 조립
│   │   ├── main.tsx
│   │   ├── index.css                   # 글로벌 리셋 + @keyframes ev-breathe
│   │   ├── theme/tokens.ts             # EV(색), FF(폰트), MOTION, LAYOUT
│   │   ├── data/
│   │   │   ├── types.ts                # GraduationData 타입 + EnvelopeStage
│   │   │   └── graduation.ts           # 모든 정적 콘텐츠 (교체 지점)
│   │   ├── hooks/
│   │   │   ├── useReveal.ts            # IntersectionObserver + active 게이트
│   │   │   ├── useScrolled.ts          # 스크롤 여부 1회 판정 (힌트 숨김용)
│   │   │   ├── useShuffled.ts          # 마운트 시 1회 셔플
│   │   │   └── usePrefersReducedMotion.ts
│   │   ├── components/
│   │   │   ├── sections/               # Envelope, Cover, Testimony, Journey, Graduates, Closing
│   │   │   └── common/                 # Section, Frame, Rule, SectionHead, Seal, PhotoRail,
│   │   │                               #   Lightbox, VideoSlot, Reveal, ScrollHint,
│   │   │                               #   ShareFAB, CornerOrnaments
│   │   └── utils/
│   │       ├── kakaoShare.ts           # Kakao SDK 로더 + sendScrap (OG 태그 기반)
│   │       └── share.ts                # 정식 URL · 링크 복사 · 네이티브 공유 폴백
│   ├── index.html                      # 폰트 링크 + OG 태그
│   ├── .env.example
│   └── package.json
│
├── FE-legacy/                          # Claude Design 핸드오프 번들 (원본 보존)
│   ├── README.md                       # 화면별 확정 스펙 (구현 기준 문서)
│   ├── DESIGN_PROCESS.md               # 시안 선정 판단 과정
│   ├── final/                          # 채택안 N3 · 봉투 개봉 프로토타입
│   ├── explorations/                   # 미채택 시안 9종 + 폰트 비교
│   └── screenshots/
│
├── docs/
│   ├── call-transcript.txt              # 발주 통화 전문 (익명화)
│   ├── requirements.md                 # 통화 → 요구사항 정리
│   ├── urls.md
│   ├── worklog/                        # 작업로그 — 무엇을 왜 그렇게 했는지
│   │   └── README.md                   #   인덱스 + 작성 규칙
│   └── memory/                         # 세션 간 유지되는 메모리
│       └── MEMORY.md                   #   인덱스 + 작성 규칙
│
├── scripts/
│   └── resize-photos.py                # 원본 사진 → thumb/full 2벌 생성
│
└── CLAUDE.md                           # 세션 시작 시 자동 로드되는 프로젝트 규약
```

`CLAUDE.md`는 코드 컨벤션과 "되돌리면 안 되는 것"을 담고, `@docs/memory/MEMORY.md`를 import 해 메모리 인덱스를 함께 불러옵니다. 작업로그·메모리 운영 규칙은 각 폴더의 인덱스 파일에 있습니다.

---

## 로컬 개발

```sh
cd FE
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run lint
npm test           # 지연 로딩·중단/재개·전체화면 전환·오류 복귀 (Node.js 22.18+)
```

---

## 배포 (Vercel)

참고 레포와 동일한 방식입니다. **`vercel.json`을 두지 않고** 프로젝트 설정은 전부 Vercel 대시보드에서 관리합니다.

| 설정 | 값 |
|---|---|
| Root Directory | **`FE`** ← 앱이 하위 폴더에 있으므로 반드시 지정 |
| Framework Preset | Vite (자동 감지) |
| Build Command | `npm run build` (자동) |
| Output Directory | `dist` (자동) |

### 새 작업 환경 — 기존 프로젝트 연결

프로젝트와 Git 자동 배포는 이미 연결되어 있습니다. Blob 업로드·환경 변수 관리를 위해 로컬 CLI 연결이 필요한 경우에만 실행합니다.

```sh
cd FE
npx vercel login          # 브라우저 인증 (직접 실행 필요)
npx vercel link --project 2026_amen17_graduation --scope su-heon-choi-s-projects
```

`FE/.vercel/project.json`이 생성되며 이 폴더는 **커밋하지 않습니다** (`.gitignore` 처리됨).

### 이후 배포 — Git 자동 배포

`HoneyWater8/2026_amen17_graduation` 레포가 연결되어 있어 **검증한 변경 사항을 `main`에 커밋·푸시하면 자동으로 프로덕션 배포**됩니다. 2026-09-22 사용자 확인에 따라 앱 배포는 이 방식으로 진행합니다.

```sh
git push origin main      # → Vercel이 자동 빌드·배포
```

푸시 후 Vercel의 자동 빌드·배포 결과와 실제 사이트를 확인합니다. `vercel deploy`, `vercel --prod`, `vercel redeploy` 같은 직접 배포 명령은 사용하지 않습니다. Blob 업로드와 환경 변수 등록에 사용하는 CLI 명령은 별개입니다.

> **Root Directory는 반드시 `FE`여야 합니다.** Git 빌드는 레포 루트를 기준으로 하며 앱의 `package.json`은 `FE/`에 있습니다.

### 환경 변수

필수 환경 변수는 **없습니다.** 등록하지 않아도 페이지는 정상 동작하며, 준비되는 대로 등록하면 됩니다 (자세한 내용은 `FE/.env.example`).

| 변수 | 용도 | 없을 때 |
|---|---|---|
| `VITE_TESTIMONY_1_VIDEO_URL` ~ `VITE_TESTIMONY_10_VIDEO_URL` | 초원별 졸업 간증 영상 (§02) | 01~10 모두 로컬 경량본 사용. 로드 실패 시 준비 안내 |
| `VITE_TESTIMONY_1_VIDEO_FULL_URL` ~ `VITE_TESTIMONY_10_VIDEO_FULL_URL` | 초원별 전체화면 고화질 영상 | 로컬 `hd.mp4`. 원격 경량본만 설정한 경우 경량본 유지 |
| `VITE_GRADUATION_VIDEO_FULL_URL` | 감사 합본 전체화면 고화질 영상 | 로컬 `hd.mp4`. 원격 경량본만 설정한 경우 경량본 유지 |
| `VITE_TESTIMONY_1_VIDEO_POSTER` ~ `VITE_TESTIMONY_10_VIDEO_POSTER` | 초원별 영상 포스터 재정의 (선택) | `/video-posters/testimony/NN.webp` |
| `VITE_GRADUATION_VIDEO_POSTER` | 감사 합본 포스터 재정의 (선택) | `/video-posters/graduation.webp` |
| `VITE_GRADUATION_VIDEO_URL` | 졸업 예배 감사 영상 (§03 여정 마지막) | `/video/graduation/preview.mp4` 사용. 파일이 없으면 준비 안내 |
| `VITE_KAKAO_JS_KEY` | 카카오톡 공유 | `navigator.share`(네이티브 공유 시트)로 폴백 |

> `VITE_KAKAO_JS_KEY`는 카카오 개발자 콘솔의 **JavaScript 키**입니다. 키만으로는 동작하지 않고, 콘솔에 배포 도메인을 등록해야 합니다.
>
> **[앱] → 제품 링크 관리 → 사이트 도메인** 에 `https://2026amen17graduation.vercel.app` 추가.
> 「앱 설정 → 플랫폼 → Web」에도 도메인 입력란이 있지만 **공유 기능이 보는 곳은 제품 링크 관리**입니다.
> 빠지면 공유 버튼을 눌렀을 때 `4019 잘못된 요청으로 인증에 실패` 오류가 납니다 (2026-09-11 실제로 겪음).
> 와일드카드는 지원하지 않으므로 프리뷰 URL이나 `http://localhost:5173`도 쓰려면 따로 등록해야 합니다.

```sh
npx vercel env pull .env.local   # 대시보드에 등록한 값을 로컬로 가져오기
```

### 배포 후 반드시 확인할 것

`FE/index.html`의 OG 태그에 도메인이 **하드코딩**되어 있습니다. 실제 배포 도메인이 다르면 카카오톡 공유 미리보기가 깨집니다.

```html
<meta property="og:url"   content="https://2026amen17graduation.vercel.app" />
<meta property="og:image" content="https://2026amen17graduation.vercel.app/icons/thumbnail.png" />
```

- ✅ **도메인 일치 확인 완료** — 프로덕션 별칭이 `https://2026amen17graduation.vercel.app` 로 잡혀 하드코딩 값과 같습니다. 도메인을 바꾸면 `og:url` · `og:image` · `twitter:image` 세 곳을 함께 교체하세요.
- ✅ **`public/icons/thumbnail.png`** — 1200×630 (1.91:1). 정사각형은 카카오톡에서 작은 썸네일로 붙어 눈에 덜 띕니다.
- ⚠️ **카카오는 OG 이미지를 URL 단위로 캐싱합니다.** 같은 경로에 파일만 바꾸면 옛 이미지가 계속 나갑니다. [공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 캐시를 초기화하거나, 확실히 하려면 파일명을 바꾸고 `og:image`도 함께 고치세요.

### 사용자 집계

두 도구를 역할을 나눠 씁니다. 참고 레포에서 **페이지뷰·UV를 아예 수집하지 못한 것**이 아쉬웠던 점이라, 이번에는 사전에 붙였습니다.

| | Vercel Web Analytics | Google Analytics 4 |
|---|---|---|
| 무엇 | 방문자 수 · 페이지뷰 · 유입 경로 · 기기 | 봉투 열기 · 섹션 도달 · 영상 재생 · 공유 · 사진 확대 |
| 켜는 법 | `<Analytics />` (항상 켜짐) | `index.html`의 표준 gtag 스니펫 |
| 쿠키 | 없음 | 사용 |
| 보존 | **1개월** (Hobby) | 14개월 |

**Vercel 대시보드에서 Web Analytics를 활성화**해야 수집이 시작됩니다 (프로젝트 → Analytics 탭 → Enable).

수집하는 GA4 이벤트:

| 이벤트 | 시점 |
|---|---|
| `envelope_open` | 봉투를 눌러 열었을 때 |
| `section_view` | 섹션이 40% 이상 보였을 때 (`section` = `01 Cover` 등). 왕복해도 1회만 |
| `video_play` | 영상 재생 (`video` = `testimony-1` ~ `testimony-10` / `graduation`). 초원별로 구분하여 집계 |
| `photo_open` | 사진 카드를 눌러 확대 |
| `share_open` · `share_kakao` · `share_native` · `share_copy` | 공유 시트 열기와 각 경로 |

> ⚠️ **Hobby 플랜은 Vercel 데이터가 1개월만 보존됩니다.** 행사 후 통계를 정리하시려면 **2026년 10월 중순 전에** 대시보드를 캡처해 두세요. Hobby는 커스텀 이벤트도 지원하지 않아 위 행동 지표는 GA4에서만 볼 수 있습니다.

### 운영 정책

**자동 만료 없이 상시 공개합니다.** 열람 기한 기능은 구현하지 않기로 했으며, 내릴 때는 Vercel 대시보드에서 배포를 제거하거나 프로젝트를 삭제합니다.

---

## 콘텐츠 교체 방법

모든 콘텐츠는 [`FE/src/data/graduation.ts`](./FE/src/data/graduation.ts) 한 파일에 모여 있습니다.

**졸업 일자·장소** — `when` / `where` 값 교체.

**졸업생 명단** — `roster` 배열. 4열 그리드라 개수 제한은 없습니다.

원본 시트는 [`docs/roster-2026-09.xlsx`](./docs/roster-2026-09.xlsx)이며 장년(남·여)·청년(남·여) 네 그룹이 열로 나뉘어 있습니다. 페이지에는 그룹 구분 없이 **이름 오름차순 한 덩어리**로 싣습니다. `이서영B`처럼 붙은 `B`는 **동명이인 구분자이므로 원본 표기를 그대로 씁니다** — 떼면 명단에서 누가 누구인지 구분되지 않습니다.

**여정 사진** — 원본을 그대로 쓰지 않고 두 벌로 줄여서 넣습니다 (캐러셀 썸네일 320w · 라이트박스 1280w).

```sh
# 1) 원본 폴더를 레포 루트에 두고 scripts/resize-photos.py 의 FOLDERS 에 등록
#    기존 시기: entrance(입학식), festival(하나로가족한마당), fellowship(식사 모임)
# 2) 실행 — FE/public/journey/<slug>/{thumb,full}/NN.jpg 로 생성됨
pip install pillow
python scripts/resize-photos.py
```

그다음 `graduation.ts`에서 장수만 바꿉니다. 파일명은 규칙으로 생성되므로 나열할 필요가 없습니다.

```ts
photos: photosOf("entrance", 23, "입학식")   // 해당 시기의 실제 장수로 변경
```

첫 수령분 59장은 **95MB → 11.6MB**로 줄었습니다. 원본 폴더는 `.gitignore` 처리되어 커밋되지 않습니다.

**졸업 예배 사진 추가** — 원본은 `assets/photo-originals/graduation/NN.jpg`에 보관합니다. 현재 `01.jpg`가 있으며 다음 사진은 `02.jpg`부터 번호를 이어 붙입니다.

```sh
python scripts/resize-photos.py --source assets/photo-originals/graduation/02.jpg --slug graduation --start 2
```

위 명령은 해당 사진만 `FE/public/journey/graduation/{thumb,full}/02.jpg`로 변환합니다. 기존 출력은 덮어쓰지 않습니다. 추가한 뒤 `photosOf("graduation", 2, "졸업 예배")`처럼 장수도 갱신하세요.

```ts
{ caption: "개강 첫날", tag: "01", image: "/journey/01.jpg" }
```

**졸업 간증 영상** — `G.testimony.groups`에 10개 초원이 등록되어 있습니다. `testimonyOf()`의 두 번째 인자는 표시명이며, 배열 순서대로 왼쪽부터 배치합니다. 첫 번째 인자는 재생 집계용 고정 번호이므로 초원명을 바꾸어도 유지합니다.

**영상은 재생 버튼을 누를 때만 불러오며 한 번에 하나만 재생합니다.** 재생 전에는 WebP 썸네일을 표시하고 MP4 주소를 연결하지 않습니다. 간증·감사 영상을 구분하지 않고 다른 영상을 재생하거나 탭을 숨기거나 페이지를 떠나면 기존 영상의 주소를 해제해 다운로드를 중단합니다. 같은 페이지에서 다시 재생 버튼을 누르면 멈춘 위치·속도·음량·음소거를 복원합니다. 화면에 돌아오기만 해서는 자동 재생하지 않으며, 새로고침 후 위치는 저장하지 않습니다.

썸네일은 `FE/public/video-posters/`에 Git으로 배포합니다(11장 합계 163,112 B). 영상을 교체하면 `python scripts/prepare-videos.py --section posters`로 썸네일도 갱신합니다. 이 최적화는 시청하지 않는 영상의 전송을 줄이며, 실제 재생·고화질 전환에 필요한 전송량은 발생합니다.

영상 원본은 `assets/video-originals/`에 보존하고, `scripts/prepare-videos.py`로 경량본 `preview.mp4`, 보존용 고화질본 `full.mp4`, 전체화면 배포용 `hd.mp4`를 만듭니다. `hd.mp4`는 `full.mp4`의 해상도·프레임률을 유지하면서 웹 전송용으로 재압축합니다. 초원별 수령 현황·파일 경로·감사 통합본 순서·재생성 방법은 [영상 자산 관리](./docs/video-assets.md)를 참고하세요.

**전체화면 화질 전환** — 간증 10편과 감사 합본 모두 평소에는 경량본을 재생하고, 영상 전체화면에 들어갈 때만 고화질본을 요청합니다. 전체화면을 닫으면 경량본으로 돌아오며 재생 위치·재생/일시정지·속도·음량·음소거를 유지합니다. 고화질 요청이 실패하거나 15초 안에 준비되지 않으면 같은 위치의 경량본으로 복귀합니다. 전환 중 다른 영상을 재생해도 이전 영상이 뒤늦게 자동 재개하지 않습니다. 브라우저 정책으로 자동 재개가 제한되면 같은 위치에서 재생 버튼으로 이어 볼 수 있습니다.

고화질 URL은 `VITE_TESTIMONY_1_VIDEO_FULL_URL`~`VITE_TESTIMONY_10_VIDEO_FULL_URL`, `VITE_GRADUATION_VIDEO_FULL_URL`에 지정합니다. 원격 경량본 주소만 있고 고화질 주소가 없으면 경량본을 유지합니다. 로컬 기본 경로는 각 영상 폴더의 `hd.mp4`입니다. 표준 전체화면 이벤트와 Safari 네이티브 영상 이벤트를 처리하며, iPhone·카카오 인앱 브라우저 실기기 동작은 별도 확인 대상입니다.

초원 01~10은 `/video/testimony/NN/preview.mp4`를 기본 재생 경로로 사용합니다. 초원별 공개 URL을 지정하면 그 주소를 우선합니다 (예: 초원 1은 `VITE_TESTIMONY_1_VIDEO_URL`, 자세한 설정은 `FE/.env.example`). 2026-09-25 새 수령본은 `assets/video-originals/testimony/`에 정본 초원명으로 보관했으며 이전 원본 4편은 `assets/video-originals/archive/2026-09-25/testimony/`에 보존했습니다. 현재 재생본은 새 수령본 10편 기준입니다.

| 방식 | 방법 | 적합한 경우 |
|---|---|---|
| 로컬 파일 | `FE/public/video/` 아래에 두고 해당 초원의 URL을 `/video/파일명.mp4`로 지정 | 로컬 확인 (`public/video/*`는 git 제외) |
| **Cloudflare R2 + Worker** | 영상 업로드 후 Production/Preview 환경 변수에 공개 주소 지정 | 배포용 영상. 기존 졸업 사이트 주소 유지 |

재생에 실패하면 해당 카드에 준비 안내가 표시됩니다. **2026-09-27 Cloudflare R2로 영상 호스팅을 이전합니다.** 간증 10편·감사 합본의 경량본과 고화질본은 Cloudflare에서 직접 전송하고 웹앱·이미지는 기존 Vercel 사이트에서 제공합니다. 영상 교체는 새 파일 업로드 → 공개 URL 검증 → 환경 변수 변경 → `main` 커밋·푸시를 통한 자동 배포 순서로 반영합니다. 현재 반영 단계·설정·무료 한도는 [Cloudflare R2 운영 문서](./docs/cloudflare-r2.md)를 참고하세요. 기존 단일 영상 변수 `VITE_TESTIMONY_VIDEO_URL`과 `/video/testimony.mp4` 자동 연결은 사용하지 않습니다.

**졸업 예배 감사 영상** — 사진 캐러셀 아래에서 `VITE_GRADUATION_VIDEO_URL`의 경량본을 재생하고 전체화면에서는 `VITE_GRADUATION_VIDEO_FULL_URL`로 전환합니다. 환경 변수가 없는 로컬 환경에서는 `/video/graduation/{preview,hd}.mp4`를 사용합니다.

**맺는 말씀** — 제목은 `G.closing.label`, 제작자 문구는 `G.closing.credit`에서 관리합니다. 마지막 섹션 하단 24px 위에 저작권과 `DESIGNED & DEVELOPED BY HONEYWATER`를 함께 표시합니다. 공유 버튼 공간을 양옆에 확보하며, 좁은 화면에서는 문구가 줄바꿈됩니다. 제작자 문구는 참고 레포의 표기를 따릅니다.

---

## 디자인 토큰 (`FE/src/theme/tokens.ts`)

```ts
EV.paper     = '#FBF7EE'   // 기본 배경 (표지·여정·맺는 말씀)
EV.paperDeep = '#F2EADA'   // 교차 배경 (영상·명단), 사진 카드
EV.envel     = '#EDE2CB'   // 봉투 본체
EV.envelDk   = '#DFD0B2'   // 봉투 접힘·테두리
EV.backdrop  = '#E5DCC8'   // 460px 밖 여백
EV.ink       = '#1E1B16'   // 본문 텍스트
EV.inkSoft   = '#5A5348'   // 보조 텍스트
EV.gold      = '#A8862C'   // 장식 전용 (선·테두리)
EV.goldTx    = '#6F5719'   // 텍스트용 금색
EV.goldLt    = '#D8BE72'   // 어두운 배경 위 금색
EV.seal      = '#8C2B22'   // 포인트 (씰·영문 라벨·다이아몬드)
```

폰트 — 한글은 **Nanum Myeongjo**로 통일, 포인트 **Cinzel Decorative**는 라틴·숫자에만.

> ⚠️ 두 가지 주의사항이 코드 주석에도 박혀 있습니다.
> 1. `EV.gold`(#A8862C)는 paper 위 대비가 3.21:1이라 **24px 미만 텍스트에 쓰면 안 됩니다.** `EV.goldTx`를 쓰세요.
> 2. `FF.latin`(Cinzel Decorative)은 **한글 글리프가 없습니다.** 한글이 섞인 문자열에 쓰면 한 줄 안에서 서체가 갈라집니다.

---

## 구현 노트

핸드오프 문서가 "프로토타입에서 실제로 겪었다"고 기록한 함정들. 전부 코드에 반영되어 있으며, 리팩터링 시 되돌리지 않도록 주석으로 표시해 두었습니다.

1. **`100dvh` 사용** — `100vh`는 모바일 주소창 높이를 포함해 하단이 잘립니다. (`App.tsx`, `index.css`)
2. **body 배경을 `EV.backdrop`과 일치** — 스크롤 바운스 시 다른 색이 노출됩니다. (`index.css`)
3. **플랩에 `backface-visibility: hidden` 금지** — 172도 회전하면 뒷면이 되어 통째로 사라집니다. `transform-style: preserve-3d` + 안쪽 면용 그라데이션(`evFlapIn`) 교체로 처리. (`Envelope.tsx`)
4. ~~**`scrollSnapType` 복원은 `'x mandatory'`로 명시**~~ — 네이티브 스크롤 + 스냅을 쓰던 시절의 규칙입니다. **2026-09-11 무한 캐러셀로 교체하며 `useDragScroll.ts`와 함께 사라졌습니다.** 다시 네이티브 스크롤을 쓰게 되면 되살아나는 함정이니 기록만 남깁니다.
5. ~~**`touch-action: pan-x pan-y`**~~ — 네이티브 가로 스크롤을 쓰던 시절의 규칙입니다. **2026-09-11 무한 캐러셀로 교체하면서 `pan-y`가 맞게 되었습니다** — 가로 이동을 JS가 전담하므로 브라우저에는 세로만 넘깁니다. `pan-x`를 남기면 브라우저 제스처와 JS 드래그가 서로 싸웁니다. (`PhotoRail.tsx`)
6. **봉투 안 카드에 `overflow: hidden`** — `aspect-ratio`를 줘도 flex 자식의 min-content 높이가 더 크면 넘칩니다. (`Envelope.tsx`)
7. **`Reveal`의 `active` 게이트** — 봉투가 열리기 전에 본문 등장 애니메이션이 소진되지 않도록, `stage === 'out'`이 되기 전에는 IntersectionObserver 관찰 자체를 시작하지 않습니다. (`useReveal.ts`)
8. **금색 텍스트 대비** — 위 「디자인 토큰」 경고 참조.
9. **진입 연출의 `animation-fill-mode`는 반드시 `backwards`.** `forwards`/`both`로 두면 애니메이션이 끝난 뒤에도 마지막 키프레임 값이 인라인 스타일을 계속 덮어써서, 봉투 열기의 `opacity`·`transform` 전환이 아예 먹지 않습니다. `backwards`는 지연 구간에만 첫 키프레임을 적용하고 종료 후에는 원래 스타일로 돌아갑니다 — 마지막 키프레임을 자연 상태와 같게 맞춰두었으므로 튐이 없습니다. (`index.css`, `theme/tokens.ts`의 `MOTION.enter`)

### 프로토타입 → 정식 앱 변환

| 프로토타입 (`FE-legacy/final/`) | 정식 앱 (`FE/src/`) |
|---|---|
| `window.GRAD` 전역 객체 | `data/graduation.ts` named export + `data/types.ts` 타입 |
| UMD React + Babel `.compiled.js` | Vite 번들 (CDN·Babel standalone 제거) |
| `window.__resources.waxSeal` | `/seal/wax-seal.png` (public) |
| 507줄 단일 JSX | 섹션 6 + 공용 8 파일 |
| `const E = {...}` / `EF` | `theme/tokens.ts`의 `EV` / `FF` |
| `videos[]` + `curV` state | 통합본 1개로 확정 → `video` 단일 객체 |
| `photos[]` (독립 사진 섹션) | 제거 — `journey[].photos`에 흡수 |

---

## 디자인 아카이브 (`FE-legacy/`)

Claude Design에서 작업한 핸드오프 번들 원본을 그대로 보존한 폴더입니다. 시안 선정은 3단계로 진행되었습니다.

| 단계 | 탐색 | 결과 |
|---|---|---|
| 1차 · 비주얼 스킨 | A 졸업장 / B 시상식 / C 애니버서리 | 스킨만으로는 결정 불가 → 전개 방식을 분리해 탐색 |
| 2차 · 전개 방식 | N1 스토리 / N2 허브 / **N3 봉투** / N4 책 | **N3 채택** — 초대장이라는 물건의 은유가 그대로 인터랙션이 됨 |
| 3차 · 모션 강화 | N5 시네마틱 / N6 캐릭터 / N7 흑백 | 셋 다 연출이 정보를 밀어냄 → N3로 회귀, 오프닝 연출에만 집중 |

- 구현 기준 스펙: [`FE-legacy/README.md`](./FE-legacy/README.md)
- 판단 과정: [`FE-legacy/DESIGN_PROCESS.md`](./FE-legacy/DESIGN_PROCESS.md)
- 프로토타입 실행: `cd FE-legacy/final && npx serve` → `grad-n3-envelope.html`

> ⚠️ `FE-legacy/screenshots/final/`의 `02`~`07`은 캡처 시 스크롤이 걸리지 않아 **전부 표지 화면**입니다. 섹션별 실제 화면은 `npm run dev`로 확인하세요.

---

## 남은 과제

- [x] ~~졸업 일시·장소 반영~~ — 2026-09-20 (주) 오후예배 14:30 · 다윗성전
- [x] ~~Vercel 프로젝트 연결 · 프로덕션 배포~~ — 2026-09-07
- [x] ~~졸업생 실명 명단 반영~~ — 128명, 2026-09-11
- [x] 졸업 예배 감사 통합본 (§03) 공개 URL 업로드 — 2026-09-22 Vercel Blob 경량본 배포
- [ ] 추가 졸업 예배 사진 수령 후 `02.jpg`부터 배치
- [x] 간증 영상 10편 전부 수령·원본 정리 — 2026-09-25 새 수령본 기준, 이전 4편 보존
- [x] 2026-09-25 새 간증 10편의 재생본 변환·공개 URL 등록·교체 — 2026-09-26
- [x] 졸업 간증 영상 공개 URL 업로드 — 2026-09-22 수령한 02·08·09·10의 Vercel Blob 경량본 배포
- [x] 작은 화면에서는 경량본, 전체화면에서는 고화질본으로 재생 위치를 유지하며 전환 — 2026-09-26 구현
- [x] ~~카카오 공유용 `thumbnail.png` 제작~~ — 1200×630, 2026-09-11
- [x] ~~`VITE_KAKAO_JS_KEY` 발급 + 도메인 등록~~ — 2026-09-11 완료
- [ ] `public/icons/kakaotalk.png` (20×20 이상) — 없으면 인라인 SVG 말풍선으로 폴백
- [ ] 폰트 자체 호스팅 + 서브셋 (Google Fonts 의존 제거)
- [ ] 어워드(시상) 섹션 — 디자인 1단계에서 보류된 후속 과제

---

## 크레딧

- 기획 · 자료 — **하나로교회 아멘 제자 17기**
- 디자인 & 개발 — **HONEYWATER** ([@HoneyWater8](https://github.com/HoneyWater8))

형식의 출발점이 된 이전 작업: [2026 하나로 가족 한마당 초대장](https://github.com/HoneyWater8/2026_hanaro_family_festival)
