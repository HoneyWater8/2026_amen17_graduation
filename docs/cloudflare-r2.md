# Cloudflare R2 영상 운영

## 구성

- 졸업 사이트: `https://2026amen17graduation.vercel.app` 유지. 웹앱은 Vercel Hobby에서 main push로 자동 배포한다.
- Cloudflare 계정: `f59ada602e45f4585fa7fca0becf52e7`.
- R2 버킷: `amen17-graduation-videos`, APAC, Standard.
- 영상 Worker: `amen17-graduation-videos`.
- 영상 주소: `https://amen17-graduation-videos.2026-amen17-graduation.workers.dev`.
- 설정·코드: `cloudflare/video-worker/`. Worker는 GET 전용 임시 주소로 307 연결하고, 영상 본문은 브라우저가 R2 S3 경로에서 직접 받는다. HEAD는 R2 바인딩으로 처리한다. 버킷의 Public Development URL과 Custom Domain은 비활성 상태다.

간증 10편과 감사 합본 1편의 `preview.mp4`·`hd.mp4` 22개(953,071,937B)를 이전한다. 원본과 `full.mp4`는 로컬에 보존한다. 기존 Blob 파일은 삭제하지 않는다.

**검증·배포(2026-09-27):** 영상 22개 업로드와 공개 URL의 HEAD·Range·바이트 검증을 완료했다. Production/Preview 환경 변수 22개씩을 R2 주소로 갱신하고 다시 내려받아 일치 여부를 확인했다. 로컬 빌드에도 22개 R2 주소가 모두 포함되며 기존 Blob 호스트는 없다. **사용자가 버퍼링 없는 정상 재생을 확인하고 main 커밋·푸시를 지시했다.** 공개 반영은 Git 자동 배포를 사용한다. 배포의 Ready 상태와 기존 사이트가 제공하는 JS 번들의 R2 주소, 실제 재생을 함께 확인한다. 환경 변수만 바꾸어서는 기존 배포가 갱신되지 않는다.

Worker 버전: `b38e35ba-5c86-430d-848f-b08c4fcf9e9b`. 사용자가 초기 대기와 반복 버퍼링을 확인해, 선택한 영상의 버퍼 확보·서버 사전 연결·R2 직접 전송을 적용했다. 검사 환경에서 같은 1MiB가 Worker 중계/LAX 경유 30~46초, R2 직접/ICN 경유 0.58~0.67초였다. 감사 합본 90초 검사에서 일반 재생 시작 약 1.5초, 재생 중 추가 멈춤 0회였다. 고화질 첫 전환은 약 10초가 걸린 측정도 있어 모든 대기가 사라졌다고 설명하지 않는다. 상세 비교와 한계는 [버퍼링 개선 기록](./worklog/2026-09-27-video-buffering.md)을 따른다.

## 업로드 및 검증

1. R2 대시보드의 Manage R2 API Tokens에서 `Object Read & Write` 권한을 해당 버킷에만 부여한다.
2. Git 제외 파일 `assets/video-work/.env.r2.local`에 다음을 저장한다. 인증 값을 대화·로그·Git에 출력하지 않는다.

```dotenv
R2_ACCOUNT_ID=f59ada602e45f4585fa7fca0becf52e7
R2_BUCKET=amen17-graduation-videos
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
```

3. 저장소 루트에서 업로드 목록을 생성하고 업로드한다. AWS CLI가 필요하다. 감사 합본의 HD 파일은 Wrangler의 단일 파일 제한 300MiB를 넘으므로 AWS CLI의 multipart 업로드를 사용한다.

```powershell
python scripts/upload-r2-videos.py
python scripts/upload-r2-videos.py --upload
python scripts/verify-r2-videos.py --base-url https://amen17-graduation-videos.2026-amen17-graduation.workers.dev
```

첫 명령은 로컬 목록만 생성한다. 업로드는 내용 해시가 포함된 이름을 사용하고, 같은 이름의 객체가 다르면 덮어쓰지 않고 중단한다. 기존 파일을 교체하려면 새 해시 주소로 올린다. 키는 명령줄 인수로 전달하지 않는다.

검증은 22개 고정 URL의 HEAD, 전체 크기, MIME, CORS, 처음·마지막 바이트의 206 응답과 최종 전송 호스트가 R2 S3인지 확인한다. 성공할 때 `assets/video-work/r2-deployment.json`, `r2-public-urls.env`를 생성한다. 결과에는 고정 공개 주소와 호스트만 넣고 서명 URL은 기록하지 않는다.

검증된 공개 주소를 기존 `VITE_*_VIDEO_URL`, `VITE_*_VIDEO_FULL_URL`의 Production/Preview 값으로 등록한다. 이미 두 환경에 등록된 변수는 `vercel env update <이름> --value <공개 URL> --yes --scope su-heon-choi-s-projects`로 갱신한다. 전체화면 전환·단일 재생·재생 전 MP4 요청 없음도 브라우저에서 확인한다. 웹앱 반영은 사용자 지시에 따라 main 커밋·푸시로 진행하며 `vercel deploy/redeploy`를 호출하지 않는다.

## Worker 변경

