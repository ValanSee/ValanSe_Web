# AGENTS.md

이 문서는 ValanSe Web 저장소에서 작업하는 **AI 에이전트와 사람 개발자 모두**가 따라야 할 규칙을 정의합니다.

> 사람 작업자도 동일한 규칙을 따릅니다. 이 문서는 "에이전트만의 별도 규칙"이 아니라 **팀 공용 작업 규약**입니다.

---

## 0. 시작하기 전에

작업 시작 전 다음 두 가지를 먼저 확인하세요.

1. **작업 대상 화면의 SCR-ID 찾기** — `docs/screens/README.md`의 매핑 표 참조
2. **해당 `docs/screens/SCR-XXX-XXX_*.md` 파일 읽기** — 화면 목적·진입 경로·사용자 액션·API·예외 상황 파악

> 이 단계를 건너뛰면 화면 명세와 다른 동작을 구현하거나, 의도된 예외 처리를 누락하기 쉽습니다.

---

## 1. Usecase 동기화 규칙 (핵심)

**페이지 코드를 수정한 PR은 해당 SCR-ID 문서도 같은 PR에서 업데이트해야 합니다.**

### 무엇이 "페이지 수정"인가

다음 중 하나라도 해당되면 usecase 업데이트 대상입니다.

- `src/app/**/page.tsx` 직접 변경
- 해당 페이지의 라우트 추가/삭제/이동
- 페이지의 화면 목적·플로우·사용자 액션·API·예외 처리가 바뀌는 컴포넌트 변경
  (예: `src/components/pages/main/*`의 사용자 액션 변경 → `SCR-HOME-001` 업데이트)
- 인증 요구사항 변경 (auth ↔ unauth 그룹 이동, 가드 조건 변경)

### 무엇이 "업데이트"인가

다음 중 변경된 사항을 문서에 반영합니다.

- 🎯 화면 목적
- 🚪 진입 경로
- 📐 레이아웃 구성 (섹션 추가/제거)
- 🧩 섹션별 표시 데이터 / 사용자 액션 / 상태별 처리
- 🔄 사용자 시나리오
- ⚠️ 예외 상황
- 🔌 사용 API (Method, Endpoint, 용도)
- 📌 기본 정보의 인증 필요·경로

> 단순 스타일 조정, 리팩터링(같은 동작), 테스트 추가만이라면 업데이트 불필요. 다만 "어떤 동작이 어떻게 바뀌었는지"가 PR 설명으로 명확해야 합니다.

### 작성일 갱신

수정 시 해당 문서 상단의 `작성일` 또는 별도 `최종 수정일` 필드를 그날짜로 업데이트하세요.

---

## 2. 신규 화면 추가 시

1. 새 라우트(`src/app/.../page.tsx`)를 추가하기 **전** 또는 **함께**:
   - `docs/screens/_TEMPLATE.md` 복사 → `SCR-<도메인>-<번호>_<slug>.md`로 저장
   - `docs/screens/README.md`의 매핑 표에 한 줄 추가
2. 화면 목적·진입 경로·주요 사용자 액션·사용 API는 최소한 채우기 (모르는 항목은 `TODO: 확인` 으로 명시)
3. 같은 PR에 코드와 문서를 함께 포함

---

## 3. usecase 문서를 보는 방법

### A. 브라우저 (개발 환경 전용)

```bash
pnpm dev
# http://localhost:3000/usecase             → 전체 인덱스
# http://localhost:3000/usecase/SCR-HOME-001 → 개별 화면
```

> 프로덕션에서는 자동으로 404 처리됩니다. `robots.ts`에서도 `/usecase`를 차단합니다.

### B. GitHub / IDE

`docs/screens/*.md` 파일을 직접 열람. PR 리뷰 시에도 마크다운 diff로 변경 사항 확인 가능.

---

## 4. SCR-ID 매핑 (요약)

상세 매핑은 [`docs/screens/README.md`](./docs/screens/README.md) 참조.

| 도메인     | 대표 SCR-ID 예시                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------- |
| 인증 흐름  | `SCR-AUTH-001`, `SCR-ENTRY-001`, `SCR-OAUTH-001`, `SCR-ONBOARDING-001`                          |
| 메인/탐색  | `SCR-HOME-001`, `SCR-BALANSE-001`                                                               |
| 투표       | `SCR-POLL-001`, `SCR-CREATE-001`                                                                |
| 마이페이지 | `SCR-MY-001`, `SCR-MY-EDIT-001`, `SCR-MY-CREATED-001`, `SCR-MY-VOTED-001`, `SCR-MY-COMMENT-001` |
| 기타       | `SCR-ACCOUNT-001`, `SCR-PRIVACY-001`                                                            |

---

## 5. PR 체크리스트 (자가 점검용)

