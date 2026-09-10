# 아멘 제자 17기 졸업 · 모바일 졸업장

> 하나로교회 **아멘 제자 17기**의 졸업을 축하하고 알리는 모바일 웹 페이지.

- 🎓 **일시** — **2026.09.20 (주) 오후예배 14:30**
- 📍 **장소** — 하나로교회 **다윗성전**
- 🌐 **배포** — https://2026amen17graduation.vercel.app *(2026-09-07 프로덕션 배포 · 상시 공개)*

봉투를 눌러 열면 졸업장 톤의 세로 스크롤 본문이 드러나는 단일 페이지. 카카오톡으로 링크를 공유해 전 교인이 열람하는 것이 목적이며, **모바일 세로 화면이 기본 환경**입니다.

이 페이지의 중심 콘텐츠는 **함께 졸업하지 못한 네 지체**(군 복무 2 · 유학 부부 1 · 온라인 예배 1)가 보내온 영상을 하나로 엮은 졸업 간증 영상입니다. 자세한 배경은 [`docs/requirements.md`](./docs/requirements.md) 참고.

---

## 현재 상태

**구조 스캐폴딩 + 디자인 구현 완료. 실제 콘텐츠 대기 중.**

디자인은 hifi(색·타이포·간격·모션 타이밍 확정)로 확정되어 그대로 구현되어 있으나, 명단·사진·영상·날짜는 전부 placeholder입니다. 자료가 확정되면 [`FE/src/data/graduation.ts`](./FE/src/data/graduation.ts) 한 파일 교체로 반영됩니다.

| 항목 | 상태 |
|---|---|
| 봉투 개봉 연출 | ✅ 구현 |
| 5개 섹션 레이아웃 · 모션 | ✅ 구현 |
| 사진 캐러셀 (터치/드래그/Shift+휠) | ✅ 구현 |
| 졸업 일시 · 장소 | ✅ 2026-09-20 (주) 오후예배 14:30 · 다윗성전 |
| 졸업생 명단 120명 | ⏳ placeholder (`김○○`) |
| 여정 사진 | ✅ 59장 배치 (입학식 23 · 하나로가족한마당 19 · 식사 모임 17)<br>⏳ **제자 수업만 placeholder** — 원본 미수령 |
| 졸업식 영상 | ⏳ placeholder — 제자들이 목사님께 전하는 한마디 |
| 졸업 간증 영상 | ⏳ placeholder 슬롯 |
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

런타임 의존성은 `react`, `react-dom` 두 개뿐입니다. 라우터·상태관리·CSS 프레임워크 없이 인라인 스타일과 로컬 state로 처리합니다. API·서버 상태가 없어 서버리스 함수도 두지 않았습니다.

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
| — | **Envelope** | **진입**: 라벨 → 봉투 → 안내 문구 순으로 도착 (~1.55s)<br>**열기**: 화면 아무 곳이나 탭 → 플랩 `rotateX(-172°)` → 안쪽 카드 `-72%` 상승 → 오버레이 페이드아웃 (~2.0s) |
| 01 | **Cover** | 금박 이중 프레임, `AMEN 17TH`, 대형 타이틀, 왁스 씰, 일시·장소 한 줄<br>하단에 스크롤 힌트 — 한 번이라도 스크롤하면 영구히 사라짐 |
| 02 | **Testimony** | 16:9 가로 영상. URL이 없거나 로드 실패 시 placeholder 슬롯으로 폴백 |
| 03 | **Our Journey** | 5개 시기 세로 타임라인<br>입학식 → 제자 수업 → 하나로가족한마당 → 식사 모임 → **졸업식**<br>앞 4개는 **무한 가로 캐러셀**(마운트 시 셔플 · 자동 흐름 · 드래그 관성 · 탭하면 라이트박스), 졸업식은 **영상 슬롯** |
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
│   │   ├── video/                      # 자체 호스팅 영상 — 대기 (git 제외)
│   │   └── icons/                      # 카카오 공유용 thumbnail — 대기
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

### 최초 1회 — 프로젝트 연결

```sh
cd FE
npx vercel login          # 브라우저 인증 (직접 실행 필요)
npx vercel                # 프로젝트 생성 + 연결. Root Directory를 FE로 잡아줌
```

`FE/.vercel/project.json`이 생성되며 이 폴더는 **커밋하지 않습니다** (`.gitignore` 처리됨).

### 이후 배포 — Git 자동 배포

`HoneyWater8/2026_amen17_graduation` 레포가 연결되어 있어 **`main`에 push하면 자동으로 프로덕션 배포**됩니다.

```sh
git push origin main      # → Vercel이 자동 빌드·배포
```

CLI로 직접 배포할 수도 있습니다.

```sh
cd FE
npx vercel                # 프리뷰 배포
npx vercel --prod         # 프로덕션 배포
```

> ⚠️ **Root Directory는 반드시 `FE`여야 합니다.** CLI 배포는 `FE/`를 통째로 올려서 `.`이어도 동작하지만, Git 빌드는 레포 루트에서 `package.json`을 찾기 때문에 `.`이면 실패합니다.

