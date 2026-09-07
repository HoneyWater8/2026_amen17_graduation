---
name: reference-repo-hanaro-festival
description: 이 레포의 폴더 구조·코드 컨벤션이 그대로 베껴온 이전 프로젝트의 위치와 참고 지점
metadata:
  type: reference
---

이 프로젝트의 구조와 컨벤션은 **2026 하나로 가족 한마당 초대장**에서 가져왔습니다.

- 로컬: `C:\dev\2026_hanaro_family_festival`
- 원격: https://github.com/HoneyWater8/2026_hanaro_family_festival
- 배포: https://2026hanarofamilyfestival.vercel.app (행사 종료, 아카이브 상태)

같은 팀(하나로교회 아멘 17기)이 2026-06-03에 진행한 행사의 모바일 초대장이며, 임원회의에서 이 초대장이 좋은 반응을 얻은 것이 이번 졸업 페이지 발주로 이어졌습니다.

참고할 만한 지점:

- `README.md` — 아카이브 수준의 프로젝트 문서. 섹션별 스크린샷, 운영 통계, 측정 한계까지 기록한 형식
- `FE/src/` — 인라인 스타일 · `theme/tokens.ts` · `data/*.ts` 단일 소스 · `components/{sections,common}` 구조의 원형
- `FE-legacy/README.md` — 디자인 탐색 단계를 아카이브하는 방식
- git 히스토리 17커밋 — legacy·원본자료를 첫 커밋에 넣고, 종료 시점에 문서·스크린샷을 아카이브하는 패턴

[[prefers-mirroring-prior-project]]