코드 변경 PR 작성 시 다음을 확인:

- [ ] 변경한 페이지의 SCR-ID를 알고 있다
- [ ] `docs/screens/SCR-XXX-XXX_*.md`를 (필요한 경우) 업데이트했다
- [ ] 새 화면을 추가했다면 `docs/screens/README.md` 매핑 표에 등록했다
- [ ] 인증 요구사항이 변경됐다면 문서의 "인증 필요" 필드를 반영했다
- [ ] PR 설명에 "어떤 SCR-ID 문서가 영향을 받는지" 한 줄로 표기했다

---

## 6. 자주 묻는 질문

**Q. usecase 문서와 코드가 다른 PR로 분리될 수 있나요?**
A. 원칙적으로 같은 PR에 포함. 분리는 "긴급 핫픽스" 등 예외 상황에서만 허용하고, 분리된 경우 후속 문서 PR을 즉시 제출하세요.

**Q. 작은 문구 변경에도 문서를 업데이트해야 하나요?**
A. 사용자가 인지할 변화가 있다면 업데이트 (예: 버튼 카피 변경). 내부 변수명 변경 등은 불필요.

**Q. 문서가 코드와 어긋난 걸 발견했어요.**
A. 발견한 사람이 바로잡는 것이 원칙. 그 PR에서 같이 고치거나, 별도 PR로 즉시 제출하세요.

---

## 7. 관련 파일

- [`docs/screens/`](./docs/screens/) — 화면 명세서 전체
- [`docs/screens/README.md`](./docs/screens/README.md) — SCR-ID 인덱스
- [`docs/screens/_TEMPLATE.md`](./docs/screens/_TEMPLATE.md) — 신규 작성 템플릿
- [`docs/design-system-roadmap.md`](./docs/design-system-roadmap.md) — 디자인시스템 개편 로드맵 (§10 참조)
- [`.claude/skills/usecase-sync/SKILL.md`](./.claude/skills/usecase-sync/SKILL.md) — Claude Code skill (에이전트 자동 인지용)
- [`src/app/usecase/`](./src/app/usecase/) — dev-only 뷰어 라우트
- [`src/app/robots.ts`](./src/app/robots.ts) — `/usecase` SEO 차단

---

## 8. 디자인 토큰 규칙 (apps/web)

**적용 시점**: 2026-06-30 — 토큰 레이어(1단계) 적용 완료. 페이지 컴포넌트 하드코딩 대치환(2단계)은 별도.

Figma 사양(Yellow/Violet/Gray/Red/Black 팔레트, Heading/Title/Body/Label 타이포 스케일, 4·8pt 스페이싱)이 코드 토큰으로 확정되어 있습니다. Storybook `Design/Colors`, `Design/Typography`, `Design/Spacing` 스토리에서 실제 값을 시각 확인하세요.

### 컬러 사용 우선순위

새 코드에서는 아래 순서로만 컬러를 사용하세요.

1. **shadcn 시멘틱 클래스** — `bg-primary`, `text-foreground`, `bg-destructive`, `border-border`, `bg-secondary`, `text-muted-foreground` 등
   - 역할이 시멘틱 이름과 명확히 대응되는 경우 최우선.
2. **브랜드 팔레트 클래스** — `bg-brand-violet-300`, `text-brand-gray-200`, `border-brand-red-100`, `bg-brand-black` 등
   - 시멘틱 매핑에 없는 특정 스와치가 필요할 때.
3. **임의 hex(`[#XXXXXX]`)는 신규 코드에서 금지**
   - 예외: 알파 조절(`bg-black/20`, `text-white/70`) 및 실제 이미지/그림자 등 팔레트로 표현 불가한 경우 한정.

### 타이포그래피

- 새 컴포넌트에서 `text-[Npx]`, `font-[숫자]`, `leading-[…]`, `tracking-[…]` **임의값 조합 금지**.
- 반드시 `.typo-*` 클래스를 사용하세요. 정의는 `apps/web/src/app/globals.css`.
  - `.typo-heading-01` ~ `.typo-heading-06`
  - `.typo-title-01` ~ `.typo-title-04`
  - `.typo-body-a-01`, `.typo-body-a-02`
  - `.typo-body-b-01` ~ `.typo-body-b-03`
  - `.typo-body-c-01` ~ `.typo-body-c-03`
  - `.typo-label-01` ~ `.typo-label-03`
- 폰트 패밀리는 `<body>`에 전역 적용됩니다. 개별 컴포넌트에 `font-pretendard`를 다시 붙이지 마세요.

### 스페이싱

