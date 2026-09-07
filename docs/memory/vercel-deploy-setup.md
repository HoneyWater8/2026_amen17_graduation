---
name: vercel-deploy-setup
description: Vercel 배포 계정·프로젝트 정보와, 앱이 FE/ 하위에 있어서 생기는 배포 함정 네 가지
metadata:
  type: project
---

배포 절차 자체는 `README.md` 「배포 (Vercel)」에 있습니다. 여기에는 **문서만 봐서는 안 보이는 것**만 적습니다.

## 계정 · 프로젝트

| 항목 | 값 |
|---|---|
| 팀 | `su-heon-choi-s-projects` / orgId `team_i5Fp7jSWD7stWHUbGSzKpoSA` |
| 프로젝트 | `2026_amen17_graduation` / `prj_TmiwVXQoDb3x6I84eMzIo612WUgF` |
| 프로덕션 도메인 | https://2026amen17graduation.vercel.app |
| `vercel.json` | **없음** — 설정은 전부 대시보드. 참고 레포와 동일 |

orgId는 [[reference-repo-hanaro-festival]]의 Vercel 프로젝트와 **같은 팀**입니다. 이전 프로젝트는 삭제된 상태였습니다.

## 함정 — 앱이 `FE/` 하위에 있기 때문

1. **CLI 배포는 반드시 `cd FE` 후 실행.** 레포 루트에는 `package.json`이 없습니다.
2. **`vercel link --project <이름>`을 먼저 하지 않으면 프로젝트명이 디렉터리명 `FE`가 됩니다.** 도메인이 `fe.vercel.app` 류가 되어버립니다.
3. **Root Directory 설정이 `.`이면 Git 자동 배포가 실패합니다.** CLI 배포는 `FE/`를 통째로 업로드하므로 `.`이어도 동작하지만, Git 연동 빌드는 레포 루트를 기준으로 하므로 **대시보드에서 `FE`로 바꿔야** 합니다. `vercel project`에는 설정 변경 커맨드가 없어 CLI로는 못 바꿉니다.
4. **`vercel link`가 `.gitignore` 끝에 `.vercel` · `.env*`를 append합니다.** gitignore는 뒤 패턴이 이기므로 기존 `!.env.example` 예외가 무효화됩니다. 링크 후 `git check-ignore -v FE/.env.example`로 반드시 확인하고, 중복 줄을 제거하세요.

## 그 외

- **도메인이 `FE/index.html`에 하드코딩**되어 있습니다 (`og:url` · `og:image` · `twitter:image` 3곳). 도메인을 바꾸면 함께 교체.
- **상시 공개 정책** — 열람 기한·자동 만료를 구현하지 않기로 했습니다(2026-09-07). 내릴 때는 대시보드에서 직접 제거합니다.
