# Handoff: 아멘 제자 17기 졸업 초대장 (Amen 17th Graduation Invitation)

## Overview

하나로교회 「아멘 제자 17기」 졸업을 축하하고 알리는 **모바일 웹 초대장**입니다.
교우들에게 카카오톡 등으로 링크를 공유해 열람하게 하는 것이 목적이며, 데스크톱보다 **모바일 세로 화면이 기본 환경**입니다.

핵심 컨셉은 **봉투 개봉(Envelope Reveal)** — 화면을 누르면 왁스 씰이 붙은 봉투의 플랩이 젖혀지고 초대장이 위로 빠져나오며, 그 아래 졸업장 톤의 세로 스크롤 본문이 드러납니다.

> 📄 이 디자인이 나오기까지의 판단 과정은 **[DESIGN_PROCESS.md](./DESIGN_PROCESS.md)** 에 별도로 정리했습니다.
> 📸 화면 캡처는 `screenshots/` 에 있습니다.

---

## About the Design Files

이 번들에 들어 있는 HTML/JSX 파일들은 **디자인 레퍼런스(프로토타입)** 입니다. 의도한 외형과 동작을 보여주기 위해 HTML + React(UMD, 빌드 없이 브라우저에서 Babel 변환)로 만든 것이며, **그대로 프로덕션에 복사해 쓰라고 만든 코드가 아닙니다.**

목표는 이 디자인을 **대상 코드베이스의 기존 환경(React / Next.js / Vue / SwiftUI 등)에서 그 환경의 관례와 라이브러리로 재구현**하는 것입니다. 아직 코드베이스가 없다면, 프로젝트에 가장 적합한 프레임워크를 선택해 구현하면 됩니다.

권장 스택 예시 (신규 구축 시): **Next.js(App Router) + TypeScript + CSS Modules 또는 Tailwind**. 정적 배포가 목표라면 Vite + React도 충분합니다.

---

## Fidelity

**High-fidelity (hifi)** 입니다.

색상·타이포·간격·애니메이션 타이밍이 모두 확정된 값입니다. 아래 「Design Tokens」와 「Screens」의 수치를 그대로 재현해 주세요.

단, **콘텐츠는 placeholder** 입니다:
- 졸업생 명단 120명 → 전부 `김○○` 형태의 더미
- 사진 30장 → 번호 태그(`01`~`30`)만 있는 빈 슬롯
- 영상 → 재생 아이콘만 있는 빈 박스

실제 데이터가 확정되면 `grad-data.js` 한 파일만 교체하면 되도록 설계되어 있습니다.

---

## Screens / Views

전체는 **하나의 페이지**이며, 두 개의 레이어로 구성됩니다.

```
┌─ EnvelopeApp (root, max-width 460px, height 100dvh) ─┐
│                                                       │
│  [Layer 2] EvEnvelope   — 봉투 오버레이 (z-index 20)   │
│            stage: closed → opening → out              │
│                                                       │
│  [Layer 1] EvContent    — 졸업장 본문 (z-index 10)     │
│            5개 섹션 세로 스크롤                          │
└───────────────────────────────────────────────────────┘
```

`stage === 'out'` 이 되면 봉투 레이어가 `opacity 0` + `pointer-events: none` 이 되어 본문만 남습니다.

---

### 0. Envelope Overlay (봉투)

- **Purpose**: 진입 연출. 사용자가 화면 아무 곳이나 누르면 열립니다.
- **Layout**
  - 최상위: `position: absolute; inset: 0`, 배경 `radial-gradient(ellipse at 50% 40%, #F2EADA 0%, #E5DCC8 72%)`
  - 내부 컨텐츠 래퍼: `max-width: 320px`, `margin-top: 18%`, 가운데 정렬
  - 봉투 컨테이너: `aspect-ratio: 3 / 2`, `perspective: 900px`

