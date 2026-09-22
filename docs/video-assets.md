# 영상 자산 관리

2026-09-22 기준. 초원 이름과 순서는 사용자가 전달한 정본을 따른다.

## 디렉터리

```text
assets/
├─ video-originals/                  # 받은 원본. Git 제외, 삭제하지 않음
│  ├─ inventory.json                 # 수령 파일명 → 정리된 경로 · SHA-256 · 바이트 수
│  ├─ testimony/
│  │  ├─ 02_Onlyhim 초원.mp4
│  │  ├─ 08_더드림 가조 초원.mp4
│  │  ├─ 09_어순종팀 초원.mp4
│  │  └─ 10_부어부어 초원.mp4
│  └─ gratitude/
│     ├─ 01-장년.mp4
│     ├─ 02-청년.mp4
│     ├─ 03-장년.mp4
│     ├─ 04-장년.mp4
│     ├─ 05-장년.mp4
│     ├─ 06-청년.mp4
│     └─ 07-장년.mp4                # 2026-09-22 추가 수령분
└─ video-work/                       # 변환 중간 파일 · 로그 · 검증 결과. Git 제외

FE/public/video/                    # 재생용 파일만 배치. Git 제외
├─ testimony/
│  ├─ 02/{preview,full}.mp4
│  ├─ 08/{preview,full}.mp4
│  ├─ 09/{preview,full}.mp4
│  └─ 10/{preview,full}.mp4
└─ graduation/{preview,full}.mp4     # 감사 영상 7개를 합친 영상
```

`public`의 파일은 로컬 Vite 빌드 시 그대로 `dist`에 복사된다. 편집용 원본을 배포 결과에 섞지 않기 위해 원본은 `assets/video-originals/`에 보관한다. 원본과 재생용 영상 모두 Git에 포함하지 않는다. 배포용 경량본 5개는 Vercel Blob에 올렸으며, Git 빌드는 환경 변수의 공개 URL로 연결한다.

## 공개 배포 (Vercel Blob)

**2026-09-22 사용자의 공개 업로드 승인 후 간증 4편과 감사 합본 1편을 배포했다.** 페이지와 영상 모두 Vercel에서 제공한다. 기존 Git 배포에서 영상 경로가 404였던 원인은 `FE/public/video/`의 파일이 Git 제외 대상이라 원격 빌드에 없었기 때문이다.

| 항목 | 값 |
|---|---|
| 연결 프로젝트 | `su-heon-choi-s-projects/2026_amen17_graduation` |
| Blob 저장소 | `amen17-graduation-videos` / `store_zw4d65fKlIme6aVE` |
| 접근 · 리전 | Public · `icn1` (서울) |
| 공개 주소 기준 | `https://zw4d65fklime6ave.public.blob.vercel-storage.com/` |
| 배포 파일 | 경량본 5개, 총 104,466,463 B (99.63 MiB) |
| 적용 환경 | Production · Preview. Development는 로컬 파일 기본 경로 유지 |

다음 경로를 위 공개 주소 기준에 이어 붙인 전체 URL이 각 환경 변수의 값이다. 파일명의 12자리 값은 로컬 파일 SHA-256의 앞부분이며, 교체 시 새 경로를 사용해 기존 캐시와 구분한다.

| 환경 변수 | Blob 경로 |
|---|---|
| `VITE_TESTIMONY_2_VIDEO_URL` | `video/testimony/02/preview-3df9baf99f02.mp4` |
| `VITE_TESTIMONY_8_VIDEO_URL` | `video/testimony/08/preview-f47fcfaf6b53.mp4` |
| `VITE_TESTIMONY_9_VIDEO_URL` | `video/testimony/09/preview-1e5bec65b25d.mp4` |
| `VITE_TESTIMONY_10_VIDEO_URL` | `video/testimony/10/preview-5d3111dbf9b0.mp4` |
| `VITE_GRADUATION_VIDEO_URL` | `video/graduation/preview-2b5c48754661.mp4` |

이미 등록한 환경 변수를 유지하면 이후 Git 푸시에도 영상이 연결된다. **원본과 `full.mp4`는 업로드하지 않았다.** 현재 플레이어가 사용하는 경량본만 공개했으며, 고화질본 공개 배포는 전체화면 화질 전환 구현과 함께 진행한다.

