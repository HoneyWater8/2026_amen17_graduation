# 2026-09-07 · Vercel 배포 환경 구성 · 프로덕션 배포

> 참고 레포와 동일한 방식(대시보드 설정 · `vercel.json` 없음)으로 프로젝트를 만들고 프로덕션 배포. 열람 기한은 구현하지 않기로 확정.

**배포본** — https://2026amen17graduation.vercel.app

## 한 일

- **열람 기한 미구현 확정** — `README.md` 상태표, `docs/requirements.md` 제약·미결 사항에 결정 기록
- **배포 절차 문서화** — `README.md`에 「배포 (Vercel)」 섹션, `FE/.env.example`에 대시보드 등록 안내
- **Vercel 프로젝트 생성·연결** — `su-heon-choi-s-projects/2026_amen17_graduation`
- **프로덕션 배포** — `npx vercel --prod`
- `docs/urls.md` 재작성 — 배포 URL · 대시보드 · 팀 정보 · 레포 내 문서 인덱스

## 판단한 것

**1. `vercel.json`을 만들지 않음**

참고 레포를 조사해보니 `vercel.json`이 없고 설정이 전부 대시보드에 있었습니다. SPA라 rewrite도 필요 없어 그대로 따랐습니다. Root Directory(`FE`)는 `FE/`에서 `vercel link`를 실행해 자동으로 잡히게 했습니다.

**2. `vercel link --project`로 이름을 명시한 뒤 배포**

`FE/`에서 `vercel` 을 그냥 실행하면 **프로젝트명이 디렉터리명 `FE`로 잡힙니다.** 도메인이 `fe.vercel.app` 류가 되어버리므로, `--project 2026_amen17_graduation`으로 이름을 먼저 확정하고 링크한 뒤 배포했습니다.

이름을 `2026_amen17_graduation`으로 고른 이유는 참고 레포(`2026_hanaro_family_festival` → `2026hanarofamilyfestival.vercel.app`)의 슬러그 규칙상 언더스코어가 제거되어 `2026amen17graduation.vercel.app`이 되고, 이는 `FE/index.html`에 이미 하드코딩해둔 OG 주소와 일치하기 때문입니다. 배포 후 별칭을 확인해 실제로 일치함을 검증했습니다.

**3. Vercel이 오염시킨 `.gitignore`를 복구**

`vercel link`가 `.gitignore` 끝에 `.vercel` · `.env*` 두 줄을 자동 추가했습니다. 그런데 기존 파일에는 이미 같은 패턴과 함께 `!.env.example` 예외가 있었고, **gitignore는 뒤에 오는 패턴이 이깁니다.** 결과적으로 새로 붙은 `.env*`가 예외를 덮어써 `.env.example`이 추적 대상에서 빠졌습니다.

`git check-ignore -v`로 발견해 중복 블록을 제거했고, 네 파일(`.env.example` 추적 / `.env.local` 무시 / `.vercel/project.json` 무시 / `public/video/.gitkeep` 추적)이 의도대로인지 다시 확인했습니다.

**4. placeholder 상태로 프로덕션 배포**

명단·사진·영상이 전부 placeholder인 상태라 프리뷰 배포를 권했으나, 발주 측 판단으로 프로덕션까지 진행했습니다. 링크를 아직 공유하지 않는다는 전제입니다.

## 확인한 것

| 항목 | 결과 |
|---|---|
| 팀 | `team_i5Fp7jSWD7stWHUbGSzKpoSA` — **참고 레포와 동일한 orgId**. 이전 프로젝트만 삭제되어 있던 것 |
| 프로덕션 별칭 | ✅ `https://2026amen17graduation.vercel.app` (하드코딩 값과 일치) |
| 페이지 응답 | ✅ HTTP 200. Deployment Protection 없이 공개 접근 가능 |
| `/seal/wax-seal.png` | ✅ HTTP 200 (80,677 B) |
| JS 번들 | ✅ HTTP 200 (211,347 B) |
| OG 태그 | ✅ 일시·장소 반영된 값이 실제 응답에 포함 |
| `/icons/thumbnail.png` | ❌ **HTTP 404** |

## 남긴 것

**공유 카드에 이미지가 없습니다.** `thumbnail.png`(800×800)가 없어 카카오톡으로 링크를 보내면 이미지 없는 카드가 나갑니다. 카카오톡 공유가 주 유통 경로라 배포보다 먼저 해결됐어야 할 항목입니다.

**렌더링은 여전히 눈으로 확인하지 못했습니다.** HTTP 응답·번들·에셋까지만 검증했습니다. 봉투 개봉 연출과 스크롤 동작은 실제 브라우저에서 봐야 합니다 — 이제 배포됐으니 위 URL을 모바일에서 열어 확인해 주세요.

**여전히 커밋 0건.** 배포는 CLI 직접 업로드 방식이라 git 없이 됐지만, Git 연동(push하면 자동 배포)을 쓰려면 원격 저장소가 필요합니다.

**D-13.** 자료 수급용 카카오톡 단체방이 아직 열리지 않았습니다.
