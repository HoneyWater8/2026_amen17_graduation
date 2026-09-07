# 메모리 인덱스

이 프로젝트의 메모리는 **레포 안 `docs/memory/`** 에서 관리합니다. 홈 디렉터리가 아닙니다.
이 파일은 `CLAUDE.md`가 `@docs/memory/MEMORY.md`로 import 하므로 세션 시작 시 자동으로 로드됩니다.

## 목록

- [참고 레포 · 2026 하나로 가족 한마당](./reference-repo-hanaro-festival.md) — 구조·컨벤션의 출처. 로컬 경로 포함
- [이전 프로젝트 컨벤션 답습 선호](./prefers-mirroring-prior-project.md) — 새 구조를 발명하지 말 것
- [Vercel 배포 설정과 함정](./vercel-deploy-setup.md) — 계정·프로젝트 정보 + FE/ 하위 구조 때문에 생기는 함정 4가지
- [커밋·푸시는 지시받을 때만](./ask-before-commit-push.md) — push가 곧 공개 배포라 알아서 커밋하지 말 것
- [개인 GitHub identity](./github-identity.md) — HoneyWater8 / 전역 git config는 회사 이메일이라 주의

## 작성 규칙

메모리 1개 = 파일 1개 = 사실 1개. frontmatter를 갖춥니다.

```markdown
---
name: <파일명과 같은 kebab-case slug>
description: <한 줄 요약 — 이 메모리가 필요한 상황을 판단하는 근거>
metadata:
  type: user | feedback | project | reference
---

<사실 본문. feedback·project는 **Why:** 와 **How to apply:** 를 이어 쓴다.>
<관련 메모리는 [[slug]] 로 링크한다.>
```

| type | 담는 것 |
|---|---|
| `user` | 사용자가 누구인지 — 역할·전문성·선호 |
| `feedback` | 일하는 방식에 대한 지시 — 교정과 확인된 접근 모두. **이유를 반드시 포함** |
| `project` | 코드·git 히스토리에서 유도되지 않는 진행 중인 작업·목표·제약. 상대 날짜는 절대 날짜로 |
| `reference` | 외부 자료 포인터 — URL·대시보드·경로 |

**쓰지 말 것**

- 레포가 이미 기록하는 것 (코드 구조, 과거 수정 이력, git 히스토리, `README.md`·`docs/requirements.md`·`CLAUDE.md`에 있는 내용)
- 그 대화에서만 의미 있는 것
- 코드 컨벤션 → `CLAUDE.md`로, 무엇을 했는지 → `docs/worklog/`로

**갱신** — 저장 전에 같은 내용을 다루는 파일이 있는지 먼저 확인하고, 있으면 새로 만들지 말고 그 파일을 고칩니다. 틀린 것으로 밝혀진 메모리는 지웁니다. 파일을 추가·삭제하면 위 「목록」을 함께 갱신합니다.
