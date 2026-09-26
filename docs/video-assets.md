# 영상 자산 관리

2026-09-26 기준. 초원 이름과 순서는 사용자가 전달한 정본을 따른다. **새 초원별 간증 영상 10편의 원본 정리·재생용 변환·Vercel Blob 공개 업로드 완료. 간증 10편과 감사 합본 1편을 연결한다.**

## 디렉터리

```text
assets/
├─ video-originals/                  # 받은 원본. Git 제외, 삭제하지 않음
│  ├─ inventory.json                 # 수령 파일명 → 정리된 경로 · SHA-256 · 바이트 수
│  ├─ testimony/                     # 2026-09-25 새 수령본 10편
│  │  ├─ 01_생사위주 초원.mp4
│  │  ├─ 02_Onlyhim 초원.mp4
│  │  ├─ 03_하.군.남 초원.mp4
│  │  ├─ 04_다모인 초원.mp4
│  │  ├─ 05_은혜둥이 팔복둥이 초원.mp4
│  │  ├─ 06_영음 초원.mp4
│  │  ├─ 07_감사의 언니들 초원.mp4
│  │  ├─ 08_더드림 가조 초원.mp4
│  │  ├─ 09_어순종팀 초원.mp4
│  │  └─ 10_부어부어 초원.mp4
│  ├─ archive/2026-09-25/testimony/   # 교체 전 02·08·09·10 원본 4편 보존
│  └─ gratitude/
│     ├─ 01-장년.mp4
│     ├─ 02-청년.mp4
│     ├─ 03-장년.mp4
│     ├─ 04-장년.mp4
│     ├─ 05-장년.mp4
│     ├─ 06-청년.mp4
│     └─ 07-장년.mp4                # 2026-09-22 추가 수령분
└─ video-work/                       # 변환 중간 파일 · 로그 · 검증 결과. Git 제외

FE/public/video/                    # 재생용: 새 간증 10편과 감사 합본, 총 33개 파일
├─ testimony/
│  └─ 01~10/{preview,full,hd}.mp4
└─ graduation/{preview,full,hd}.mp4     # 감사 영상 7개를 합친 영상

FE/public/video-posters/             # 별도 WebP 썸네일. Git에 포함해 사이트와 함께 배포
├─ testimony/01~10.webp
└─ graduation.webp
```

`public`의 파일은 로컬 Vite 빌드 시 그대로 `dist`에 복사된다. 편집용 원본을 배포 결과에 섞지 않기 위해 원본은 `assets/video-originals/`에 보관한다. 원본과 재생용 영상 모두 Git에 포함하지 않는다. 현재 연결된 배포용 경량본 11개는 Vercel Blob에 올렸으며, Git 빌드는 환경 변수의 공개 URL로 연결한다.

## 공개 배포 (Vercel Blob)

**2026-09-22 최초 공개 업로드 후, 2026-09-26 사용자 요청으로 새 간증 10편의 경량본을 추가 업로드하고 Production/Preview URL을 등록·교체했다. 감사 합본 1편은 기존 주소를 유지한다.** 페이지와 영상 모두 Vercel에서 제공한다. 기존 Git 배포에서 영상 경로가 404였던 원인은 `FE/public/video/`의 파일이 Git 제외 대상이라 원격 빌드에 없었기 때문이다.

| 항목 | 값 |
|---|---|
| 연결 프로젝트 | `su-heon-choi-s-projects/2026_amen17_graduation` |
| Blob 저장소 | `amen17-graduation-videos` / `store_zw4d65fKlIme6aVE` |
| 접근 · 리전 | Public · `icn1` (서울) |
| 공개 주소 기준 | `https://zw4d65fklime6ave.public.blob.vercel-storage.com/` |
| 현재 연결 파일 | 경량본 11개, 총 221,557,417 B (211.29 MiB) |
| 저장소 보존 파일 | 고화질 11개·이전 간증 4개 포함 총 26개, 943.25 MiB |
| 적용 환경 | Production · Preview. Development는 로컬 파일 기본 경로 유지 |

