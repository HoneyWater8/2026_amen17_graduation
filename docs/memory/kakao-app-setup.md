---
name: kakao-app-setup
description: 카카오 공유가 동작하려면 도메인을 「제품 링크 관리」에 등록해야 한다. 플랫폼>Web이 아니다
metadata:
  type: project
---

카카오톡 공유(`sendScrap`)를 붙일 때 **키만으로는 동작하지 않습니다.** 콘솔에 배포 도메인을 등록해야 합니다.

| 항목 | 상태 (2026-09-11) |
|---|---|
| JavaScript 키 | Vercel Production·Preview에 `VITE_KAKAO_JS_KEY`로 등록 완료 |
| 도메인 등록 | `https://2026amen17graduation.vercel.app` 등록 완료 → 공유 정상 동작 |

**등록 위치는 「[앱] → 제품 링크 관리 → 사이트 도메인」입니다.** 「앱 설정 → 플랫폼 → Web」에도 도메인 입력란이 있어 헷갈리는데, **공유 기능이 보는 곳은 제품 링크 관리**입니다. 빠지면 공유 버튼을 눌렀을 때 `4019 잘못된 요청으로 인증에 실패`가 뜹니다.

[[reference-repo-hanaro-festival]]도 같은 문제를 겪었습니다 — 커밋 `c210c1f`의 메시지가 "카카오 디벨로퍼스 제품 링크 관리(웹 도메인 수정)"입니다. 두 프로젝트 연속으로 밟은 함정입니다.

**Why (JS키를 공개 값으로 다루는 이유):** JavaScript 키는 브라우저에서 `Kakao.init(key)`로 호출하므로 번들에 그대로 들어갑니다. 숨길 수 없고 숨길 필요도 없으며, 보호는 위 도메인 화이트리스트가 담당합니다. REST API 키·Admin 키와 다릅니다. Vercel CLI가 `VITE_` 접두사를 보고 경고하면 `--type config`(공개)로 등록하면 됩니다.

**How to apply:**

- 도메인이 바뀌면(커스텀 도메인 등) 제품 링크 관리에 **새 도메인을 추가**해야 합니다. 와일드카드는 지원하지 않으므로 프리뷰 URL이나 `http://localhost:5173`도 쓰려면 따로 등록합니다.
- 카카오는 OG 정보를 **URL 단위로 캐싱**합니다. 같은 경로에 이미지 파일만 바꾸면 옛 이미지가 나갈 수 있습니다. [공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 캐시를 초기화하거나 파일명을 바꾸세요. (2026-09-11 썸네일 교체 시에는 캐시 문제가 없었습니다.)
