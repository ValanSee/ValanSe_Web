# 화면 명세서: 칭호 (My Titles)

## 📌 기본 정보

| 항목 | 내용 |
|---|---|
| 화면 ID | SCR-MY-TITLE-001 |
| 화면명 | 칭호 |
| 경로 | `/my/titles` |
| 인증 필요 | ✓ |
| 작성일 | 2026-11-25 |
| 관련 디자인 | TODO: 확인 |

## 🎯 화면 목적

보유한 칭호 중 대표 칭호를 장착하고, 잠긴 칭호 중 포인트 구매형 칭호를 포인트로 구매한다.

## 🚪 진입 경로

- 내 정보(`/my`) → "내 칭호" 카드 클릭
- 내 포인트(`/my/point`) → "칭호 상점 가기" 버튼 클릭

## 📐 레이아웃 구성

화면은 위에서부터 다음 4개 섹션으로 구성된다. (`components/pages/my/titles/titlesPage.tsx`)

1. **헤더** — 제목 "칭호", 뒤로가기 → `/my`
2. **현재 장착 칭호** (`TitleCurrentSection`) — 장착 칭호 + 보유 포인트
3. **보유 / 잠금 탭** (`TitleTabs`) — 탭 라벨에 개수 표시 (`보유 N` · `잠금 N`)
4. **칭호 목록** (`TitleCard` 반복) + 장착 확인 모달(`TitleEquipModal`) · 구매 확인 모달(`TitlePurchaseModal`)

## 🧩 섹션별 상세 명세

### 1. 현재 장착 칭호

**표시 데이터**

| 항목 | 출처 | 비고 |
|---|---|---|
| 장착 칭호 (등급 칩 + 이름) | `GET /member/titles` 의 `defaultTitles` + `ownedTitles` 중 `equipped: true` | 없으면 "장착된 칭호가 없어요" |
| 보유 포인트 | `GET /member/point-history` 의 `pointHistory[0].remainingPoint` | 내역이 없으면 0 |

### 2. 보유 / 잠금 탭

**사용자 액션**

- "보유" 탭 → `defaultTitles` + `ownedTitles` 목록 (기본 선택)
- "잠금" 탭 → `lockedTitles` 목록

**상태별 처리**

- **탭 전환 (모바일)**: 목록(`ul`)만 `key={tab}` 으로 다시 마운트돼 탭 순서(보유=0, 잠금=1) 방향으로 슬라이드 + 페이드(250ms). 보유 → 잠금은 오른쪽에서, 잠금 → 보유는 왼쪽에서 들어온다 (`useSlideDirection`). 첫 진입은 애니메이션 없음
- **동작 줄이기 (`prefers-reduced-motion`)**: 슬라이드 없이 페이드만 (`motion-reduce:animate-fade-only`)
- **PC (`lg`+)**: 목록 슬라이드 · 페이드 없음 (`lg:!animate-none`), 기존처럼 바로 바뀜

### 3. 칭호 목록 (TitleCard)

**표시 데이터**

| 항목 | 출처 | 비고 |
|---|---|---|
| 등급 칩 · 칭호 이름 · 설명 | `Title.tier` · `title` · `description` | 등급 라벨은 `tierStyle.ts` `TIER_LABEL` |
| 잠금 사유 | `Title.lockReason` | 잠금 칭호일 때만, 빨간 글씨 |
| 획득 조건 | `Title.requirementText` | 보유 칭호일 때만 |

**사용자 액션 (오른쪽 버튼)**

| 칭호 상태 | 버튼 | 동작 |
|---|---|---|
| 장착 중 | "장착중" (비활성) | 없음 |
| 보유 · 미장착 | "장착" | 장착 확인 모달 |
| 잠금 · 포인트 구매형 (`acquisitionType: POINT_PURCHASE`) | "{price}P 구매" | 구매 확인 모달 |
| 잠금 · 그 외 획득형 | "잠금" (비활성) | 없음 |

**상태별 처리**

- **로딩**: 칭호 목록(`titles`)을 받기 전에는 전체 화면 로고 로더(`Loading`)
- **빈 상태**: 보유 탭 "보유한 칭호가 없어요", 잠금 탭 "잠금 칭호가 없어요"