다음 경로를 위 공개 주소 기준에 이어 붙인 전체 URL이 각 환경 변수의 값이다. 파일명의 12자리 값은 로컬 파일 SHA-256의 앞부분이며, 교체 시 새 경로를 사용해 기존 캐시와 구분한다.

| 환경 변수 | Blob 경로 |
|---|---|
| `VITE_TESTIMONY_1_VIDEO_URL` | `video/testimony/01/preview-879bc5088505.mp4` |
| `VITE_TESTIMONY_2_VIDEO_URL` | `video/testimony/02/preview-04aa45879a90.mp4` |
| `VITE_TESTIMONY_3_VIDEO_URL` | `video/testimony/03/preview-17266ff8e4c1.mp4` |
| `VITE_TESTIMONY_4_VIDEO_URL` | `video/testimony/04/preview-31d1eace182c.mp4` |
| `VITE_TESTIMONY_5_VIDEO_URL` | `video/testimony/05/preview-32dd91b2de44.mp4` |
| `VITE_TESTIMONY_6_VIDEO_URL` | `video/testimony/06/preview-52346a165ed0.mp4` |
| `VITE_TESTIMONY_7_VIDEO_URL` | `video/testimony/07/preview-c0c92f2efeaa.mp4` |
| `VITE_TESTIMONY_8_VIDEO_URL` | `video/testimony/08/preview-471515969d0c.mp4` |
| `VITE_TESTIMONY_9_VIDEO_URL` | `video/testimony/09/preview-b32b1cfe1e0d.mp4` |
| `VITE_TESTIMONY_10_VIDEO_URL` | `video/testimony/10/preview-ca24debc3ed7.mp4` |
| `VITE_GRADUATION_VIDEO_URL` | `video/graduation/preview-2b5c48754661.mp4` |

이미 등록한 환경 변수를 유지하면 이후 Git 푸시에도 영상이 연결된다. **원본과 `full.mp4`는 업로드하지 않았다.** 경량본과 별도의 웹 고화질본 `hd.mp4`를 공개하고, 이전 간증 Blob 4개는 복구용으로 보존한다. `full.mp4` 11개의 합계가 약 3.42GB라, 해상도를 유지한 `hd.mp4`를 따로 압축해 무료 저장 공간 안에 맞췄다.

간증·감사 영상을 통틀어 한 번에 하나만 재생한다. 재생 버튼을 누르기 전에는 영상 주소를 연결하지 않는다. 새 영상 재생·탭 숨김·페이지 이탈 시 이전 영상의 주소를 해제하고 `load()`로 진행 중인 요청과 버퍼를 정리한다. 같은 페이지에서 다시 버튼을 누르면 기억한 위치·속도·음량·음소거를 복원한다. 네이티브 컨트롤의 짧은 일시정지는 연결을 유지한다.

### 재생 전 썸네일과 전송량 절감

- 재생 전에는 `FE/public/video-posters/`의 640×360 WebP만 표시한다. 11장 합계 163,112 B이며 Vercel Blob에 추가 업로드하지 않고 Git으로 사이트에 포함한다.
- 단순히 `preload="none"`에 의존하지 않는다. 초기에는 `<video>`의 `src` 자체가 없으므로 봉투를 열거나 스크롤하는 것만으로 MP4를 요청하지 않는다. 클릭한 영상에만 경량본을 연결한다.
- 탭으로 돌아온 것만으로 영상을 다시 요청하지 않는다. 재생 버튼을 눌러야 이어 본다. 재생 위치는 현재 페이지 메모리에만 유지하며 새로고침 후에는 초기화한다.
- 전체화면 고화질과 오류 복귀는 유지한다. 영상 해상도·비트레이트는 이번 최적화에서 바꾸지 않았다. 실제 시청에 필요한 전송량과 화질 전환에 따른 재요청은 계속 발생하며, 클라이언트 코드만으로 월 무료 한도나 1년 운영을 보장하지는 않는다.
- 영상 교체 후 `python scripts/prepare-videos.py --section posters`를 실행해 썸네일도 갱신한다. `preview.mp4`의 1초 지점에서 품질 75의 WebP를 추출하며 원본·MP4는 수정하지 않는다. 환경 변수 `VITE_*_VIDEO_POSTER`로 다른 이미지를 지정할 수도 있다.

