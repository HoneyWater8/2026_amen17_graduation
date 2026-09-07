---
name: github-identity
description: 개인 GitHub 계정은 HoneyWater8이며, 전역 git config에는 회사 이메일이 설정되어 있어 그대로 커밋하면 계정에 연결되지 않는다
metadata:
  type: reference
---

- 개인 GitHub 계정 — **`HoneyWater8`** (https://github.com/HoneyWater8)
- 해당 계정에 연결된 커밋 이메일 — `kjyjyh8@gmail.com`

**주의:** 이 PC의 전역 `git config`는 **회사 이메일**로 설정되어 있습니다 (`git config user.email`로 확인). 그대로 커밋하면 GitHub에서 `HoneyWater8` 계정에 연결되지 않아 기여도에 잡히지 않습니다.

[[reference-repo-hanaro-festival]]에는 두 identity의 커밋이 섞여 있습니다.

**개인 레포에 올릴 때는** 레포 로컬 설정으로 개인 identity를 지정하세요.

```sh
git config --local user.name  "HoneyWater8"
git config --local user.email "kjyjyh8@gmail.com"
```

전역 설정은 회사 작업용이므로 건드리지 않습니다.