첫 설정 시 `npm ci --prefix cloudflare/video-worker` 후 `python scripts/configure-r2-delivery.py`로 기존 R2 키를 서버 전용 Worker Secret에 등록한다. `.env.r2.local`에서 읽어 stdin으로만 전달한다. 신규 발급 시에는 해당 버킷의 읽기 권한만 있으면 된다. 객체 업로드 키에는 버킷 CORS 관리 권한이 없을 수 있으므로 CORS는 로그인된 Wrangler 관리 인증을 사용한다.

현재 CORS는 `cloudflare/video-worker/cors.json`과 같으며 졸업 사이트 한 곳의 GET/HEAD만 허용한다. 새 환경에서는 먼저 `wrangler r2 bucket cors list amen17-graduation-videos`로 기존 정책을 확인하고, 필요한 규칙을 보존한 뒤 `cors set ... --file cloudflare/video-worker/cors.json`으로 적용한다. 임의의 모든 Origin을 허용하지 않는다.

```powershell
npm ci --prefix cloudflare/video-worker
npm --prefix cloudflare/video-worker test
npx --yes wrangler@4.141.0 deploy --dry-run --config cloudflare/video-worker/wrangler.jsonc
npx --yes wrangler@4.141.0 deploy --config cloudflare/video-worker/wrangler.jsonc
```

Cloudflare Worker 배포는 별도의 영상 제공 코드 배포다. Vercel 웹앱 배포와 구분한다. 호환 날짜는 Cloudflare의 UTC 현재 날짜를 넘길 수 없다.

Worker는 알려진 영상 경로 형식의 GET/HEAD/OPTIONS만 허용한다. 업로드·삭제·목록 조회 API는 공개하지 않는다. GET은 Cloudflare 공식 예제의 `aws4fetch`로 그 객체의 GET만 서명한다. 서명 Secret은 브라우저에 노출하지 않는다. Range·탐색·조건부 요청과 본문 전송은 R2가 처리한다. 현재 운영 설정에서 서명 Secret이 누락되면 GET은 캐시하지 않는 503으로 처리한다. 실제로 만료·폐기된 키의 서명은 R2에서 거절될 수 있으므로 키 교체 후 공개 검증을 실행한다.

주소는 한 시간 단위로 일정하게 생성해 같은 시간대 탐색의 브라우저 캐시를 재사용한다. 서명은 발급 기준 24시간(시간 단위 반올림 때문에 실제 최소 23시간) 유효하고, 307 응답은 5분만 캐시한다. 고정 Worker 주소는 다음 요청에 새 서명을 발급하므로 사이트나 공유 링크를 하루마다 갱신할 필요가 없다. 서명 URL 자체를 VITE 설정에 넣지 않는다. 영상의 1년 브라우저 캐시와 서명의 유효 기간은 별개이며 파일 자동 삭제 기간도 아니다.

플레이어는 선택한 영상만 `preload=auto`로 버퍼를 확보한다. 화질 전환에서 metadata만 요청하면 `load()`로 멈춘 영상의 첫 프레임 복원도 지연될 수 있다. 일시정지 복원 뒤에는 metadata로 줄이고, 다른 영상·숨긴 탭·페이지 이탈은 기존처럼 src를 해제한다. preconnect는 서버 연결만 준비하며 클릭 전 MP4를 다운로드하지 않는다.

## 비용과 유지

- R2 Standard 무료: 저장 10GB-month, Class A 월 100만 회, Class B 월 1,000만 회. 인터넷 전송료 무료. 무료 한도 초과 저장·요청은 과금될 수 있다.
- Workers Free: 계정 전체 하루 10만 요청, 호출당 CPU 10ms. 영상 재생 한 번은 여러 요청을 만들 수 있다. 무료 요청 한도 초과 시 당일 접근이 제한될 수 있다.
- Worker는 재생 주소를 서명할 때 R2를 읽지 않는다. 실제 재생은 R2 GET, 외부 HEAD 검사는 바인딩 HEAD로 집계된다. Worker 요청과 R2 작업 횟수는 다르며 탐색·화질 전환·브라우저 캐시에 따라 달라진다. Worker 본문 중계와 구간 캐시는 사용하지 않는다.
- `workers.dev`는 개인·취미 프로젝트용 기본 주소다. Cloudflare는 중요한 운영 서비스에 사용자 도메인을 권장한다. 향후 도메인을 연결하더라도 기존 졸업 사이트 주소는 유지할 수 있다.
- R2의 기본 `Abort uploads after 7 days`는 완료되지 않은 multipart 조각 정리이며 완성된 영상의 7일 삭제가 아니다. 완성 객체에 자동 삭제 규칙을 추가하지 않는다.
- 최소 1년 공개 유지. 무료 요금·가용성의 영구 보장을 의미하지 않으므로 사용량과 실제 재생을 주기적으로 확인한다.

공식 근거: [R2 요금](https://developers.cloudflare.com/r2/pricing/), [Workers 요금](https://developers.cloudflare.com/workers/platform/pricing/), [workers.dev](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/), [R2 서명 URL](https://developers.cloudflare.com/r2/api/s3/presigned-urls/), [aws4fetch](https://developers.cloudflare.com/r2/examples/aws/aws4fetch/), [R2 CORS](https://developers.cloudflare.com/r2/buckets/cors/), [React preconnect](https://react.dev/reference/react-dom/preconnect).
