---
name: usecase-sync
description: ValanSe Web에서 페이지 코드 변경 시 docs/screens의 usecase(SCR-XXX-XXX) 문서를 함께 업데이트하도록 안내한다. src/app 하위의 page.tsx 또는 src/components/pages/* 변경 작업이 시작될 때 트리거. 화면 명세서를 코드와 분리되지 않도록 유지하는 것이 목적.
---

# usecase-sync

ValanSe Web 저장소의 **화면 명세서(usecase)와 코드를 동기화**하기 위한 skill입니다.

## 이 skill을 따라야 하는 트리거

다음 작업 중 하나라도 해당되면 이 skill의 규칙을 적용하세요.

- `src/app/**/page.tsx` 수정 또는 추가
- 새 라우트 디렉토리 추가 (`src/app/(auth|unauth)/.../page.tsx`)
- `src/components/pages/<도메인>/*` 의 사용자 액션·플로우·API 호출 변경
- 인증 가드(`AuthGuard` 등) 변경으로 페이지 접근 조건이 바뀜
- 라우트 그룹 이동 (`(auth)` ↔ `(unauth)`)

## 작업 흐름

### 1. 작업 시작 시

1. 변경하려는 페이지의 SCR-ID를 `docs/screens/README.md` 매핑 표에서 찾는다
2. 해당 `docs/screens/SCR-XXX-XXX_*.md` 파일을 **먼저 읽는다**
3. 화면 목적·시나리오·예외 처리를 머릿속에 넣고 코드 변경 시작

### 2. 코드 변경 후 (PR 마무리 전)

다음 중 하나라도 바뀌었으면 **같은 PR에서** usecase 문서를 업데이트:

- 🎯 화면 목적
- 🚪 진입 경로
- 📐 레이아웃 구성 (섹션 추가/제거/순서 변경)
- 🧩 표시 데이터·사용자 액션·상태별 처리
- 🔄 사용자 시나리오
- ⚠️ 예외 상황
- 🔌 사용 API
- 📌 인증 필요 / 경로

상단 `작성일` 또는 `최종 수정일`도 그날짜로 갱신.

### 3. 신규 화면 추가 시

1. `docs/screens/_TEMPLATE.md` 복사
2. `SCR-<도메인>-<번호>_<slug>.md` 로 저장
3. `docs/screens/README.md` 매핑 표에 한 줄 추가
4. 모르는 항목은 비워두지 말고 `TODO: 확인` 으로 명시

## 업데이트 불필요한 경우

- 순수 스타일/CSS 조정 (사용자가 인지할 화면 동작 변화 없음)
- 같은 동작을 유지하는 리팩터링
- 테스트만 추가
- 변수명·내부 함수명 변경

> 위 경우라도, PR 설명에 "usecase 영향 없음"을 한 줄 명시하면 좋습니다.

## SCR-ID 빠른 매핑 (변경 자주 발생 영역)

| 코드 경로 | SCR-ID |
|---|---|
| `src/app/(auth)/page.tsx` | `SCR-AUTH-001` |
| `src/app/(auth)/main/page.tsx` / `src/components/pages/main/*` | `SCR-HOME-001` |
| `src/app/(auth)/create/page.tsx` | `SCR-CREATE-001` |
| `src/app/(auth)/poll/[id]/page.tsx` | `SCR-POLL-001` |
| `src/app/(auth)/my/page.tsx` | `SCR-MY-001` |
| `src/app/(auth)/my/edit/page.tsx` | `SCR-MY-EDIT-001` |
| `src/app/(auth)/my/created/page.tsx` | `SCR-MY-CREATED-001` |
| `src/app/(auth)/my/voted/page.tsx` | `SCR-MY-VOTED-001` |
| `src/app/(auth)/my/comment/page.tsx` | `SCR-MY-COMMENT-001` |
| `src/app/(auth)/account-deletion/page.tsx` | `SCR-ACCOUNT-001` |
| `src/app/(unauth)/balanse/page.tsx` | `SCR-BALANSE-001` |
| `src/app/(unauth)/entry/page.tsx` | `SCR-ENTRY-001` |
| `src/app/(unauth)/oauth/kakao/redirect/page.tsx` | `SCR-OAUTH-001` |
| `src/app/(unauth)/onboarding/page.tsx` | `SCR-ONBOARDING-001` |
| `src/app/(unauth)/privacy/page.tsx` | `SCR-PRIVACY-001` |

> 전체 매핑은 [`docs/screens/README.md`](../../../docs/screens/README.md) 참조.

## 응답 시 사용자에게 보고하는 방법

페이지 코드 변경 작업이 끝났을 때 사용자에게 다음을 명시적으로 알리세요.

- 어떤 SCR-ID 문서가 영향을 받았는가
- 어떤 섹션을 업데이트했는가 (또는 업데이트 불필요한 이유)
- 신규 화면이면 새 SCR-ID와 추가된 파일 경로

예시:
> "이 변경으로 `SCR-HOME-001_home.md`의 '카테고리 그리드' 섹션과 사용 API를 같이 업데이트했습니다."

## 참고 문서

- [`AGENTS.md`](../../../AGENTS.md) — 사람·에이전트 공용 작업 규약
- [`docs/screens/README.md`](../../../docs/screens/README.md) — SCR-ID 인덱스
- [`docs/screens/_TEMPLATE.md`](../../../docs/screens/_TEMPLATE.md) — 신규 작성 템플릿
