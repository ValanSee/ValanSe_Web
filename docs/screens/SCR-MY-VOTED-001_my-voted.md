# 화면 명세서: 내가 투표한 게임 (My Voted)

## 📌 기본 정보

| 항목 | 내용 |
|---|---|
| 화면 ID | SCR-MY-VOTED-001 |
| 화면명 | 내가 투표한 게임 |
| 경로 | `/my/voted` |
| 인증 필요 | ✓ |
| 작성일 | 2026-05-16 |
| 최종 수정일 | 2026-07-13 |

## 🎯 화면 목적

내가 참여(투표)한 밸런스 게임 목록을 조회한다.

## 🚪 진입 경로

- 내 정보(`/my`) → "내가 투표한 게임"

## 📐 레이아웃 구성

1. **헤더**
2. **목록** (`HistoryPage` 컴포넌트, `mode="voted"`)

## 🧩 섹션별 상세 명세

### 1. HistoryPage (mode="voted")

**표시 데이터**

| 항목 | 출처 | 비고 |
|---|---|---|
| 게임 제목 | `GET /votes/mine/voted` | - |
| 선택지 목록 | 동일 (`options[].content`) | - |
| 선택지 이미지 썸네일 | 동일 (`options[].imageUrl`) | 있을 때만 선택지 옆 32px 썸네일 |
| 내 선택지 | (TODO) | 강조 표시 여부 확인 |
| 참여 시각 | (TODO) | - |

**사용자 액션**

- 아이템 클릭 → `/poll/[id]`
- 무한 스크롤 (TODO: 확인)

**상태별 처리**

- **로딩**: 스켈레톤
- **빈 상태**: "아직 투표한 게임이 없어요" + 탐색 CTA (TODO: 확인)

## 🔌 사용 API

| Method | Endpoint | 용도 |
|---|---|---|
| GET | `/votes/mine/voted` | 내 투표 이력 (options는 `{content, imageUrl}` 배열) |

## 📎 관련 문서

- `SCR-MY-001_my.md`
- `SCR-MY-CREATED-001_my-created.md`
- `SCR-POLL-001_poll-detail.md`