- **Components**

  | 요소 | 스펙 |
  |---|---|
  | 상단 라벨 `하나로교회` | Nanum Myeongjo 700, 12px, letter-spacing 2px, `#6F5719` |
  | 안쪽 카드 | `left/right: 10%`, `top: 6%`, `aspect-ratio: 3 / 2.1`, bg `#FBF7EE`, border `1px solid rgba(30,27,22,.14)`, `box-shadow: 0 10px 28px rgba(0,0,0,.18)`, `padding: 20px 18px`, `overflow: hidden`, `z-index: 1` |
  | 카드 금박 테두리 | `inset: 7px` → `1.5px solid #A8862C` (opacity .75) / `inset: 11px` → `0.5px solid #A8862C` (opacity .5) |
  | 카드 모서리 장식 | 4개, 14×14 SVG, `inset: 9px`, path `M1 1 L1 8 M1 1 L8 1 M1 1 L6 6` (stroke 1px) + `circle cx=9 cy=9 r=1.3` |
  | 카드 내용 | `AMEN 17TH` (Cinzel Decorative 10.5px, ls 2px, `#8C2B22`) / `아멘 제자\n17기 졸업` (Nanum Myeongjo 700, 19px, lh 1.2, ls −0.5) / 왁스 씰 이미지 46px |
  | 봉투 본체 | `inset: 0`, bg `#EDE2CB`, border `1px solid #DFD0B2`, `z-index: 2`, `box-shadow: inset 0 6px 14px rgba(0,0,0,.05), 0 12px 30px rgba(0,0,0,.14)` |
  | 봉투 접힘선 | SVG 300×200 — 아래 삼각 `M0 200 L150 108 L300 200 Z` (`#DFD0B2` .55), 좌 `M0 0 L0 200 L150 108 Z` (.3), 우 대칭 (.3) |
  | 상단 플랩 | `height: 56%`, `transform-origin: top center`, SVG path `M0 0 L300 0 L150 160 Z` |
  | 왁스 씰 | 118×118px 이미지, `left/top: 50%/52%`, `translate(-50%,-50%)`, `z-index: 4` |
  | 안내 문구 | `화면을 눌러 편지를 열어보세요` — Nanum Myeongjo 700, 14px, ls 1px, `#1E1B16`, 좌측에 15px 원형 SVG 아이콘(gold), `animation: evBreathe 2.4s ease-in-out infinite` |

- **Interaction**
  - 오버레이 전체가 클릭 타깃 (`onClick={onOpen}`, `cursor: pointer`)
  - `onOpen()` → `stage = 'opening'` → 1500ms 후 `stage = 'out'`
  - 플랩: `rotateX(0deg)` → `rotateX(-172deg)`, `transition: transform .85s cubic-bezier(.5,.05,.3,1)`
    - `transform-style: preserve-3d` 필수 (`backface-visibility: hidden` 쓰면 안 됨 — 뒤집힌 뒤 사라짐)
    - `z-index`: 닫힘 3 → 열림 0, `transition: z-index 0s linear .42s` (회전 중간에 전환)
    - 그라데이션 교체: 닫힘 `evFlapSh`(위 흰색 .5 → 아래 검정 .12) / 열림 `evFlapIn`(위 검정 .14 → 아래 흰색 .35) — 봉투 안쪽 면 표현
  - 카드: `translateY(0)` → `translateY(-72%)`, `transition: transform 1.05s cubic-bezier(.22,1,.36,1) .35s`
  - 씰 · 안내문: `opacity 1 → 0`, `.3s ease`
  - 오버레이 전체: `opacity 1 → 0`, `.5s ease .55s`

---

### 1. Cover (표지)

- **Purpose**: 초대장의 첫 화면. 행사 정체성과 일시·장소를 한눈에.
- **Layout**: `EvSec pad="14px"` → 내부에 `EvFrame pad="34px 20px 30px" fill` (프레임이 섹션 전체를 채움)
- **Components** (모두 가운데 정렬)

  | 순서 | 내용 | 스펙 |
  |---|---|---|
  | 1 | `하나로교회` | Nanum Myeongjo 700, 13px, ls 2px, `#6F5719` |
  | 2 | `AMEN 17TH` | Cinzel Decorative 400, 17px, ls 3px, `#8C2B22`, margin-top 18px |
  | 3 | `아멘 제자` / `17기 졸업` | Nanum Myeongjo 700, 38px, lh 1.15, ls −1px, `#1E1B16` — `17기` 부분만 `#A8862C` |
  | 4 | `EvRule w={100}` | 구분선 |
  | 5 | 태그라인 2줄 | Nanum Myeongjo, 13.5px, lh 1.8, `#5A5348` / 둘째 줄 12px opacity .82 |
  | 6 | 왁스 씰 | 112px 이미지, margin-top 26px |
  | 7 | `09 . 20 · 오후예배 14:30 · 다윗성전` | Nanum Myeongjo, 11px, ls 1px, `#5A5348`, margin-top 18px |

