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

## 현재 요금제 — Hobby · 영상 저장소 차단

**2026-09-26 사용자가 장애 복구를 위해 Pro로 전환했다가 같은 날 취소했습니다.** 23:54 KST 팀 API에서 `billing.plan=hobby`, `billing.status=active`, `billing.period=null`, `billing.cancelation=null`을 확인했습니다. 예약 취소 상태가 아니라 Hobby 전환이 이미 적용됐습니다. 사용량 응답의 `creditBalance`도 `null`이며 이전 $18.15를 계속 사용할 수 있다고 안내하면 안 됩니다. 실제 환불·최종 정산액은 확인하지 않았습니다.

23:56~23:58 KST 공개 영상 22개(경량 11·고화질 11)가 모두 **403 `Your store is blocked`**를 반환했습니다. Chrome의 실제 실배포 페이지에서도 간증 10편·감사 합본 모두 재생 버튼 클릭 후 준비 안내로 바뀌었습니다. 사이트 배포와 썸네일은 정상이지만 영상 재생은 불가능합니다. 팀 `softBlock=null`만으로 Blob 저장소 접근이 정상이라고 판단하지 않습니다.

**Why:** 기존 문서의 Hobby 저장 공간·전송량 제한은 초기 구성 당시 기준입니다. 영상 파일을 보관하는 용량과 방문자가 내려받는 누적 전송량은 별도이며, 저장 공간 안에 맞춰 압축해도 전송 한도 초과를 막지는 못합니다.

**How to apply:** 현재 플랜은 Hobby로 취급하고 영상 접근은 실제 공개 URL과 브라우저에서 확인합니다. 조회된 누적 Blob 전송량은 14.61GB이며 Hobby의 10GB 한도를 넘습니다. 전송 최적화는 이미 발생한 사용량이나 저장소 차단을 해제하지 않습니다. 플랜 변경·재결제·호스팅 이전은 임의로 수행하지 않습니다. 최신 결과는 [취소 후 점검 기록](../worklog/2026-09-26-cancellation-status.md), 이전 Pro 상태는 [당시 점검 기록](../worklog/2026-09-26-pro-upgrade-status.md)을 참고합니다.

## 운영 기간 · 비용 목표

**2026-09-26 사용자 지시:** 이미 공유한 링크는 1년간 유지해야 합니다. Pro 결제는 영상 장애의 긴급 해결을 위한 임시 조치였으며 사용자가 같은 날 취소했습니다.

**2026-09-27 사용자 선택:** 영상은 Cloudflare R2로 이전하고, 방문자용 `2026amen17graduation.vercel.app` 주소는 그대로 유지합니다. 사용자가 Cloudflare 계정 `f59ada602e45f4585fa7fca0becf52e7`에 `amen17-graduation-videos` 버킷(APAC, Standard)을 생성하고 CLI 연결과 업로드 키를 제공했습니다. 별도 도메인 구매 없이 R2 + Workers 기본 주소를 사용합니다. 실제 완료 단계는 [R2 운영 문서](../cloudflare-r2.md)를 확인합니다.

**How to apply:** 영상은 고정 Worker 주소에서 GET 전용 임시 주소를 발급받고 브라우저가 R2에서 본문을 직접 받습니다. Vercel과 Worker의 영상 본문 전송을 피합니다. 고정 주소는 `https://amen17-graduation-videos.2026-amen17-graduation.workers.dev`입니다. 버킷 개발용 공개 주소는 끄며 CORS는 졸업 사이트 하나로 제한합니다. 평소 경량본·전체화면 고화질·단일 재생·재생 전 MP4 요청 없음은 유지합니다. R2와 Workers 각각 무료 한도가 있으며 무제한 무료라고 설명하지 않습니다. Worker 코드는 `cloudflare/video-worker/`, 운영 절차는 `docs/cloudflare-r2.md`에 있습니다. 서명 키는 Git 제외 파일과 Worker Secret에만 두고, VITE에는 만료되지 않는 고정 공개 주소만 넣습니다. Cloudflare 영상 Worker 배포와 Vercel 웹앱의 main 자동 배포를 구분합니다.

영상 22개 업로드·공개 URL 검증 및 Production/Preview URL 갱신은 완료했습니다. 2026-09-27 초기 지연과 반복 버퍼링에 대응해 선택한 영상의 버퍼 확보, 서버 사전 연결, R2 직접 전송을 적용했습니다. **사용자가 이후 영상이 버퍼링 없이 정상 재생된다고 확인하고 커밋·푸시를 지시했습니다.** 기존 화질·단일 재생·클릭 전 MP4 요청 없음은 유지합니다. 공개 사이트 반영은 main 자동 배포의 Ready 상태와 배포된 번들의 R2 주소를 함께 확인합니다. iPhone·카카오 인앱 실기기 검증은 사용자 확인과 구분하며 운영 절차는 [R2 운영 문서](../cloudflare-r2.md)를 따릅니다.