### 영상 추가·교체

1. 아래 변환 절차로 로컬 재생본을 만들고 재생·길이·순서를 확인한다.
2. `FE/`에서 로그인된 Vercel CLI로 기존 Blob 저장소에 업로드한다. 예: `npx vercel blob put public/video/testimony/02/preview.mp4 --access public --pathname video/testimony/02/preview-<새 SHA256 앞 12자리>.mp4 --content-type video/mp4 --scope su-heon-choi-s-projects`.
3. 반환된 공개 URL에 `200`, `video/mp4`, 정확한 파일 크기, `Range` 요청의 `206` 응답을 확인한다.
4. 해당 `VITE_*_VIDEO_URL`과 `VITE_*_VIDEO_FULL_URL`을 Production/Preview에 등록하거나 갱신한다. 예: `npx vercel env add VITE_TESTIMONY_2_VIDEO_URL production,preview --value <공개 URL> --force --yes --no-sensitive --scope su-heon-choi-s-projects`. 영상 교체 시 경량본·고화질본을 함께 갱신해 같은 내용과 재생 위치를 유지한다.
5. 코드·영상 관리 문서 등 변경 사항을 `main`에 커밋·푸시해 Vercel 자동 배포로 반영한다. 직접 배포 명령은 사용하지 않는다. Vite는 빌드 시 URL을 넣으므로 **환경 변수 변경만으로 기존 배포가 바뀌지는 않는다.**
6. 실제 프로덕션 페이지에서 재생과 구간 이동을 확인한다. 새 배포가 검증될 때까지 기존 Blob을 삭제하지 않는다.

CLI 인증 정보는 Git 제외된 `FE/.env.local`에서 읽는다. Vercel CLI 59.25.0의 저장소 연결은 `VERCEL_OIDC_TOKEN`과 `BLOB_READ_WRITE_TOKEN`을 내려주지만 `BLOB_STORE_ID`는 빠져 있었다. 인증 만료로 접근 거절이 발생하면 `vercel env pull .env.local --yes`로 갱신한다. 2026-09-26 CLI 60.0.1에서 갱신 후 업로드를 확인했다. 두 OIDC 값이 모두 필요하다는 오류가 나면 `.env.local`에 `BLOB_STORE_ID="store_zw4d65fKlIme6aVE"`를 함께 지정한다. 인증 토큰은 문서·Git·프론트엔드 번들에 넣지 않으며 `VITE_` 접두사도 붙이지 않는다. `vercel env pull` 등이 `.gitignore` 끝에 `.env*`를 추가하면 기존 `!.env.example` 예외가 유지되도록 중복 줄을 제거한다.

