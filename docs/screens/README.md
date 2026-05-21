# 화면 명세서 인덱스

이 폴더는 ValanSe Web 앱의 **모든 화면에 대한 단일 진실 공급원(Single Source of Truth)**입니다.

- 기획자: 화면의 목적과 사용자 흐름을 정의
- 디자이너: 레이아웃·디자인 토큰 협업
- 개발자: 구현 기준
- QA: 시나리오 기반 테스트 케이스 작성
- AI 에이전트: 작업 전 컨텍스트 확보 (`AGENTS.md` 참조)

## 보는 법

- **브라우저(dev only)**: `pnpm dev` 후 `/usecase/<SCR-ID>` 접속 (예: `/usecase/SCR-HOME-001`)
- **GitHub/IDE**: 이 폴더의 `.md` 파일 직접 열람

## SCR-ID 매핑

| SCR-ID | 경로 | 인증 | 파일 |
|---|---|---|---|
| SCR-AUTH-001 | `/` | ✓ | [SCR-AUTH-001_auth-root.md](./SCR-AUTH-001_auth-root.md) |
| SCR-HOME-001 | `/main` | ✓ | [SCR-HOME-001_home.md](./SCR-HOME-001_home.md) |
| SCR-CREATE-001 | `/create` | ✓ | [SCR-CREATE-001_create.md](./SCR-CREATE-001_create.md) |
| SCR-ACCOUNT-001 | `/account-deletion` | ✓ | [SCR-ACCOUNT-001_account-deletion.md](./SCR-ACCOUNT-001_account-deletion.md) |
| SCR-MY-001 | `/my` | ✓ | [SCR-MY-001_my.md](./SCR-MY-001_my.md) |
| SCR-MY-COMMENT-001 | `/my/comment` | ✓ | [SCR-MY-COMMENT-001_my-comment.md](./SCR-MY-COMMENT-001_my-comment.md) |
| SCR-MY-CREATED-001 | `/my/created` | ✓ | [SCR-MY-CREATED-001_my-created.md](./SCR-MY-CREATED-001_my-created.md) |
| SCR-MY-EDIT-001 | `/my/edit` | ✓ | [SCR-MY-EDIT-001_my-edit.md](./SCR-MY-EDIT-001_my-edit.md) |
| SCR-MY-POINT-001 | `/my/point` | ✓ | [SCR-MY-POINT-001_my-point.md](./SCR-MY-POINT-001_my-point.md) |
| SCR-MY-VOTED-001 | `/my/voted` | ✓ | [SCR-MY-VOTED-001_my-voted.md](./SCR-MY-VOTED-001_my-voted.md) |
| SCR-POLL-001 | `/poll/[id]` | ✓ | [SCR-POLL-001_poll-detail.md](./SCR-POLL-001_poll-detail.md) |
| SCR-BALANSE-001 | `/balanse` | ✗ | [SCR-BALANSE-001_balanse.md](./SCR-BALANSE-001_balanse.md) |
| SCR-ENTRY-001 | `/entry` | ✗ | [SCR-ENTRY-001_entry.md](./SCR-ENTRY-001_entry.md) |
| SCR-OAUTH-001 | `/oauth/kakao/redirect` | ✗ | [SCR-OAUTH-001_oauth-kakao.md](./SCR-OAUTH-001_oauth-kakao.md) |
| SCR-ONBOARDING-001 | `/onboarding` | ✗ | [SCR-ONBOARDING-001_onboarding.md](./SCR-ONBOARDING-001_onboarding.md) |
| SCR-PRIVACY-001 | `/privacy` | ✗ | [SCR-PRIVACY-001_privacy.md](./SCR-PRIVACY-001_privacy.md) |

## 신규 화면 추가 시

1. `_TEMPLATE.md`를 복사해서 `SCR-<도메인>-<번호>_<slug>.md`로 저장
2. 이 README의 매핑 표에 한 줄 추가
3. 화면 라우트가 추가되었다면 `src/app/...` 페이지 코드 수정과 함께 같은 PR에 포함

## 작성 규칙 (AGENTS.md와 동기화)

- 페이지 코드를 수정하면 해당 SCR-ID 문서도 같은 PR에서 업데이트
- 인증 여부, 경로, 진입 경로, 주요 사용자 액션이 바뀌면 반드시 반영
- "TODO" 섹션은 비워두지 말고 작성자가 모르는 항목임을 명시