- Tailwind 기본 스페이싱 사용 가능. 디자인 토큰 alias는 `p-ds-*`, `gap-ds-*`, `w-ds-*` 등으로 노출됩니다 (`ds-1`=4, `ds-2`=8, `ds-3`=12, `ds-4`=16, `ds-5`=20, `ds-6`=24, `ds-8`=32, `ds-10`=40).

### 레거시 하드코딩 처리 방침

기존 페이지 컴포넌트의 `[#4D7298]`, `[#8E8E8E]`, `text-[18px] font-[700]` 등은 별도 마이그레이션 단계(2단계)에서 일괄 교체 예정입니다. **레거시 패턴을 참고해 새 코드를 작성하지 마세요.** `apps/web/src/components/ui/button.tsx`가 새 토큰 사용의 참조 예시입니다.

### PR 체크리스트 (§5에 추가로 확인)

- [ ] 신규/수정 컴포넌트에 `[#HEX]` 임의값이 없다 (알파 조절 예외 제외)
- [ ] 신규/수정 컴포넌트에 `text-[Npx] font-[숫자]` 임의값 조합이 없다
- [ ] 타이포는 `.typo-*` 클래스를 사용했다
- [ ] `font-pretendard`를 개별 컴포넌트에 재선언하지 않았다

### 자동 검사

ESLint `no-restricted-syntax` 규칙이 문자열/템플릿 리터럴에서 `#RGB` / `#RRGGBB` / `#RRGGBBAA` hex를 감지해 **warn**을 띄웁니다. 신규 코드에서 경고가 나오면 브랜드 토큰으로 교체하세요.

- 예외 파일: `apps/web/src/components/ui/design-system/**/*.stories.{ts,tsx}` — 팔레트 hex 표기 자체가 콘텐츠라 제외됨.

---

## 9. 코드 컨벤션

### Commit Convention

컨벤셔널 커밋을 따릅니다.

```
type(scope): description
```

| Type       | 설명                                    |
| ---------- | --------------------------------------- |
| `feat`     | 새로운 기능                             |
| `fix`      | 버그 수정                               |
| `docs`     | 문서 변경                               |
| `style`    | 포맷팅, 세미콜론 등 (코드 변경 없음)    |
| `refactor` | 리팩토링 (기능 변경 없음)               |
| `perf`     | 성능 개선                               |
| `test`     | 테스트 추가/수정                        |
| `build`    | 빌드 시스템, 의존성 변경                |
| `ci`       | CI 설정 변경                            |
| `chore`    | 기타 잡무                               |
| `revert`   | 이전 커밋 되돌리기                      |

`scope`는 선택사항. 변경 범위를 나타냅니다 (예: `auth`, `api`, `ui`).

```
feat(auth): 로그인 페이지 추가
fix(api): 응답 파싱 에러 수정
chore: eslint 설정 업데이트
refactor(matches): 경기 목록 컴포넌트 분리
```

### Branch & PR Convention

```
<type>/<short-description>
```

```
feat/login-page
fix/api-response-parsing
refactor/match-list
```

### Component Convention

- **공통 컴포넌트 우선**: `src/components/common/`에 같은 역할의 컴포넌트가 있으면 재사용.
- **페이지 코로케이션**: 처음엔 무조건 페이지 폴더 안에 둡니다. 두 페이지 이상에서 쓰이게 되면 그때 `common/`으로 승격.
- **shadcn**: `src/components/ui/`는 빌딩 블록. 페이지에서는 `common/` 래퍼를 통해 import.

### JSX Style

컴포넌트 안에서 JSX 조각을 **이름 있는 변수로 분리**한 뒤 `return`에서 조립합니다.

```tsx
export default function Page() {
  const header = <h1>제목</h1>
  const content = <main>...</main>
  const footer = <footer>...</footer>

  return (
    <div>
      {header}
      {content}
      {footer}
    </div>
  )
}
```

---

## 10. 디자인시스템 개편 로드맵

디자인 대개편의 컴포넌트 단위 계획은 별도 문서에서 관리합니다.

- 📄 [`docs/design-system-roadmap.md`](./docs/design-system-roadmap.md)

포함 내용:

- Figma 카탈로그(노드 `123:500`) 기반 컴포넌트 매트릭스 (Button · TextField · Chip · Badge · Header · Tab · Dropdown · Modal · Vote Card 등)
- 레이어 구조 (`ui/` → `common/` → `pages/`) 및 CVA 사용 규칙
- PR 단위(P0~P8) · 브랜치 컨벤션 · Storybook 요구사항
- 실행 순서 및 명시적 스코프 제외 항목

**신규 UI 컴포넌트를 만들 땐 이 문서의 매트릭스에 해당 컴포넌트가 이미 있는지 먼저 확인하세요.** 있으면 해당 PR 스코프에서, 없으면 문서를 먼저 업데이트한 뒤 코드에 착수합니다.