---

### 2. Testimony (졸업 간증 영상)

- **Purpose**: 페이지의 중심 콘텐츠. 통합 영상 1개 재생.
- **Layout**: `EvSec bg="#F2EADA"`
- **Components**
  - 헤더: `EvHead ko="졸업 간증 영상" en="Testimony"`
  - 영상 프레임: `border: 1px solid #A8862C`, `padding: 6px`, bg `#F2EADA`
  - 영상 슬롯: `aspect-ratio: 9 / 16`, `max-height: 420px`, bg `#141210`, `data-role="video-slot"`
    - 내부: 44px 재생 아이콘 SVG (원 stroke `#D8BE72` + 삼각형 fill) / `VIDEO` (Cinzel Decorative 10px, ls 3px, `#D8BE72`) / 안내문 (11px, `rgba(255,255,255,.55)`)
- **구현 시 교체**: 이 슬롯을 실제 플레이어로. 세로 9:16 비율 유지. 자체 호스팅이 요구사항이므로 `<video>` 태그 + 자체 서버/CDN 권장.

---

### 3. Our Journey (함께 걸어온 길)

- **Purpose**: 1년간의 여정을 시기별로 보여주고, 각 시기마다 사진을 가로로 넘겨봅니다.
- **Layout**: `EvSec bg="#FBF7EE"`, 내부 `padding-left: 22px` (타임라인 축 확보)
- **Components**
  - 세로 축: `position: absolute; left: 5px; top/bottom: 6px; width: 1px`, `linear-gradient(#A8862C, #A8862C22)`
  - 각 항목 (6개):
    | 요소 | 스펙 |
    |---|---|
    | 다이아몬드 | `left: -22px; top: 15px`, 11×11px, `rotate(45deg)`, border `1px solid #8C2B22`, bg — 현재 시점(`now: true`)이면 `#8C2B22`, 아니면 `#FBF7EE` |
    | 시기 (`2025 · 봄`) | Nanum Myeongjo 700, 12px, `#8C2B22` |
    | 제목 | Nanum Myeongjo 700, 16px, `#1E1B16`, margin-top 2px |
    | 설명 | Nanum Myeongjo, 11px, lh 1.5, `#5A5348` |
    | 사진 레일 | 아래 참조 |
  - **사진 레일 (`EvPhotoRail`)** — 시기당 5장
    - 컨테이너: `display: flex; gap: 8px; margin-top: 9px; overflow-x: auto; scroll-snap-type: x mandatory; margin-right: -22px; user-select: none; touch-action: pan-x pan-y`, 스크롤바 숨김
    - 카드: `flex: 0 0 auto; width: 128px; scroll-snap-align: start`, bg `#F2EADA`, border `1px solid rgba(30,27,22,.14)`, `padding: 5px`
    - 이미지 슬롯: `aspect-ratio: 4/3`, `border: 1px dashed rgba(168,134,44,.4)`, 가운데에 번호 (Cinzel Decorative 15px, ls 1px, `#8C2B22`)
    - 캡션: Nanum Myeongjo 10px, `#5A5348`, 가운데
    - 끝에 `flex: 0 0 14px` 스페이서

- **Interaction — 가로 스크롤 3종**
  1. **터치**: 네이티브 스크롤 (`touch-action: pan-x pan-y`) — JS 개입 없음
  2. **마우스 드래그**: pointer 이벤트로 `scrollLeft` 조작. `pointerType === 'touch'`면 무시.
     - 3px 이상 움직이면 `setPointerCapture` + `scrollSnapType = 'none'`
     - `pointerup` 시 `scrollSnapType = 'x mandatory'` **로 복원** (빈 문자열 `''` 로 두면 인라인 스타일이 지워져 스냅이 영구히 꺼짐 — 실제 발생했던 버그)
     - 4px 이상 이동했으면 `click` 이벤트를 capture 단계에서 차단
  3. **Shift + 휠**: `wheel` 리스너 (`passive: false`). `e.shiftKey`이거나 `|deltaX| > |deltaY|`일 때만 `preventDefault()` 후 `scrollLeft += delta`. 양 끝에 도달하면 preventDefault 하지 않아 페이지 세로 스크롤로 넘어감.

