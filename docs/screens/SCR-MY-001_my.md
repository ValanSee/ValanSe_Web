# 화면 명세서: 내 정보 (My)

## 📌 기본 정보

| 항목 | 내용 |
|---|---|
| 화면 ID | SCR-MY-001 |
| 화면명 | 내 정보 |
| 경로 | `/my` |
| 인증 필요 | ✓ |
| 작성일 | 2026-05-16 |
| 최종 수정일 | 2026-05-19 |

## 🎯 화면 목적

내 프로필과 활동 이력(작성/투표/댓글), 계정 관리 진입점을 한 화면에 노출한다.

## 🚪 진입 경로

- 하단 네비게이션 "내 정보" 탭

## 📐 레이아웃 구성

1. **프로필 섹션** (MyProfileSection: 프로필 + 연결된 계정 + 회원 정보 + **내 포인트 진입**)
2. **활동 섹션** (MyActivitySection: 작성/투표/댓글 카운트 + 이동)
3. **계정 관리 섹션** (AccountControlSection: 로그아웃 / 계정 삭제)
4. **하단 네비게이션 바**

## 🧩 섹션별 상세 명세

### 1. 프로필 섹션

**표시 데이터**

| 항목 | 출처 | 비고 |
|---|---|---|
| 닉네임 | `fetchMypageDataThunk` | - |
| 프로필 이미지 | 동일 | - |
| 성별/나이/MBTI | 동일 | TODO: 표시 여부 확인 |

**사용자 액션**: 클릭 → `/my/edit` 이동

### 1-1. 내 포인트 진입 영역 (프로필 섹션 내)

**표시 데이터**

| 항목 | 출처 | 비고 |
|---|---|---|
| 현재 잔액 | `state.member.pointHistory[0].remainingPoint` | 캐시가 없으면 진입 시 `fetchPointHistoryThunk` 자동 호출 |

**사용자 액션**: 클릭 → `/my/point` 이동 (SCR-MY-POINT-001)

**상태별 처리**

- 잔액 fetch 전 / 빈 배열 / 실패: `-P` 표시 (silent fallback)

### 2. 활동 섹션

| 항목 | 클릭 시 이동 |
|---|---|
| 내가 만든 게임 | `/my/created` |
| 내가 투표한 게임 | `/my/voted` |
| 내 댓글 | `/my/comment` |

### 3. 계정 관리

- 로그아웃 (TODO: 확인)
- 계정 삭제 → `/account-deletion`

## 🔄 사용자 시나리오

**시나리오 1: 프로필 수정**

1. `/my` 진입
2. 프로필 영역 클릭
3. `/my/edit` 이동

## ⚠️ 예외 상황

| 상황 | 처리 |
|---|---|
| 마이페이지 데이터 로딩 실패 | 스켈레톤 → 에러 메시지 + 재시도 |

## 🔌 사용 API

| Method | Endpoint | 용도 |
|---|---|---|
| GET | `/member/mypage` (via `fetchMypageDataThunk`) | 마이페이지 종합 데이터 |
| GET | `/member/point-history` (via `fetchPointHistoryThunk`) | 잔액 표시용. 진입 시 캐시 없으면 호출 (silent) |

## 📎 관련 문서

- `SCR-MY-EDIT-001_my-edit.md`
- `SCR-MY-CREATED-001_my-created.md`
- `SCR-MY-VOTED-001_my-voted.md`
- `SCR-MY-COMMENT-001_my-comment.md`
- `SCR-MY-POINT-001_my-point.md`
- `SCR-ACCOUNT-001_account-deletion.md`
