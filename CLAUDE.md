# CLAUDE.md

하나로교회 **아멘 제자 17기** 졸업 모바일 페이지. 봉투를 눌러 열면 졸업장 톤의 세로 스크롤 본문이 드러나는 단일 페이지 정적 웹앱.

전체 개요는 [README.md](./README.md), 발주 배경·요구사항은 [docs/requirements.md](./docs/requirements.md).

## 구조

| 경로 | 내용 |
|---|---|
| `FE/` | Vite 8 + React 19 + TS 6. 런타임 의존성 3개(`react`/`react-dom`/`@vercel/analytics`). **서버·API 없음** |
| `FE-legacy/` | Claude Design 핸드오프 원본. **구현 기준 스펙은 `FE-legacy/README.md`** |
| `docs/` | 요구사항 · 작업로그 · 메모리 |

## 코드 컨벤션

- 스타일은 **전부 인라인 `style={{}}`**. `src/index.css`는 리셋 · `@keyframes` · `.no-scrollbar`만 담당
- 색·폰트는 반드시 `src/theme/tokens.ts`의 `EV` / `FF` 경유. 하드코딩 금지
- 콘텐츠 문자열은 전부 `src/data/graduation.ts` 한 파일. 컴포넌트에 직접 박지 말 것
- 컴포넌트는 named export(`export function Cover()`), 섹션 1개 = 파일 1개
- 파일 헤더는 `/* ───── 제목 ───── */` 박스 주석. 주석은 한국어로 **"왜"**를 설명
- 타입은 `type` 선언 + `import type` (`verbatimModuleSyntax: true`)

## 되돌리면 안 되는 것

README 「구현 노트」의 함정 8건은 전부 프로토타입에서 실제로 겪은 버그의 대응이며 코드에 주석으로 표시되어 있습니다. 리팩터링 시 특히:

- `100dvh` 사용 (`100vh` 아님) · body 배경은 `EV.backdrop`
- 봉투 플랩에 `backface-visibility: hidden` 금지 → `transform-style: preserve-3d`
- 캐러셀 한 사이클은 `카드수 × stride`로 계산 (`scrollWidth/2`를 쓰면 padding이 끼어들어 매 바퀴 어긋남)
- 무한 캐러셀은 `touch-action: pan-y` (가로는 JS가 전담)
- `Reveal`의 `active` 게이트 (봉투 열리기 전 본문 애니메이션 소진 방지)
- `EV.gold`는 24px 미만 텍스트 금지 → `EV.goldTx` / `FF.latin`에 한글 금지

## 검증

```sh
cd FE && npm run build && npm run lint
```

## 작업로그 · 메모리

이 프로젝트는 작업로그와 메모리를 **레포 안에서** 관리합니다. 홈 디렉터리(`~/.claude/projects/.../memory/`)가 아니라 아래 경로에 쓰세요.

- **작업로그** — `docs/worklog/`. 의미 있는 작업 단위가 끝날 때마다 파일 추가 + 인덱스 갱신. 규칙은 [docs/worklog/README.md](./docs/worklog/README.md)
- **메모리** — `docs/memory/`. 규칙은 [docs/memory/MEMORY.md](./docs/memory/MEMORY.md)

@docs/memory/MEMORY.md