**How to apply:** 기존 실배포 URL을 유지하는 구성을 우선합니다. 후속 호스팅을 선택하면 공개 URL의 재생·전체화면 동작을 검증합니다. 기존 영상과 원본은 보존합니다. 최소 1년 유지 요구는 자동 만료·삭제 요청이 아닙니다. 취소 적용일을 설명할 때는 일반 약관만으로 기간 말 적용을 보장하지 말고 계정 화면과 실제 상태를 확인합니다.

같은 날 사용자는 **우선 코드에서 가능한 최적화를 진행**하도록 요청했습니다. 영상 품질·전체화면 고화질은 유지하면서 재생 전 요청과 중단된 영상의 다운로드를 줄이는 범위입니다. 코드 최적화만으로 월 무료 한도를 보장할 수 없으므로, 호스팅 이전·요금제 변경은 별도 판단 대상으로 남깁니다. 검증 결과는 [영상 요청 최적화 로그](../worklog/2026-09-26-video-bandwidth.md)를 참고합니다.

## 프로젝트 연결 시 주의점

1. **Root Directory는 반드시 `FE`.** Git 연동 빌드는 레포 루트를 기준으로 하며 앱의 `package.json`은 `FE/`에 있습니다. 대시보드 Settings → Build & Deployment에서 2026-09-07 `FE`로 설정했습니다.
2. **새 작업 환경의 CLI 연결은 기존 프로젝트를 명시합니다.** Blob 업로드·환경 변수 관리에 연결이 필요하면 `FE/`에서 `vercel link --project 2026_amen17_graduation`을 사용합니다. 새 프로젝트를 만들지 않습니다.
3. **`vercel link`가 `.gitignore` 끝에 `.vercel` · `.env*`를 append합니다.** gitignore는 뒤 패턴이 이기므로 기존 `!.env.example` 예외가 무효화됩니다. 링크 후 `git check-ignore -v FE/.env.example`로 반드시 확인하고, 중복 줄을 제거하세요.

## 그 외

- **도메인이 `FE/index.html`에 하드코딩**되어 있습니다 (`og:url` · `og:image` · `twitter:image` 3곳). 도메인을 바꾸면 함께 교체.
- **상시 공개 정책** — 열람 기한·자동 만료를 구현하지 않기로 했습니다(2026-09-07). 내릴 때는 대시보드에서 직접 제거합니다.
- **영상은 Vercel Blob으로 배포** — 2026-09-22 공개 저장소 `amen17-graduation-videos` (`store_zw4d65fKlIme6aVE`, `icn1`)를 이 프로젝트에 연결했습니다. 2026-09-26 새 간증 10편의 경량본을 업로드하고 URL을 Production/Preview 환경 변수로 등록·교체했습니다. 감사 합본은 기존 주소를 유지하며, 이전 간증 Blob 4개도 복구용으로 보존합니다. Git 제외된 로컬 MP4가 Git 배포에 실리지 않는 문제를 해결한 것으로, 업로드는 [영상 자산 관리](../video-assets.md#공개-배포-vercel-blob)를 따릅니다. 현재 Hobby이며 취소 후 저장소 차단 상태는 위 기록을 따릅니다.
- **전체화면 고화질 준비** — 2026-09-26 해상도를 유지한 웹 고화질본 `hd.mp4` 11개를 추가 업로드하고 `VITE_TESTIMONY_1_VIDEO_FULL_URL`~`VITE_TESTIMONY_10_VIDEO_FULL_URL`, `VITE_GRADUATION_VIDEO_FULL_URL`을 Production/Preview에 등록했습니다. 기존 경량본·이전 간증 4개를 포함해 총 26개, 989,065,457 B입니다. 당시 Hobby 저장 공간 1GB 안에 맞춘 결과이며, 이후 사용자가 Pro로 변경했습니다. 추가 업로드 전에는 현재 사용량을 확인합니다. 앱 전환 코드도 사용자 요청에 따라 main 커밋·푸시를 통한 자동 배포로 반영합니다.
- **Blob CLI 인증** — CLI 59.25.0이 내려준 `.env.local`에 OIDC 토큰은 있으나 저장소 ID가 누락되어 `BLOB_STORE_ID="store_zw4d65fKlIme6aVE"`를 추가했습니다. 파일은 Git 제외이며 토큰은 출력·커밋하지 않습니다. 업로드 후 앱에는 `VITE_*_VIDEO_URL`과 `VITE_*_VIDEO_FULL_URL` 공개 주소만 전달합니다.
- **토큰 만료 시** — 2026-09-26 기존 인증으로 Blob 업로드가 거절되어 `vercel env pull .env.local --yes`로 갱신한 뒤 성공했습니다. CLI 60.0.1은 로컬 전용 `BLOB_STORE_ID`와 카카오 키를 유지했습니다. 갱신 후에도 Git 제외 여부와 `.env.example` 예외를 확인합니다.
