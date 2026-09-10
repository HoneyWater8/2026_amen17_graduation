# 2026-09-11 · 사용자 집계 도입 (Vercel Web Analytics + GA4)

> 참고 레포에서 페이지뷰·UV를 아예 수집하지 못한 것이 아쉬웠던 지점. 이번에는 행사 9일 전에 미리 붙였다.

## 한 일

| 파일 | 내용 |
|---|---|
| `utils/analytics.ts` | GA4 로더 + `track()` (신규) |
| `main.tsx` | `initAnalytics()` 호출 |
| `App.tsx` | `<Analytics />` (Vercel) + `envelope_open` |
| `common/Section.tsx` | `section_view` — 섹션 도달 |
| `common/VideoSlot.tsx` | `video_play` |
| `common/PhotoRail.tsx` | `photo_open` |
| `common/ShareFAB.tsx` | `share_open` · `share_kakao` · `share_native` · `share_copy` |
| `.env.example` · `README.md` · `CLAUDE.md` | `VITE_GA_ID` 안내, 의존성 3개로 갱신 |

## 판단한 것

**1. 두 도구를 함께 쓴 이유 — Hobby 플랜의 두 한계**

Vercel Web Analytics 하나로 끝내고 싶었지만 Hobby 플랜에는 두 제약이 있습니다.

| | Hobby | Pro |
|---|---|---|
| 포함 이벤트 | 50,000/월 | 사용량 과금 |
| 리포팅 윈도우 | **1개월** | 12개월 |
| 커스텀 이벤트 | **불가** | 가능 |

이벤트 한도는 넉넉합니다(전 교인 규모면 5만은 한참 남음). 문제는 나머지 둘입니다. "봉투를 열었나 / 영상을 봤나 / 어디까지 봤나"는 커스텀 이벤트가 있어야 하고, 행사 후 한 달 지나면 데이터가 사라집니다.

Pro 트라이얼(14일)로 해결할 수도 있었지만 트라이얼 종료 후 그 기간 이벤트에 과금되고 플랜을 올렸다 내려야 합니다. **GA4는 무료에 14개월 보존**이라, 역할을 나누는 편이 깔끔했습니다.

- **Vercel** — 방문자·페이지뷰·유입 경로·기기. 쿠키 없음, 컴포넌트 하나
- **GA4** — 행동 추적 + 긴 보존

**2. `VITE_GA_ID`가 없으면 GA를 아예 로드하지 않음**

측정 ID를 받기 전에도 페이지가 그대로 동작해야 합니다. `initAnalytics()`가 ID를 먼저 확인하고, 없으면 스크립트 태그조차 만들지 않습니다.

빌드 결과를 확인해보니 ID가 없을 때는 **Vite가 죽은 코드로 판단해 GA 관련 코드를 통째로 제거**합니다(`googletagmanager` 문자열 0개). ID를 넣고 빌드하면 살아납니다(1개, 실제 ID 주입 확인). 의도한 대로입니다 — ID 없는 배포에는 GA 코드가 아예 실리지 않습니다.

**3. `section_view`를 `Section` 컴포넌트에 넣은 것**

스크롤 깊이를 섹션 단위로 잡는 게 목적인데, 각 섹션 파일에 따로 넣으면 5곳에 같은 코드가 생깁니다. `Section`이 이미 `label`(`01 Cover` 등)을 받고 있어서 여기에 IntersectionObserver 하나만 두면 전부 커버됩니다.

`threshold: 0.4`로 잡아 살짝 스쳐 지나간 것은 세지 않고, `track(..., once=true)`로 스크롤을 왕복해도 한 번만 발사합니다.

**4. 공유 경로를 나눠서 집계**

`share_kakao`(SDK)와 `share_native`(폴백)를 구분했습니다. 카카오 SDK가 실제로 얼마나 쓰이는지, 폴백으로 새는 경우가 있는지 봐야 다음에 판단할 수 있습니다. 참고 레포는 카카오 콘솔 통계에만 의존해 이 구분이 없었습니다.

## 확인한 것

| 항목 | 결과 |
|---|---|
| `npm run build` / `npm run lint` | ✅ 통과 |
| GA ID 없을 때 | ✅ 번들에 GA 코드 없음 |
| GA ID 있을 때 (테스트 빌드) | ✅ 스크립트 + ID 주입 확인 |
| 번들 크기 | 224KB → **228KB** (gzip 70.4 → 71.6KB) |
| 실제 수집 | ❌ **미확인** — 아래 두 가지가 남아 있습니다 |

## 남긴 것

**두 가지가 사용자 손에 남아 있습니다.**

1. **Vercel Web Analytics 활성화** — CLI에 `vercel project web-analytics enable`이 있지만 요금 고지 확인이 필요해 비대화형으로는 거부됩니다. 터미널에서 직접 실행해야 합니다.
2. **GA4 측정 ID 발급** — `VITE_GA_ID`로 Vercel 환경 변수에 등록. 없으면 Vercel 집계만 동작합니다.

**⚠️ 2026년 10월 중순 전에 Vercel 대시보드를 캡처해야 합니다.** Hobby는 보존이 1개월이라, 행사(9/20) 후 한 달이 지나면 데이터를 볼 수 없습니다. 참고 레포처럼 통계를 문서로 남기실 거라면 이 기한을 넘기지 마세요. README에도 적어뒀습니다.

**커밋하지 않았습니다** ([[ask-before-commit-push]]).
