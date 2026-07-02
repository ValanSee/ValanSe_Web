# CLAUDE.md

Claude Code(및 사람 개발자)가 이 저장소에서 작업할 때 따라야 할 규칙은 모두 [`AGENTS.md`](./AGENTS.md)에 정의되어 있습니다.

작업 시작 전 반드시 [`AGENTS.md`](./AGENTS.md)를 먼저 읽으세요.

## 빠른 인덱스

- **§0~4** 화면 명세(SCR-ID) 동기화 규칙 — 페이지 코드 변경 시 `docs/screens/*.md`도 함께 업데이트
- **§5** PR 체크리스트
- **§6** FAQ
- **§7** 관련 파일 링크
- **§8** 디자인 토큰 규칙 (`bg-primary` · `bg-brand-*` · `.typo-*` 사용, `[#HEX]` 임의값 금지 — ESLint warn)
- **§9** 코드 컨벤션 (Conventional Commits · 브랜치/PR · 컴포넌트 · JSX Style)

> 이 파일은 AGENTS.md의 얇은 참조 문서입니다. 규칙 변경은 항상 AGENTS.md 쪽을 수정하세요.
