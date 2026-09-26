# 2026-09-26 · Pro 전환 후 실배포 상태 점검

> 사용자가 영상 전송량 무료 한도 초과에 따른 장애와 유료 전환을 알려 현재 서비스를 점검했다.

## 확인한 것

- 한국 시간 2026-09-26 21시대 확인. 실배포 도메인은 기존 main 커밋 `5854cbe`의 프로덕션 배포 `dpl_2tFeoVjvkYG2gUpMppkAcx3i9oma`를 가리키며 `READY`다.
- 팀 API에서 Pro·active, `softBlock=null`을 확인했다. 요금제 변경은 사용자가 직접 수행했다.
- 페이지 `200`, 경량본·고화질본 22개 모두 `HEAD 200` 및 1KB 부분 요청 `206`을 확인했다. 간증 1번과 감사 합본 고화질 파일은 시작·중간 구간 64KB가 로컬 파일과 일치했다.
- 첫 확인에서 감사 합본 고화질의 부분 응답 전체 크기 헤더가 달랐고 브라우저 고화질 전환도 한 차례 시간 초과됐다. 이후 재확인에서는 헤더가 정상이며, 간증 1번·감사 합본 모두 실제 재생·전체화면 전환·재생 위치를 유지한 복귀가 통과했다. 현재 지속적인 영상 접근 차단은 재현하지 못했다.
- 팀 집계 Blob Data Transfer는 조회 시점 약 14.61GB였다. 당시 장애 응답 로그까지 확보한 것은 아니므로 과거 장애 원인을 독립적으로 확정하지 않는다. Hobby의 10GB 전송 한도와 초과 시 접근 제한은 [공식 문서](https://vercel.com/docs/vercel-blob/usage-and-pricing)에 명시되어 있다.

## 남긴 것

- 앱 코드·배포·요금제·환경 변수는 변경하지 않았다. 현재 Pro 상태를 메모리에 반영했다.
- 사용량과 공개 파일 응답, 브라우저 점검 결과는 Git 제외된 `assets/video-work/usage-after-pro-upgrade.json`, `public-video-status-after-upgrade.json`, `playback-after-pro-upgrade.json`에 기록했다.