2026-09-26 영상 전송 한도 초과 후 사용자가 긴급 복구를 위해 Pro로 변경했다. 향후 유료 결제를 취소할 계획이며 기존 링크는 최소 1년 유지해야 한다. 호스팅 이전은 아직 결정하지 않았고, 먼저 코드에서 불필요한 영상 요청을 줄인다. 저장 용량과 월 전송량은 별개이므로 현재 요금제·사용량은 [배포 메모리](./memory/vercel-deploy-setup.md)와 대시보드에서 확인한다. [Vercel Blob 사용량·요금](https://vercel.com/docs/vercel-blob/usage-and-pricing)

## 전체화면 고화질

2026-09-26 간증 10편과 감사 합본 모두 전체화면 화질 전환을 구현했다. 고화질 파일 11개를 기존 Public Blob에 업로드하고 Production/Preview의 `VITE_TESTIMONY_1_VIDEO_FULL_URL`~`VITE_TESTIMONY_10_VIDEO_FULL_URL`, `VITE_GRADUATION_VIDEO_FULL_URL`에 등록했다. **앱 변경은 `main` 커밋·푸시를 통한 자동 배포로 반영한다.**

- 평상시 `preview.mp4`, 영상 전체화면에서만 `hd.mp4`를 요청한다. 재생 위치·재생/일시정지·속도·음량·음소거를 유지하며 같은 video 요소의 소스를 교체한다.
- 고화질 오류나 15초 로딩 시간 초과 시 같은 위치의 경량본으로 복귀한다. 고화질이 한 번 실패한 플레이어는 같은 페이지 세션에서 반복 요청하지 않는다.
- 로딩 중 다른 영상을 재생하면 예약된 자동 재개도 취소한다. 브라우저가 자동 재개를 제한하면 같은 위치에서 재생 버튼으로 이어 본다.
- 표준 `fullscreenchange`와 Safari의 `webkitbeginfullscreen`, `webkitendfullscreen`, `webkitpresentationmodechanged`를 처리한다. PiP와 브라우저 창 확대는 영상 전체화면으로 취급하지 않는다.
- 로컬은 `/video/testimony/NN/hd.mp4`, `/video/graduation/hd.mp4`를 사용한다. 원격 경량본만 지정하고 고화질 URL을 생략한 환경은 경량본을 유지한다.

`hd.mp4`는 `full.mp4`를 H.264 CRF 24 / medium으로 다시 압축한 공개 전송용 파일이다. 해상도·프레임률·AAC 음성을 유지하며, 원본 비트스트림과 동일하지는 않다. 기존 원본·`full.mp4`는 그대로 보존한다.

고화질 업로드 합계 731,514,520 B(697.63 MiB). 기존 경량본·이전 간증 4개까지 포함한 Blob 전체는 989,065,457 B(943.25 MiB), 총 26개다. 업로드 당시 Hobby 저장 공간 포함량 1GB 안에 맞춘 결과이며, 이후 사용자가 Pro로 변경했다. Hobby로 돌아가면 저장 공간 여유는 약 10.9MB이므로 추가 업로드 전에 용량을 확인한다. 월 전송량은 별도로 사용량을 확인한다.

| 영상 | 해상도 | hd.mp4 | 공개 경로 |
|---|---|---|---|
| 초원 01 | 1920×1080 | 33.52 MiB | `video/testimony/01/hd-cf9c08aa76b1.mp4` |
| 초원 02 | 1920×1080 | 35.82 MiB | `video/testimony/02/hd-2eef913fb945.mp4` |
| 초원 03 | 1920×1080 | 36.90 MiB | `video/testimony/03/hd-02dfb6635ad4.mp4` |
| 초원 04 | 1280×720 | 28.25 MiB | `video/testimony/04/hd-4e38d7ef71ce.mp4` |
| 초원 05 | 1920×1080 | 35.02 MiB | `video/testimony/05/hd-a70c9c6c55c1.mp4` |
| 초원 06 | 1920×1080 | 39.05 MiB | `video/testimony/06/hd-08104099f4c5.mp4` |
| 초원 07 | 1920×1080 | 47.41 MiB | `video/testimony/07/hd-7d8633c15a08.mp4` |
| 초원 08 | 1920×1080 | 30.03 MiB | `video/testimony/08/hd-e2f1c0230f97.mp4` |
| 초원 09 | 1920×1080 | 47.34 MiB | `video/testimony/09/hd-be57cae57abd.mp4` |
| 초원 10 | 1280×720 | 12.98 MiB | `video/testimony/10/hd-c45b743a768d.mp4` |
| 감사 합본 | 2560×1440 | 351.30 MiB | `video/graduation/hd-5210fb76a59d.mp4` |

Windows Chrome의 실제 전체화면에서 전환과 오류 복귀를 검증했다. 공개 Blob URL을 연결한 빌드에서도 11편 모두 재생 위치·설정을 보존하며 원본 해상도와 540p 사이를 왕복했다. Safari 이벤트 처리는 자동 회귀 테스트로 확인했으며, iPhone·카카오 인앱 브라우저 실기기 확인은 별도로 필요하다.

관련 API: [MDN fullscreenchange](https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenchange_event), [MDN load](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/load), [Apple HTMLVideoElement](https://developer.apple.com/documentation/webkitjs/htmlvideoelement).

## 초원별 수령 현황

| 번호 | 정본 이름 | 2026-09-25 받은 파일 | 현재 재생본 상태 |
|---|---|---|---|
| 01 | 생사위주 초원 | `생사위주.mp4` | `/video/testimony/01/` — 새 수령본 변환·공개 연결 완료 |
| 02 | Onlyhim 초원 | `Onlyhim.mp4` | `/video/testimony/02/` — 새 수령본 변환·공개 연결 완료 |
| 03 | 하.군.남 초원 | `하군남.mp4` | `/video/testimony/03/` — 새 수령본 변환·공개 연결 완료 |
| 04 | 다모인 초원 | `다모인.mp4` | `/video/testimony/04/` — 새 수령본 변환·공개 연결 완료 |
| 05 | 은혜둥이 팔복둥이 초원 | `은혜둥이 팔복둥이.mp4` | `/video/testimony/05/` — 새 수령본 변환·공개 연결 완료 |
| 06 | 영음 초원 | `영음.mp4` | `/video/testimony/06/` — 새 수령본 변환·공개 연결 완료 |
| 07 | 감사의 언니들 초원 | `감사의 언니들.mp4` | `/video/testimony/07/` — 새 수령본 변환·공개 연결 완료 |
| 08 | 더드림 가조 초원 | `더드림 가조.mp4` | `/video/testimony/08/` — 새 수령본 변환·공개 연결 완료 |
| 09 | 어순종팀 초원 | `어순종팀.mp4` | `/video/testimony/09/` — 새 수령본 변환·공개 연결 완료 |
| 10 | 부어부어 초원 | `부어부어.mp4` | `/video/testimony/10/` — 새 수령본 변환·공개 연결 완료 |

원본의 청년 팀 번호는 화면의 초원 번호와 다르다. 새 영상을 받으면 위 번호를 기준으로 `assets/video-originals/testimony/NN_정본 초원명.mp4`에 보관한다.

이번 수령 폴더는 `수헌이전달간증`이며 파일명과 확인한 영상 내용이 초원별 간증에 해당해 `testimony/`로 분류했다. 감사 합본용 `gratitude/` 7편과는 구분한다. 새 파일은 10편 모두 H.264이며 1080p 8편, 720p 2편(04·10), 총 2,819,257,855 B(약 2.63 GiB)다.

기존 간증 02·08·09·10과 새 수령본은 해시·길이가 모두 달라 중복으로 취급하지 않았다. 이전 원본은 `archive/2026-09-25/testimony/`로 옮겨 그대로 보존했다. `inventory.json`에는 기존 항목의 보관 경로를 갱신하고 새 10편의 수령 파일명·수령 경로·날짜·SHA-256·크기를 추가했다. 보존 원본은 현재 간증 10 + 이전 간증 4 + 감사 7 = 총 21개다.

**현재 화면과 Blob에는 새 간증 10편이 연결되어 있다.** 원본 정리 이후 `testimony` 변환을 다시 실행하고 20개 결과를 검증했다. 새 경량본 10개를 해시 기반 경로로 업로드하고 모든 초원의 공개 URL을 반영했다.

## 재생용 규격

간증은 2026-09-25 새 수령본을 2026-09-26 변환한 결과이며, 감사 합본은 2026-09-22 생성본을 유지한다.

| 종류 | preview.mp4 | full.mp4 |
|---|---|---|
| 새 간증 영상 10개 | 960×540, H.264, CRF 24, 원본의 24·29.97·30fps 및 AAC 음성 유지 | 1920×1080 8개 / 1280×720 2개(04·10), 원본 H.264/AAC 스트림을 재압축 없이 보존 |
| 감사 영상 통합본 | 960×540, H.264, CRF 24, 30fps | 2560×1440, H.264, CRF 19, 30fps, AAC 48kHz 스테레오 |

모든 파일은 MP4의 재생 정보(`moov`)를 앞에 둔 faststart 형식이다. 경량본과 고화질본의 영상 내용·시작 지점·길이를 맞춰 재생 위치를 유지하며 전환할 수 있게 했다.

감사 영상 원본은 720p·1080p·정사각형·2336×1080 영상이 섞여 있다. 가장 넓은 원본을 줄이지 않고 16:9 화면 안에 담기 위해 통합 고화질본을 2560×1440으로 만들었다. 작은 원본을 확대해도 원본에 없던 디테일이 생기는 것은 아니다. 비율이 다른 영상은 자르거나 늘이지 않고 여백을 둔다. 회전 정보는 실제 화면 방향에 반영하며, HDR 영상은 SDR BT.709로 변환한다.

졸업 예배와 간증 초원 01~10은 배포 환경에서 Vercel Blob의 경량본 URL을 사용한다. 환경 변수가 없는 로컬에서는 각각 `/video/graduation/preview.mp4`, `/video/testimony/NN/preview.mp4`를 사용한다. 로드 실패 시 준비 안내를 표시한다. 전체화면용 고화질 공개 URL과 전환 구현은 위 「전체화면 고화질」을 따른다.

### 생성 결과

| 영상 | 길이 | preview | full |
|---|---|---|---|
| 01 생사위주 초원 | 2분 11초 | 13.10 MiB | 310.99 MiB |
| 02 Onlyhim 초원 | 2분 22초 | 13.97 MiB | 336.28 MiB |
| 03 하.군.남 초원 | 2분 11초 | 14.58 MiB | 312.33 MiB |
| 04 다모인 초원 | 1분 51초 | 22.30 MiB | 25.72 MiB |
| 05 은혜둥이 팔복둥이 초원 | 2분 15초 | 13.38 MiB | 322.54 MiB |
| 06 영음 초원 | 2분 00초 | 13.14 MiB | 290.17 MiB |
| 07 감사의 언니들 초원 | 2분 30초 | 17.35 MiB | 360.95 MiB |
| 08 더드림 가조 초원 | 2분 19초 | 12.80 MiB | 330.80 MiB |
| 09 어순종팀 초원 | 2분 36초 | 17.10 MiB | 374.34 MiB |
| 10 부어부어 초원 | 1분 44초 | 8.27 MiB | 24.54 MiB |
| 졸업 예배 감사 통합본 | 12분 33초 | 65.30 MiB | 576.98 MiB |

새 간증 경량본 10개의 합계는 145.99 MiB로, 고화질본 합계 2688.67 MiB보다 약 94.6% 작다. 보존용 `full.mp4`는 로컬에 두고, 별도로 압축한 `hd.mp4`를 전체화면용으로 사용한다.

## 감사 통합본 구성

**2026-09-22 사용자 요청 반영: 원본은 `NN-그룹.mp4`로 이름을 정하고, 앞 번호를 숫자로 읽어 오름차순으로 연결한다.** 장년·청년 구분과 목록에 적은 위치는 재생 순서에 영향을 주지 않는다. 기존 1→3→4→5→2→6→7 순서를 1→2→3→4→5→6→7로 변경했다. 촬영 내용을 임의로 자르지 않고 모든 구간과 음성을 보존한다. 전환 효과·배경음·자막은 추가하지 않는다.

| 순서 | 정리된 원본 | 수령 파일명 | 원본 길이 |
|---|---|---|---|
| 1 | `01-장년.mp4` | `장년_감사영상_1.mp4` | 약 16초 |
| 2 | `02-청년.mp4` | `청년 감사영상_2.mp4` | 약 39초 |
| 3 | `03-장년.mp4` | `장년_감사영상_3.mp4` | 약 10초 |
| 4 | `04-장년.mp4` | `장년_감사영상_4.mp4` | 약 13초 |
| 5 | `05-장년.mp4` | `장년_감사영상_5.mp4` | 약 7분 37초 |
| 6 | `06-청년.mp4` | `청년_감사영상_5.mp4` | 약 1분 52초 |
| 7 | `07-장년.mp4` | `졸업 단체 사진.mp4` | 약 1분 48초 |

통합본은 약 **12분 33초**다. 프레임률을 통일하면서 각 구간 끝의 1프레임 미만 차이는 마지막 화면·무음으로 채운다. 정확한 구간 시작 시각은 변환 후 `assets/video-work/graduation-order.json`에 기록된다. 순서나 사용할 구간이 바뀌면 원본에서 다시 만들 수 있다.

2026-09-22 수령분은 파일 이름과 실제 내용이 달랐다. `졸업 단체 사진.mp4`가 감사 영상이며, `감사영상 추가된거.jpg`가 졸업 단체 사진이다. 감사 영상은 사용자가 지정한 장년 7번으로 반영하고 새 이름 규칙에 따라 `07-장년.mp4`로 보관했다. 사진 원본은 `assets/photo-originals/graduation/01.jpg`, 화면용은 `FE/public/journey/graduation/{thumb,full}/01.jpg`로 보관한다. 각 원본 보관 폴더의 `inventory.json`에는 수령 파일명과 SHA-256을 남겼다.

## 다시 만들기

FFmpeg와 FFprobe가 PATH에 있어야 한다. 사용한 FFmpeg는 8.0이며 `libx264`, `libwebp`, `zscale`, `tonemap` 필터/인코더를 사용한다. Python은 3.11 이상이며 외부 Python 패키지는 필요 없다.

Windows에서는 변환 전에 로컬 미리보기 서버와 해당 영상을 재생 중인 창을 닫는다. 재생 중인 기존 MP4가 잠기면 변환·검증을 마친 파일도 최종 경로로 교체하지 못할 수 있다.

```powershell
python scripts/prepare-videos.py --section testimony
python scripts/prepare-videos.py --section graduation
# 기존 full에서 웹 고화질본만 생성
python scripts/prepare-videos.py --section hd
# 감사 합본만 생성하거나 간증과 나누어 실행
python scripts/prepare-videos.py --section hd --hd-section graduation
# 영상 변환 없이 기존 preview에서 썸네일만 생성
python scripts/prepare-videos.py --section posters
# 전체 변환 (preview/full/hd와 썸네일)
python scripts/prepare-videos.py --section all
```

- 초원명과 감사 영상 목록은 `scripts/prepare-videos.py`의 `TESTIMONY`, `GRATITUDE`에 있다. 감사 영상은 `NN-그룹.mp4`의 앞 번호로 자동 정렬한다.
- 원본이 없는 초원은 `MISSING`으로 출력하고 건너뛴다.
- 원본 해시와 변환 인자가 같은 완료 파일은 검증 후 재사용한다.
- 원본이나 인자가 달라지면 파이프라인이 만든 기존 출력만 교체한다. 출처가 없는 기존 결과 파일은 덮어쓰지 않는다.
- 변환 중간 파일은 `assets/video-work/`에만 쓴다. 코덱·해상도·음성·길이·faststart 및 전체 구간 디코딩을 검증한 뒤 최종 경로로 이동한다.
- 변환 스크립트는 원본을 수정하거나 삭제하지 않는다. 처음 정리할 때 이동 전후 SHA-256을 비교했다.
- 썸네일도 입력 해시·인자로 재사용 여부를 결정한다. 수동 교체된 이미지는 덮어쓰지 않는다. 결과는 `assets/video-work/report-posters.json`에 기록한다. 새 체크아웃에서도 MP4 파일은 별도 확보해야 하지만 Git에 포함한 썸네일은 그대로 표시할 수 있다.