---

### 4. Graduates (졸업생 전원)

- **Layout**: `EvSec bg="#F2EADA"` → `EvFrame pad="18px 14px"`
- **Components**
  - 이름 그리드: `grid-template-columns: repeat(4, 1fr)`, `gap: 7px 4px`
  - 각 이름: Nanum Myeongjo, 12px, ls 0.5px, `#1E1B16`, 가운데 정렬
  - 현재 120명 (placeholder)

---

### 5. Closing (맺는 말)

- **Layout**: `EvSec bg="#FBF7EE" pad="52px 22px 28px"` — flex column, 위아래 `flex: 1` 스페이서로 본문 중앙 + 푸터 바닥 고정
- **Components**
  - 헤더: `EvHead ko="맺는 말" en="Closing"`
  - 말씀 본문 5줄: Nanum Myeongjo, 14.5px, lh 2, `#1E1B16`, 가운데
    ```
    에스라가 위대하신 하나님 여호와를
    송축하매 모든 백성이 손을 들고
    아멘 아멘 하고 응답하고
    몸을 굽혀 얼굴을 땅에 대고
    여호와께 경배하니라
    ```
  - **겹낫표 배치**: 각 줄의 텍스트를 `position: relative; display: inline-block` 스팬으로 감싸고,
    - 첫 줄: `『` → `position: absolute; right: 100%; margin-right: 5px; top: 0`
    - 마지막 줄: `』` → `position: absolute; left: 100%; margin-left: 5px; top: 0`
    - 색상 `#6F5719`. 이렇게 해야 가운데 정렬에 영향을 주지 않으면서 텍스트 시작/끝에 붙습니다.
  - 출처: `느헤미야 8장 6절` — Nanum Myeongjo 700, 12.5px, ls 0.5px, `#6F5719`, margin-top 14px
  - `EvRule w={72}`
  - 푸터: `© 하나로교회 · AMEN 17TH · 2026` — Nanum Myeongjo, 11px, ls 0.5px, `#5A5348`, opacity .85

---

## Shared Components

### `EvRule({ w })` — 다이아몬드 구분선
```
[gradient line w/2] ◆ [gradient line w/2]
```
- 좌: `linear-gradient(90deg, transparent, #8C2B22)`, 우: 반대 방향, 높이 1px
- 가운데: 9×9 SVG `M4.5 0 L9 4.5 L4.5 9 L0 4.5Z`, fill `#8C2B22`
- `gap: 8px`, `margin: 16px 0`

### `EvHead({ ko, en })` — 섹션 헤더
- `en`: Cinzel Decorative 400, 14px, ls 2px, `#8C2B22`, `text-transform: uppercase`
- `ko`: Nanum Myeongjo 700, 25px, ls −0.5px, `#1E1B16`, margin-top 7px
- 아래 `EvRule w={80}`

### `EvFrame({ pad, fill })` — 금박 이중 테두리
- 외곽 `1.5px solid #A8862C` (opacity .75), 내곽 `inset: 4px`, `0.5px solid #A8862C` (opacity .5)
- 네 모서리 16px SVG 장식 (path + 점)
- `fill` prop이 true면 `flex: 1; align-self: stretch` 로 섹션 전체를 채움

### `EvSeal({ size })` — 왁스 씰
- `assets/wax-seal-sm.png` (360×300, 투명 배경)
- `object-fit: contain`

### `EvSec({ bg, pad })` — 섹션 래퍼
- `min-height: 100%`, `display: flex; flex-direction: column; justify-content: center`, `position: relative`

