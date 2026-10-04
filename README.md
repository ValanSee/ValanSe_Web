# ValanSe Web

밸런스게임 투표 공유 서비스 [ValanSe](https://valanse.kr)의 웹 모노레포입니다.

| 패키지 | 설명 |
|---|---|
| `apps/web` (`valanse-web`) | 서비스 웹 (Next.js) |
| `apps/cms` (`valanse-cms`) | 운영용 CMS |

## Getting Started

- node 20
- pnpm 10.16.1

```bash
pnpm install
cp apps/web/.env.example apps/web/.env   # 값 채우기

pnpm dev:web   # 웹만
pnpm dev:cms   # CMS만
pnpm dev       # 전체
```

[http://localhost:3000](http://localhost:3000)에서 확인합니다.

```bash
pnpm lint
pnpm build
```

## 브랜치 & 배포

트렁크 기반 개발을 사용합니다. `main`이 유일한 트렁크입니다.

| 브랜치 | 역할 | 배포 |
|---|---|---|
| `main` | 트렁크. 모든 작업이 PR로 들어오는 곳 | 프로덕션 ([valanse.kr](https://valanse.kr)) |
| `develop` | 테스트 서버 배포 전용. `main`으로 머지하지 않음 | 테스트 서버 |
| `<type>/<short-description>` | 작업 브랜치 (`feat/login-page`, `fix/api-response-parsing`) | — |

### 작업 흐름

```bash
# 1. main에서 작업 브랜치 생성
git switch main && git pull
git switch -c fix/some-bug

# 2. (선택) 테스트 서버에 올려서 확인
git switch develop && git pull
git merge fix/some-bug
git push origin develop

# 3. main으로 PR → 리뷰 → 머지 = 프로덕션 배포
gh pr create --base main
```

- PR은 항상 `main` 대상입니다. 같은 작업을 `-main` / `-develop` 브랜치로 나눠 PR 두 번 올리지 않습니다.
- `develop`은 테스트용이라 여러 작업 브랜치가 섞일 수 있습니다. `develop` → `main` 머지는 하지 않습니다.
- `develop`이 꼬이면 `main` 기준으로 리셋합니다.

  ```bash
  git switch develop
  git reset --hard origin/main
  git push --force-with-lease origin develop
  ```

- 브랜치 보호 / 룰셋은 사용하지 않습니다. `main` 대상 PR에서 lint CI(`.github/workflows/lint.yml`)가 돌아갑니다.

커밋·코드 컨벤션은 [`AGENTS.md`](./AGENTS.md)를 참고하세요.
