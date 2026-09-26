# 2026-09-26 · 맺는 말씀 제목과 제작자 표기

> 마지막 섹션 제목을 「맺는 말씀」으로 바꾸고 참고 레포와 같은 제작자 문구를 추가한다.

## 한 일

- `G.closing.label`을 「맺는 말씀」으로 바꾸고 `Closing`의 제목도 이 데이터에서 읽도록 연결했다.
- 기존 저작권 표기 아래에 `DESIGNED & DEVELOPED BY HONEYWATER`를 추가했다. 문구는 `G.closing.credit`에서 관리한다.

## 판단한 것

- 사용자가 지정한 `C:\dev\2026_hanaro_family_festival\FE\src\components\sections\RSVP.tsx`의 실제 문구를 확인했다. `DESIGN & DEVELOP BY` 대신 참고 레포 그대로 `DESIGNED & DEVELOPED BY`를 사용한다.
- 기존 졸업장 화면의 색·폰트 토큰과 중앙 정렬을 유지한다. 참고 레포의 좁은 영문 서체와 현재 서체의 폭이 달라, 모바일에서 한 줄에 들어가도록 자간을 조정했다.

## 확인한 것

- TypeScript/Vite 빌드와 ESLint 통과.
- 320·390·460px 화면에서 제목·문구와 가로 넘침 없음을 확인했다. 제작자 문구가 고정 공유 버튼보다 위에 있어 서로 겹치지 않는다. 결과는 Git 제외된 `assets/video-work/closing-credit-browser.json`에 기록했다.
- 공개 영상 주소를 연결한 최종 빌드에서도 같은 세 화면 폭으로 확인했다. `assets/video-work/fullscreen-all-blob.json`에 함께 기록했다.