### `EvUp({ delay, y, active })` — 스크롤 진입 애니메이션
- IntersectionObserver (`threshold: 0.12`, `rootMargin: '0px 0px -8% 0px'`, root = `[data-scroll-root]`)
- 이미 화면 안이면 즉시 표시
- `opacity 0 → 1` (`.8s ease`), `translateY(18px) → 0` (`1s cubic-bezier(.22,1,.36,1)`)
- **`active` prop이 false면 관찰 자체를 시작하지 않음** — 봉투가 열리기 전(`stage !== 'out'`) 본문 애니메이션이 미리 소진되는 것을 막습니다.

---

## Interactions & Behavior

| 동작 | 트리거 | 결과 |
|---|---|---|
| 봉투 열기 | 오버레이 아무 곳 클릭/탭 | 플랩 회전 → 카드 상승 → 오버레이 페이드아웃 (총 ~2.0s) |
| 섹션 진입 | 스크롤로 요소가 뷰포트 진입 | `EvUp` 페이드+상승 |
| 사진 넘기기 | 터치 스와이프 / 마우스 드래그 / Shift+휠 | 가로 스크롤 + 스냅 |
| 사진 클릭 | (드래그 4px 미만일 때만) | 현재 동작 없음 — 라이트박스 확장 여지 |

**애니메이션 keyframe** (`grad-n3-envelope.html` `<style>`):
```css
@keyframes evBreathe { 0%,100% { opacity: 1 } 50% { opacity: .55 } }
```

---

## State Management

`EnvelopeApp` 하나에 상태 1개:

```js
const [stage, setStage] = useState('closed');
// 'closed'  → 봉투 닫힘, 안내 문구 표시, 본문 애니메이션 미시작
// 'opening' → 플랩 회전 + 카드 상승 (1500ms)
// 'out'     → 오버레이 제거, 본문 활성화 (active=true)
```

`EvPhotoRail`은 DOM ref + 이벤트 리스너만 사용 (React state 없음 — 60fps 드래그를 위해 의도적).

데이터 페칭 없음. 전량 정적. 실제 구현 시 명단·사진·영상 URL을 CMS나 JSON에서 불러오도록 바꿔도 무방합니다.

---

## Design Tokens

### Colors
| 토큰 | 값 | 용도 |
|---|---|---|
| `paper` | `#FBF7EE` | 기본 배경 (표지·여정·맺는말) |
| `paperDeep` | `#F2EADA` | 교차 배경 (영상·명단), 사진 카드 |
| `envel` | `#EDE2CB` | 봉투 본체 |
| `envelDk` | `#DFD0B2` | 봉투 접힘·테두리 |
| `ink` | `#1E1B16` | 본문 텍스트 |
| `inkSoft` | `#5A5348` | 보조 텍스트 |
| `gold` | `#A8862C` | 장식 전용 (테두리·구분선·점선) |
| `goldTx` | `#6F5719` | **텍스트용 금색** (대비 4.5:1 확보) |
| `goldLt` | `#D8BE72` | 어두운 배경 위 금색 (영상 슬롯) |
| `seal` | `#8C2B22` | 포인트 컬러 (씰·영문 라벨·다이아몬드·타임라인) |
| `line` | `rgba(30,27,22,0.14)` | 카드 테두리 |
| body bg | `#E5DCC8` | 460px 밖 여백 |

> ⚠️ **대비 주의**: `#A8862C`는 `#FBF7EE` 위에서 3.21:1 밖에 안 나옵니다. 24px 미만 텍스트에는 반드시 `goldTx`(`#6F5719`)를 쓰세요. `gold`는 선·테두리 등 비텍스트 요소 전용입니다.

### Typography
| 역할 | 폰트 | 사용처 |
|---|---|---|
| 본문 (`EF.serif`, `EF.sans`) | **Nanum Myeongjo** 400 / 700 / 800 | 한글 전체, 기본 body |
| 포인트 (`EF.latin`) | **Cinzel Decorative** 400 / 700 / 900 | 영문·숫자 전용 (`AMEN 17TH`, 섹션 en 라벨, 사진 번호, `VIDEO`) |

```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Nanum+Myeongjo:wght@400;700;800&display=swap" rel="stylesheet">
```

