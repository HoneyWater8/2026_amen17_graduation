---
name: vercel-deploy-setup
description: main 커밋·푸시로 자동 배포한다. 직접 배포 명령은 사용하지 않는다. Vercel 프로젝트·영상 저장소 설정
metadata:
  type: project
---

배포 절차 자체는 `README.md` 「배포 (Vercel)」에 있습니다. 여기에는 **문서만 봐서는 안 보이는 것**만 적습니다.

## 배포 방식 — main 자동 배포

**2026-09-22 사용자 재확인: 앱 배포는 `main`에 커밋·푸시하면 Vercel이 자동으로 진행합니다. `vercel deploy`, `vercel --prod`, `vercel redeploy` 등 직접 배포 명령을 실행하지 않습니다.**

**Why:** 이미 Git 자동 배포가 연결되어 있습니다. 직접 배포를 추가로 실행하면 저장소의 커밋과 실제 배포 코드가 달라지거나 중복 배포가 발생합니다.

**How to apply:** 사용자가 커밋·푸시 또는 배포를 요청하면 검증한 변경 사항을 `main`에 커밋·푸시하고 자동 배포 결과를 확인합니다. 영상 파일의 Blob 업로드와 공개 URL 환경 변수 등록은 필요한 경우 먼저 수행하고, 앱 반영은 같은 Git 자동 배포 절차를 따릅니다. 커밋·푸시 시점에 대한 사용자 지시는 [[ask-before-commit-push]]를 따릅니다.

## 계정 · 프로젝트

| 항목 | 값 |
|---|---|
| 팀 | `su-heon-choi-s-projects` / orgId `team_i5Fp7jSWD7stWHUbGSzKpoSA` |
| 프로젝트 | `2026_amen17_graduation` / `prj_TmiwVXQoDb3x6I84eMzIo612WUgF` |
| 프로덕션 도메인 | https://2026amen17graduation.vercel.app |
| `vercel.json` | **없음** — 설정은 전부 대시보드. 참고 레포와 동일 |

orgId는 [[reference-repo-hanaro-festival]]의 Vercel 프로젝트와 **같은 팀**입니다. 이전 프로젝트는 삭제된 상태였습니다.

## 프로젝트 연결 시 주의점

1. **Root Directory는 반드시 `FE`.** Git 연동 빌드는 레포 루트를 기준으로 하며 앱의 `package.json`은 `FE/`에 있습니다. 대시보드 Settings → Build & Deployment에서 2026-09-07 `FE`로 설정했습니다.
2. **새 작업 환경의 CLI 연결은 기존 프로젝트를 명시합니다.** Blob 업로드·환경 변수 관리에 연결이 필요하면 `FE/`에서 `vercel link --project 2026_amen17_graduation`을 사용합니다. 새 프로젝트를 만들지 않습니다.
3. **`vercel link`가 `.gitignore` 끝에 `.vercel` · `.env*`를 append합니다.** gitignore는 뒤 패턴이 이기므로 기존 `!.env.example` 예외가 무효화됩니다. 링크 후 `git check-ignore -v FE/.env.example`로 반드시 확인하고, 중복 줄을 제거하세요.

## 그 외

- **도메인이 `FE/index.html`에 하드코딩**되어 있습니다 (`og:url` · `og:image` · `twitter:image` 3곳). 도메인을 바꾸면 함께 교체.
- **상시 공개 정책** — 열람 기한·자동 만료를 구현하지 않기로 했습니다(2026-09-07). 내릴 때는 대시보드에서 직접 제거합니다.
- **영상은 Vercel Blob으로 배포** — 2026-09-22 공개 저장소 `amen17-graduation-videos` (`store_zw4d65fKlIme6aVE`, `icn1`)를 이 프로젝트에 연결했습니다. 간증 4편·감사 합본의 경량본을 공개하고 URL을 Production/Preview 환경 변수로 등록했습니다. Git 제외된 로컬 MP4가 Git 배포에 실리지 않는 문제를 해결한 것으로, 업로드는 [영상 자산 관리](../video-assets.md#공개-배포-vercel-blob)를 따릅니다. Hobby 플랜을 유지합니다.
- **Blob CLI 인증** — CLI 59.25.0이 내려준 `.env.local`에 OIDC 토큰은 있으나 저장소 ID가 누락되어 `BLOB_STORE_ID="store_zw4d65fKlIme6aVE"`를 추가했습니다. 파일은 Git 제외이며 토큰은 출력·커밋하지 않습니다. 업로드 후 앱에는 `VITE_*_VIDEO_URL` 공개 주소만 전달합니다.
