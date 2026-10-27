# 화면 명세서: 행사 투표 참가자 (Event Participant)

## 📌 기본 정보

| 항목 | 내용 |
|---|---|
| 화면 ID | SCR-EVENT-001 |
| 화면명 | 행사 투표 참가자 |
| 경로 | `/event/[code]` |
| 인증 필요 | ✗ (닉네임만 입력) |
| 작성일 | 2026-10-26 |
| 관련 디자인 | 없음 (기존 카드·`VoteOptionPill` 재사용) |

## 🎯 화면 목적

MT·워크숍 같은 모임에서 참가자가 폰으로 QR 을 찍고 들어와, 사회자가 넘기는 현재 질문에 A/B 를 고르고, 공개되면 **그 방 사람들만의** 선택 비율을 본다. ValanSe 전체 투표 데이터와는 섞이지 않는다 (행사 1회 3만 원 상품의 "폰 투표" 옵션).

## 🚪 진입 경로

- 프로젝터 화면(SCR-EVENT-003)의 참가 QR / 참가 코드 링크 `https://valanse.kr/event/{code}`
- 검색 노출 없음: `robots` noindex, `robots.ts` 에서 `/event` disallow, sitemap 미등록

## 🖥️ 렌더링

- 서버 컴포넌트가 방 존재만 확인(`requireRoom`)하고 없으면 404. 이후는 클라이언트 폴링 (`GET /api/event/rooms/{code}?pid=`, 고르는 중 2초 · 대기/공개/종료 4초, 탭 숨김 시 정지)
- 참가자 식별: `getOrCreateAnonymousId()` (localStorage) + 닉네임(localStorage `valanse_event_nickname`, 12자)
- 방 상태 저장소는 Next Route Handler + Upstash Redis (`lib/event/store.ts`, Vercel 연동 env `KV_REST_API_URL`·`KV_REST_API_TOKEN`). 방 하나 = Redis 해시 하나(`meta`·`p:{pid}`·`v:{q}:{pid}`)라 폴링 1회 = 커맨드 1개(HGETALL). 환경변수가 없으면 메모리(로컬 전용)

## 📐 레이아웃 구성

1. **닉네임 입력** (입장 전)
2. **대기** (방 상태 `lobby`)
3. **질문·선택** (`live`, 비공개)
4. **결과** (`live`, 공개)
5. **종료** (`ended`)

## 🧩 섹션별 상세 명세

### 1. 닉네임 입력

- 참가 코드 표시, 닉네임 input(12자), `입장하기` → `POST /api/event/rooms/{code}/join`
- 빈 닉네임 → "닉네임을 입력해 주세요". 끝난 방(410) → 에러 문구

### 2. 대기

- "{닉네임}님, 곧 시작해요" + 현재 입장 인원. 사회자가 시작하면 폴링으로 자동 전환

### 3. 질문·선택

| 항목 | 출처 |
|---|---|
| 진행 `n / 전체` | `currentIndex + 1 / totalQuestions` |
| 질문·선택지 | `question.title`, `question.options[]` |
| 내 선택 | `myChoice` |

- 선택지 탭 → `POST .../vote` `{ pid, questionIndex, label }`. 낙관적 반영 후 실패 시 되돌림
- 공개 전까지 재선택 가능. 질문이 바뀌었으면(409) 안내 후 폴링으로 갱신

### 4. 결과

- `revealed` 이면 `EventResultBars` 로 label 별 비율·명수. "우리 n명의 선택" + 내 선택 표시

### 5. 종료

- "오늘 게임 끝!" + `/topics` 링크 (브랜딩은 여기 한 줄만)

## ✅ 수용 기준

- Given 방 코드 링크로 진입 When 닉네임 입력·입장 Then 대기 화면, 사회자 시작 후 2초 내 첫 질문 표시
- Given 질문 표시 When 선택지 탭 Then 즉시 선택 표시, 공개 전 다른 선택지로 변경 가능
- Given 사회자가 공개 When 폴링 Then 비율 막대 표시, 선택 불가
- Given 없는 코드 Then 404

## ⚠️ 예외 상황

| 상황 | 처리 |
|---|---|
| 네트워크 끊김 | 마지막 상태 유지, 에러 문구, 폴링 계속 |
| localStorage 불가 | 닉네임 저장 생략, 익명 ID 없으면 입장 버튼 비활성 |
| 방 만료(7일) | 404 |

## 🔌 사용 API (같은 앱의 Route Handler)

| Method | Endpoint | 용도 |
|---|---|---|
| GET | `/api/event/rooms/{code}?pid=` | 참가자 상태 (폴링) |
| POST | `/api/event/rooms/{code}/join` | 입장 |
| POST | `/api/event/rooms/{code}/vote` | 선택 |

## 📎 관련 문서

- `SCR-EVENT-002_event-host.md`, `SCR-EVENT-003_event-screen.md`
- `SCR-TOPICS-001_topics.md` (문의 CTA)