> ⚠️ **Cinzel Decorative는 한글 글리프가 없습니다.** 한글이 섞인 문자열(`하나로교회`, `2025 · 봄`, 푸터 등)에 `EF.latin`을 쓰면 한 줄 안에서 서체가 갈라집니다. 순수 라틴·숫자에만 적용하세요.

**타이포 스케일** (모두 px)
```
38  표지 메인 타이틀 (700, lh 1.15, ls -1)
25  섹션 헤더 ko (700, ls -0.5)
19  봉투 카드 타이틀 (700, lh 1.2)
17  표지 AMEN 17TH (Cinzel, ls 3)
16  타임라인 항목 제목 (700)
14.5 맺는 말 본문 (lh 2)
14  섹션 헤더 en (Cinzel, ls 2)
13.5 표지 태그라인 (lh 1.8)
13  안내 문구 / 표지 org (700)
12.5 출처 (700, ls 0.5)
12  타임라인 시기 (700) / 명단 이름 / 봉투 org
11  푸터 / 타임라인 설명
10.5 봉투 카드 AMEN 17TH (Cinzel, ls 2)
10  사진 캡션 / VIDEO 라벨
```

### Spacing
```
섹션 패딩     : 52px 22px  (표지만 14px, 맺는말 52px 22px 28px)
프레임 패딩   : 34px 20px 30px (표지) / 18px 14px (명단)
카드 간격     : 8px  (사진 레일)
그리드 간격   : 7px 4px (명단)
구분선 여백   : 16px 0
```

### Radius / Shadow / Border
```
radius        : 0  (전부 각진 사각형 — 졸업장 톤)
카드 그림자    : 0 10px 28px rgba(0,0,0,.18)   (봉투 안 카드)
봉투 그림자    : inset 0 6px 14px rgba(0,0,0,.05), 0 12px 30px rgba(0,0,0,.14)
루트 그림자    : 0 0 60px rgba(0,0,0,.16)
기본 테두리    : 1px solid rgba(30,27,22,.14)
금박 테두리    : 1.5px solid #A8862C (.75) + 0.5px solid #A8862C (.5)
점선 슬롯     : 1px dashed rgba(168,134,44,.4)
```

### Motion
```
봉투 플랩     : .85s cubic-bezier(.5,.05,.3,1)
카드 상승     : 1.05s cubic-bezier(.22,1,.36,1), delay .35s
오버레이 페이드 : .5s ease, delay .55s
진입 애니메이션 : opacity .8s ease / transform 1s cubic-bezier(.22,1,.36,1)
호흡 애니메이션 : evBreathe 2.4s ease-in-out infinite
```

### Layout
```
루트 최대 너비 : 460px (가운데 정렬)
높이          : 100dvh (모바일 주소창 대응 — vh 아님)
스크롤        : 루트 내부 [data-scroll-root] 요소가 담당 (body는 overflow hidden)
스크롤바      : 숨김 (.gs-scroll)
```

---

## Assets

| 파일 | 크기 | 설명 |
|---|---|---|
| `final/assets/wax-seal-sm.png` | 360×300, 73KB, 투명 배경 | 왁스 씰. 사용자 제공 원본(670×559, 222KB)을 퍼블리시 용량 문제로 축소한 버전 |

**아직 없는 에셋** (전부 placeholder):
- 여정 사진 30장 (시기 6개 × 5장) — 4:3 비율 권장
- 졸업 간증 영상 1개 — 9:16 세로, 자체 호스팅
- 실제 졸업생 명단

**폰트**: Google Fonts (Nanum Myeongjo, Cinzel Decorative) — 자체 호스팅 시 서브셋 권장. Nanum Myeongjo 한글 전체 서브셋은 수 MB에 달합니다.

---

## Files

### `screenshots/` — 화면 캡처

| 폴더 | 내용 |
|---|---|
| `final/` | 최종안 8장 — 봉투 닫힘/열리는 중/열림 → 표지 · 영상 · 여정 · 명단 · 맺는말 |
| `explorations/` | 시안 9장 + 폰트 비교 1장 |