간증·감사 영상을 통틀어 한 번에 하나만 재생한다. 새 영상의 재생이 시작되면 공통 `VideoSlot`이 다른 영상들을 일시정지하며, 재생 위치는 초기화하지 않는다.

### 영상 추가·교체

1. 아래 변환 절차로 로컬 재생본을 만들고 재생·길이·순서를 확인한다.
2. `FE/`에서 로그인된 Vercel CLI로 기존 Blob 저장소에 업로드한다. 예: `npx vercel blob put public/video/testimony/02/preview.mp4 --access public --pathname video/testimony/02/preview-<새 SHA256 앞 12자리>.mp4 --content-type video/mp4 --scope su-heon-choi-s-projects`.
3. 반환된 공개 URL에 `200`, `video/mp4`, 정확한 파일 크기, `Range` 요청의 `206` 응답을 확인한다.
4. 해당 `VITE_*_VIDEO_URL`을 Production/Preview에 등록하거나 갱신한다. 예: `npx vercel env add VITE_TESTIMONY_2_VIDEO_URL production,preview --value <공개 URL> --force --yes --no-sensitive --scope su-heon-choi-s-projects`. 미수령 초원은 기존 환경 변수 연결을 사용하므로 영상 URL만 등록하면 된다.
5. 코드·영상 관리 문서 등 변경 사항을 `main`에 커밋·푸시해 Vercel 자동 배포로 반영한다. 직접 배포 명령은 사용하지 않는다. Vite는 빌드 시 URL을 넣으므로 **환경 변수 변경만으로 기존 배포가 바뀌지는 않는다.**
6. 실제 프로덕션 페이지에서 재생과 구간 이동을 확인한다. 새 배포가 검증될 때까지 기존 Blob을 삭제하지 않는다.

CLI 인증 정보는 Git 제외된 `FE/.env.local`에서 읽는다. Vercel CLI 59.25.0의 저장소 연결은 `VERCEL_OIDC_TOKEN`과 `BLOB_READ_WRITE_TOKEN`을 내려주지만 `BLOB_STORE_ID`는 빠져 있었다. 두 OIDC 값이 모두 필요하다는 오류가 나면 `.env.local`에 `BLOB_STORE_ID="store_zw4d65fKlIme6aVE"`를 함께 지정한다. 인증 토큰은 문서·Git·프론트엔드 번들에 넣지 않으며 `VITE_` 접두사도 붙이지 않는다. `vercel env pull` 등이 `.gitignore` 끝에 `.env*`를 추가하면 기존 `!.env.example` 예외가 유지되도록 중복 줄을 제거한다.

