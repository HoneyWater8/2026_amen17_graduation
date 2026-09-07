# 2026-09-07 · 프로젝트 구조 수립 · 디자인 핸드오프 코드 배치

> 빈 레포에 2026 하나로 가족 한마당 레포의 구조를 미러링하고, Claude Design 핸드오프 번들(zip)을 정식 React 앱으로 변환해 배치.

## 한 일

**조사** — 참고 레포(`C:\dev\2026_hanaro_family_festival`)의 폴더 구조·코드 컨벤션·git 히스토리 17커밋, 핸드오프 zip 44개 파일, 발주 통화 녹음을 전부 확인.

**배치**

- `FE-legacy/` — zip 전체를 압축 해제해 원본 그대로 보존. zip 삭제
- `FE/` — Vite 8 + React 19 + TS 6 스캐폴딩. 참고 레포의 `package.json` · `tsconfig*` · `eslint.config.js` · `.gitignore`를 기준으로 삼되 불필요한 의존성 제거
- `FE/src/` — 프로토타입 507줄 단일 JSX를 섹션 6 + 공용 8 파일로 분해
- `docs/requirements.md` — 통화 녹음에서 요구사항 도출
- `README.md` — 프로젝트 문서

## 판단한 것

**1. 폴더 구조 — 참고 레포 4블록을 그대로 미러링**

`FE/` + `FE-legacy/` + `docs/` + 루트 `README.md`. 핸드오프 번들이 갈 자리로 `design/`이나 `docs/design-handoff/`도 후보였지만, 참고 레포에서 `FE-legacy/`가 정확히 같은 역할(개발 전 디자인 탐색 단계 아카이브)을 하고 있어 이름까지 맞췄습니다.

**2. 스택 — Next.js 대신 Vite + React**

핸드오프 문서는 신규 구축 시 Next.js App Router를 권했지만, ① 정적 단일 페이지라 SSR·라우팅이 필요 없고 ② 참고 레포 미러링이 이번 작업의 전제였습니다. 사용자 확인 후 확정.

**3. API 없음**

참고 레포에는 `FE/api/cheer.ts`(Redis 응원 카운터)가 있었으나 이번엔 서버 상태가 없습니다. 통화에서 언급된 "열람 기한"도 서버가 필요할 수 있어 물어봤고, "페이지만 잘 표시되면 된다"는 답을 받아 `api/` 디렉터리 자체를 만들지 않았습니다.

**4. 영상 소스 — 환경변수 우선 + 자동 폴백**

자체 호스팅이 요구사항인데 4분짜리 세로 영상은 저장소에 넣기 부담스럽습니다. `VITE_VIDEO_URL`(Vercel Blob) → `public/video/testimony.mp4` → placeholder 순으로 폴백하게 만들어, **코드 수정 없이 두 방식을 전환**할 수 있게 했습니다. 재생 실패는 `onError`로 잡아 placeholder로 되돌립니다.

**5. 데이터 스키마 — 프로토타입에서 실제로 쓰이는 것만**

`grad-data.js`의 `photos`(독립 사진 섹션), `videos[]`(영상 선택 탭), `away`, `videoIntro`, `rosterNote`는 최종 디자인이 쓰지 않습니다. `DESIGN_PROCESS.md`에 제거 이유가 기록되어 있어 그대로 따랐습니다. `videos[]`는 통합본 1개로 확정되었으므로 `video` 단일 객체로 축소.

함께 졸업하지 못한 네 지체(`away`)는 이 프로젝트의 존재 이유지만 렌더링되지 않으므로 데이터가 아니라 `docs/requirements.md`에 배경으로 남겼습니다.

**6. `JourneyPhoto.image` 옵셔널 필드 추가**

핸드오프는 사진을 번호 placeholder로만 다뤘습니다. 실제 사진이 들어올 때 컴포넌트를 고치지 않도록, 참고 레포 `Image.tsx`의 "src 있으면 img, 없으면 placeholder" 패턴을 가져와 `image?`를 넣었습니다.

## 확인한 것

| 항목 | 결과 |
|---|---|
| `npm run build` | ✅ 통과 (35 modules, 211KB / gzip 66.5KB) |
| `npm run lint` | ✅ 무경고 |
| `vite preview` + curl | ✅ `index.html` 200 / `/seal/wax-seal.png` 200 (80,677 B) / 번들에 한국어 문자열·씰 경로 포함 확인 |
| 실제 렌더링 화면 | ❌ **미확인** — 브라우저 도구가 없어 봉투 개봉 연출·스크롤 동작을 눈으로 보지 못했습니다 |

핸드오프가 기록한 함정 8건은 전부 코드에 반영하고 되돌리지 않도록 주석으로 표시했습니다. 요약은 `README.md` 「구현 노트」, 재발 방지 체크리스트는 `CLAUDE.md`.

## 남긴 것

**핸드오프 번들 결함** — `FE-legacy/screenshots/final/02`~`07`이 캡처 시 스크롤이 걸리지 않아 전부 표지 화면입니다(해시는 다르지만 내용 동일). 섹션별 실제 화면은 `npm run dev`로 확인해야 합니다.

**요구사항 누락 1건** — 통화에서 "언제까지만 볼 수 있고 지나면 끝나는" 열람 기한이 요청됐으나 핸드오프 디자인에는 이 개념이 없습니다. 이번 범위에서는 미구현이며 `docs/requirements.md` 미결 사항에 기록했습니다.

**콘텐츠 전량 placeholder** — 졸업 일자(`09.20`), 명단 120명(`김○○`), 여정 사진 30장, 간증 영상. 전부 `FE/src/data/graduation.ts` 한 파일 교체로 반영됩니다. 교체 방법은 `README.md` 「콘텐츠 교체 방법」.

**아직 커밋하지 않음** — 전부 untracked 상태입니다.

**작업 환경 메모** — Bash 도구로 heredoc을 쓸 때 명령 문자열이 약 8KB에서 잘렸습니다(`Graduates.tsx`가 중간에서 끊김). 큰 파일은 한 번에 하나씩 쓰는 편이 안전합니다.