### 환경 변수

필수 환경 변수는 **없습니다.** 둘 다 없어도 페이지는 정상 동작하며, 준비되는 대로 등록하면 됩니다 (자세한 내용은 `FE/.env.example`).

| 변수 | 용도 | 없을 때 |
|---|---|---|
| `VITE_TESTIMONY_VIDEO_URL` | 졸업 간증 영상 (§02) | placeholder 슬롯 표시 |
| `VITE_GRADUATION_VIDEO_URL` | 졸업식 영상 (§03 여정 마지막) | placeholder 슬롯 표시 |
| `VITE_KAKAO_JS_KEY` | 카카오톡 공유 | `navigator.share`(네이티브 공유 시트)로 폴백 |

> `VITE_KAKAO_JS_KEY`는 카카오 개발자 콘솔의 **JavaScript 키**이며, 앱 설정 → 플랫폼 → Web → 사이트 도메인에 `https://2026amen17graduation.vercel.app`을 **등록해야** 동작합니다.

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
- ❌ **`public/icons/thumbnail.png`(800×800)가 아직 없습니다** — `/icons/thumbnail.png` 요청이 404입니다. 카카오톡 공유 카드에 이미지가 뜨지 않습니다.

### 운영 정책

**자동 만료 없이 상시 공개합니다.** 열람 기한 기능은 구현하지 않기로 했으며, 내릴 때는 Vercel 대시보드에서 배포를 제거하거나 프로젝트를 삭제합니다.

---

## 콘텐츠 교체 방법

모든 콘텐츠는 [`FE/src/data/graduation.ts`](./FE/src/data/graduation.ts) 한 파일에 모여 있습니다.

**졸업 일자·장소** — `when` / `where` 값 교체.

**졸업생 명단** — `roster` 배열을 실제 성함으로 교체. 4열 그리드라 개수 제한은 없습니다.

**여정 사진** — 원본을 그대로 쓰지 않고 두 벌로 줄여서 넣습니다 (캐러셀 썸네일 320w · 라이트박스 1280w).

```sh
# 1) 원본 폴더를 레포 루트에 두고 scripts/resize-photos.py 의 FOLDERS 에 등록
#    '제자수업': 'class'
# 2) 실행 — FE/public/journey/<slug>/{thumb,full}/NN.jpg 로 생성됨
pip install pillow
python scripts/resize-photos.py
```

그다음 `graduation.ts`에서 장수만 바꿉니다. 파일명은 규칙으로 생성되므로 나열할 필요가 없습니다.

```ts
photos: photosOf("class", 12, "제자 수업")   // placeholderPhotos(...) 를 교체
```

첫 수령분 59장은 **95MB → 11.6MB**로 줄었습니다. 원본 폴더는 `.gitignore` 처리되어 커밋되지 않습니다.

```ts
{ caption: "개강 첫날", tag: "01", image: "/journey/01.jpg" }
```

**졸업 간증 영상** — 두 가지 방식 중 선택 (자세한 절차는 `FE/.env.example`):

| 방식 | 방법 | 적합한 경우 |
|---|---|---|
| 저장소 직접 배치 | `FE/public/video/testimony.mp4` | 용량이 작을 때 |
| **Vercel Blob** | `vercel blob put` 후 `VITE_*_VIDEO_URL`에 URL 지정 | 수 분짜리 세로 영상 등 용량이 클 때 (권장) |

둘 다 없으면 재생 아이콘 placeholder가 표시됩니다.

---

## 디자인 토큰 (`FE/src/theme/tokens.ts`)

```ts
EV.paper     = '#FBF7EE'   // 기본 배경 (표지·여정·맺는 말)
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
- [ ] 졸업생 실명 명단 반영
- [ ] 제자 수업 사진 수령 후 배치 (현재 유일한 placeholder 시기)
- [ ] 졸업식 영상 (§03) 업로드 — 졸업식 당일 이후
- [ ] 졸업 간증 영상 업로드 및 연결
- [ ] 카카오 공유용 `thumbnail.png` (800×800) 제작 — **현재 404, 공유 카드 이미지 없음**
- [ ] `VITE_KAKAO_JS_KEY` 발급 + 도메인 등록 — 없으면 네이티브 공유로 폴백
- [ ] `public/icons/kakaotalk.png` (20×20 이상) — 없으면 인라인 SVG 말풍선으로 폴백
- [ ] 폰트 자체 호스팅 + 서브셋 (Google Fonts 의존 제거)
- [ ] 어워드(시상) 섹션 — 디자인 1단계에서 보류된 후속 과제

---

## 크레딧

- 기획 · 자료 — **하나로교회 아멘 제자 17기**
- 디자인 & 개발 — **HONEYWATER** ([@HoneyWater8](https://github.com/HoneyWater8))

형식의 출발점이 된 이전 작업: [2026 하나로 가족 한마당 초대장](https://github.com/HoneyWater8/2026_hanaro_family_festival)