현재 Hobby 플랜을 유지한다. 무료 포함량은 저장 공간 1GB, 월 Blob 전송량 10GB이며, 한도를 넘으면 접근이 제한될 수 있으므로 Vercel 대시보드에서 사용량을 확인한다. [Vercel Blob 사용량·요금](https://vercel.com/docs/vercel-blob/usage-and-pricing)

## 초원별 수령 현황

| 번호 | 정본 이름 | 받은 파일 | 재생 파일 디렉터리 |
|---|---|---|---|
| 01 | 생사위주 초원 | 미수령 | 미생성 |
| 02 | Onlyhim 초원 | `청년 1팀_OnlyHim.mp4` | `/video/testimony/02/` |
| 03 | 하.군.남 초원 | 미수령 | 미생성 |
| 04 | 다모인 초원 | 미수령 | 미생성 |
| 05 | 은혜둥이 팔복둥이 초원 | 미수령 | 미생성 |
| 06 | 영음 초원 | 미수령 | 미생성 |
| 07 | 감사의 언니들 초원 | 미수령 | 미생성 |
| 08 | 더드림 가조 초원 | `청년 4팀_더드림가조.mp4` | `/video/testimony/08/` |
| 09 | 어순종팀 초원 | `장년 여자_어순종.mp4` | `/video/testimony/09/` |
| 10 | 부어부어 초원 | `청년 5팀_부어부어.mp4` | `/video/testimony/10/` |

원본의 청년 팀 번호는 화면의 초원 번호와 다르다. 새 영상을 받으면 위 번호를 기준으로 `assets/video-originals/testimony/NN_정본 초원명.mp4`에 보관한다. 미수령 초원의 빈 영상·빈 디렉터리는 만들지 않는다.

## 재생용 규격

| 종류 | preview.mp4 | full.mp4 |
|---|---|---|
| 간증 영상 4개 | 960×540, H.264, CRF 24, 원본의 24fps·AAC 음성 유지 | 1280×720, 원본 H.264/AAC 스트림을 재압축 없이 보존 |
| 감사 영상 통합본 | 960×540, H.264, CRF 24, 30fps | 2560×1440, H.264, CRF 19, 30fps, AAC 48kHz 스테레오 |

모든 파일은 MP4의 재생 정보(`moov`)를 앞에 둔 faststart 형식이다. 경량본과 고화질본의 영상 내용·시작 지점·길이를 맞춰 나중에 재생 위치를 유지하며 전환할 수 있게 했다.

감사 영상 원본은 720p·1080p·정사각형·2336×1080 영상이 섞여 있다. 가장 넓은 원본을 줄이지 않고 16:9 화면 안에 담기 위해 통합 고화질본을 2560×1440으로 만들었다. 작은 원본을 확대해도 원본에 없던 디테일이 생기는 것은 아니다. 비율이 다른 영상은 자르거나 늘이지 않고 여백을 둔다. 회전 정보는 실제 화면 방향에 반영하며, HDR 영상은 SDR BT.709로 변환한다.

졸업 예배와 간증 초원 02·08·09·10은 배포 환경에서 Vercel Blob의 경량본 URL을 사용한다. 환경 변수가 없는 로컬에서는 각각 `/video/graduation/preview.mp4`, `/video/testimony/NN/preview.mp4`를 사용한다. 미수령 간증 초원에는 준비 안내를 유지한다. 고화질본 공개 업로드와 전체화면에서 고화질본으로 소스를 전환하는 기능은 후속 작업이다.

### 생성 결과

| 영상 | 길이 | preview | full |
|---|---|---|---|
| 02 Onlyhim 초원 | 2분 20초 | 10.25 MiB | 33.96 MiB |
| 08 더드림 가조 초원 | 1분 23초 | 9.40 MiB | 19.64 MiB |
| 09 어순종팀 초원 | 1분 49초 | 9.33 MiB | 26.40 MiB |
| 10 부어부어 초원 | 1분 10초 | 5.35 MiB | 16.78 MiB |
| 졸업 예배 감사 통합본 | 12분 33초 | 65.30 MiB | 576.98 MiB |

간증 경량본 4개의 합계는 34.33 MiB로 고화질본 합계 96.79 MiB보다 약 65% 작다. 감사 통합 고화질본은 해상도 통일과 H.264 변환으로 원본 합계보다 커졌으며, 졸업 예배 항목에는 경량본을 연결했다.

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

FFmpeg와 FFprobe가 PATH에 있어야 한다. 사용한 FFmpeg는 8.0이며 `libx264`, `zscale`, `tonemap` 필터/인코더를 사용한다. Python은 3.11 이상이며 외부 Python 패키지는 필요 없다.

Windows에서는 변환 전에 로컬 미리보기 서버와 해당 영상을 재생 중인 창을 닫는다. 재생 중인 기존 MP4가 잠기면 변환·검증을 마친 파일도 최종 경로로 교체하지 못할 수 있다.

```powershell
python scripts/prepare-videos.py --section testimony
python scripts/prepare-videos.py --section graduation
# 전체 변환
python scripts/prepare-videos.py --section all
```

- 초원명과 감사 영상 목록은 `scripts/prepare-videos.py`의 `TESTIMONY`, `GRATITUDE`에 있다. 감사 영상은 `NN-그룹.mp4`의 앞 번호로 자동 정렬한다.
- 원본이 없는 초원은 `MISSING`으로 출력하고 건너뛴다.
- 원본 해시와 변환 인자가 같은 완료 파일은 검증 후 재사용한다.
- 원본이나 인자가 달라지면 파이프라인이 만든 기존 출력만 교체한다. 출처가 없는 기존 결과 파일은 덮어쓰지 않는다.
- 변환 중간 파일은 `assets/video-work/`에만 쓴다. 코덱·해상도·음성·길이·faststart 및 전체 구간 디코딩을 검증한 뒤 최종 경로로 이동한다.
- 변환 스크립트는 원본을 수정하거나 삭제하지 않는다. 처음 정리할 때 이동 전후 SHA-256을 비교했다.
