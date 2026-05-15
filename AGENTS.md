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
- [`.claude/skills/usecase-sync/SKILL.md`](./.claude/skills/usecase-sync/SKILL.md) — Claude Code skill (에이전트 자동 인지용)
- [`src/app/usecase/`](./src/app/usecase/) — dev-only 뷰어 라우트
- [`src/app/robots.ts`](./src/app/robots.ts) — `/usecase` SEO 차단