### 4. 장착 · 구매 모달

- **장착** — "대표 칭호로 장착할까요?" → 장착 확인 시 `POST /member/titles/{titleId}/equip`. 성공하면 store 의 기존 장착을 해제하고 새 칭호를 장착 상태로 반영
- **구매** — "칭호를 구매할까요?" 가격 · 보유 포인트 · 구매 후 잔액 표시. 포인트가 부족하면 "잔액이 부족해요. 활동으로 포인트를 모아주세요." 안내와 함께 구매 버튼을 눌러도 요청하지 않음. 구매 확인 시 `POST /member/titles/{titleId}/purchase` → 성공하면 칭호를 잠금 → 보유 목록으로 옮기고 포인트 내역을 다시 조회해 잔액 갱신
- 처리 중에는 버튼 라벨이 "장착 중…" / "구매 중…" 이고 모달을 닫을 수 없음

## 🔄 사용자 시나리오

**시나리오 1: 대표 칭호 바꾸기**

1. `/my` 에서 "내 칭호" 클릭 → `/my/titles`
2. 보유 탭에서 원하는 칭호의 "장착" 클릭 → 모달에서 "장착"
3. 상단 현재 장착 칭호와 목록의 "장착중" 표시가 바뀐다

**시나리오 2: 포인트로 칭호 구매**

1. "잠금" 탭 선택 → 목록이 오른쪽에서 슬라이드돼 들어옴 (모바일)
2. 구매형 칭호의 "{price}P 구매" 클릭 → 모달에서 "구매"
3. 칭호가 보유 탭으로 옮겨지고, 상단 보유 포인트가 줄어든다

## ✅ 수용 기준 (Acceptance Criteria)

- Given 모바일에서 보유 탭을 보고 있을 때
  When 잠금 탭을 누르면
  Then 목록만 오른쪽에서 슬라이드 + 페이드로 바뀌고, 상단 섹션 · 탭바는 움직이지 않는다
- Given 동작 줄이기 설정이 켜져 있을 때
  When 탭을 바꾸면
  Then 슬라이드 없이 페이드만 적용된다
- Given PC(`lg`+) 화면일 때
  When 탭을 바꾸면
  Then 목록이 애니메이션 없이 바로 바뀐다
- Given 보유 포인트가 칭호 가격보다 적을 때
  When 구매 모달에서 "구매"를 누르면
  Then 구매 요청을 보내지 않는다

## ⚠️ 예외 상황

| 상황 | 처리 |
|---|---|
| 칭호 · 포인트 내역 조회 실패 (비로그인 · 토큰 만료 등) | 로그인 화면으로 이동 (`entryHrefWithRedirect('/my/titles')`, 로그인 후 복귀) |
| 장착 · 구매 실패 | `alert('처리에 실패했어요. 잠시 후 다시 시도해 주세요.')`, 모달은 열린 채 유지 |

## 🔌 사용 API

| Method | Endpoint | 용도 |
|---|---|---|
| GET | `/member/titles` | 기본 · 보유 · 잠금 칭호 목록 (`defaultTitles` · `ownedTitles` · `lockedTitles`) |
| GET | `/member/point-history?size=50` | 보유 포인트 (최신 항목의 `remainingPoint`) |
| POST | `/member/titles/{titleId}/equip` | 대표 칭호 장착 |
| POST | `/member/titles/{titleId}/purchase` | 포인트로 칭호 구매 |

## 🎨 디자인 토큰 참조

- 섹션 구분: `bg-brand-gray-50` (높이 8px 띠)
- 카드 구분선: `border-brand-gray-75`
- 포인트 강조: `text-primary`, 잠금 사유: `text-destructive`

## 📎 관련 문서

- 진입 출처: `SCR-MY-001_my.md`, `SCR-MY-POINT-001_my-point.md`
- 탭 전환 공통 규칙: `README.md` "공통: 탭 전환 슬라이드 · 하단 탭바 (모바일)"
- 설계: `docs/superpowers/specs/2026-11-22-tab-slide-transition-design.md`