### `final/` — 채택된 최종 디자인
| 파일 | 설명 |
|---|---|
| `grad-n3-envelope.html` | 진입점. 폰트 링크, 전역 CSS, keyframe, 번들러용 thumbnail/meta |
| `grad-n3-envelope-app.jsx` | **주 소스**. 전체 UI 컴포넌트 (507줄) |
| `grad-n3-envelope-app.compiled.js` | 위 파일의 Babel 변환 결과 (브라우저 직접 실행용, 편집 금지) |
| `grad-data.js` | **모든 콘텐츠**. `window.GRAD`에 담김. 실제 데이터 교체는 이 파일만 수정 |
| `assets/wax-seal-sm.png` | 왁스 씰 이미지 |

> 로컬 확인: `final/` 폴더에서 정적 서버를 띄우고 `grad-n3-envelope.html`을 여세요 (`npx serve` 등). `file://` 로는 폰트/이미지가 막힐 수 있습니다.

### `explorations/` — 채택되지 않은 시안 (참고용)

시안 선정 과정에서 만든 것들입니다. 최종안의 맥락을 이해하거나, 향후 다른 연출이 필요할 때 참고하세요.

**1차 — 스킨 탐색 (컨셉 3종)**
| 파일 | 컨셉 |
|---|---|
| `grad-a-diploma.*` | 졸업장 — 종이·금박·왁스씰 (→ **최종안의 시각 언어가 여기서 나옴**) |
| `grad-b-awards.*` | 시상식 — 다크·골드·스포트라이트 |
| `grad-c-anniv.*` | 애니버서리 — 딥블루·오나먼트·회전 엠블럼 |

**2차 — 전개 방식 탐색 (4종)**
| 파일 | 방식 |
|---|---|
| `grad-n1-story.*` | 스토리형 — 상단 진행바 + 탭 이동 + 자동 진행 (반려) |
| `grad-n2-hub.*` | 허브형 — 중앙 엠블럼 + 하단 메뉴 → 패널 오버레이 |
| `grad-n4-book.*` | 책 펼침 — 8페이지 플립 + 좌우 스와이프 |
| **`grad-n3-envelope.*`** | **봉투 개봉 → 채택** |

**3차 — 애니메이션 강화 탐색**
| 파일 | 방식 |
|---|---|
| `grad-n5-motion.*` | 시네마틱 모션 — 스크롤이 곧 타임라인, 장면별 pin + 스크럽 |
| `grad-n6-character.*` | 캐릭터 횡스크롤 — 캐릭터 고정, 배경이 흘러가는 사이드스크롤 |
| `grad-n7-mono.*` | 흑백 서사시 — 손 스냅 프레임 시퀀스 + 라인아트 |

**기타**
| 파일 | 설명 |
|---|---|
| `font-candidates.html` | 포인트 폰트 후보 비교 페이지 (Cinzel Decorative 선정) |

---

## Implementation Notes

구현 중 마주칠 수 있는 함정들 — 프로토타입에서 실제로 겪은 것들입니다.

1. **`100dvh` 사용.** `100vh`는 모바일 주소창 높이를 포함해 하단이 잘리거나 배경 띠가 보입니다.
2. **body 배경을 첫 섹션 색과 맞추기.** 스크롤 바운스 시 다른 색이 노출됩니다.
3. **플랩에 `backface-visibility: hidden` 금지.** 172도 회전하면 뒷면이 되어 통째로 사라집니다. `transform-style: preserve-3d`를 쓰세요.
4. **`scrollSnapType` 복원은 원래 값으로.** 인라인 스타일로만 지정된 값을 `''`로 지우면 fallback CSS가 없어 `none`이 됩니다.
5. **`touch-action`으로 가로 터치 스크롤을 막지 말 것.** `pan-y`만 주면 네이티브 가로 스크롤이 죽습니다. `pan-x pan-y`를 쓰고 JS 드래그는 마우스 전용으로 분리하세요.
6. **봉투 안 카드가 콘텐츠 때문에 늘어남.** `aspect-ratio`를 줘도 flex 자식들의 min-content 높이가 더 크면 넘칩니다. `overflow: hidden` + 콘텐츠 크기 조절 둘 다 필요합니다.
7. **`EvUp`의 `active` 게이트.** 봉투가 열리기 전에 본문 애니메이션이 소진되지 않도록 반드시 유지하세요.
8. **금색 텍스트 대비.** 위 「Design Tokens」의 경고 참조.
