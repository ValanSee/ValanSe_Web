# 화면 명세서: 행사 투표 프로젝터 (Event Screen)

## 📌 기본 정보

| 항목 | 내용 |
|---|---|
| 화면 ID | SCR-EVENT-003 |
| 화면명 | 행사 투표 프로젝터 |
| 경로 | `/event/[code]/screen` |
| 인증 필요 | ✗ |
| 작성일 | 2026-10-26 |
| 관련 디자인 | 없음 (PPT 생성기 `valanse-event-deck` 와 같은 톤: 보라 V300 · 노랑 Y300) |

## 🎯 화면 목적

프로젝터·TV 에 띄우는 화면. 대기 중엔 참가 QR 과 코드, 진행 중엔 질문과 선택지를 크게, 공개되면 이 방 사람들만의 비율 막대를 보여준다. 조작은 없고 사회자 화면(SCR-EVENT-002)을 따라간다.

## 🚪 진입 경로

- 방 생성 응답의 `screenUrl`. 사회자가 프로젝터 연결 노트북 브라우저에서 연다

## 🖥️ 렌더링

- `ChromeGate`(`components/_shared/nav/chromeGate.tsx`)가 `/event/{code}/screen` 경로에서 PC GNB·푸터를 숨겨 전체 화면으로 쓴다
- 참가 QR 은 클라이언트에서 `qrcode` 로 생성 (`https://valanse.kr/event/{code}`)
- 2초 폴링 (`GET /api/event/rooms/{code}`, pid 없음)

## 📐 레이아웃 구성

1. **대기** (`lobby`, 보라 배경): 방 이름 · "폰으로 QR 을 찍고 닉네임만" · 참가 코드(노랑) · 입장 인원 · 우측 QR 카드
2. **질문** (`live`, 비공개): `Q{n}` 배지 · `n / 전체 · 응답 a / b명` · 질문 제목 · 선택지 카드 (A 보라, 나머지 연보라; 3~4지선다는 4열)
3. **결과** (`live`, 공개): `EventResultBars large` — 1위 보라, 비율·명수 · "소수파부터 이유 한마디"
4. **종료** (`ended`, 보라 배경): "오늘 제일 갈린 질문은?"
5. 하단 `valanse.kr` 한 줄 (브랜딩은 이것뿐)

## ✅ 수용 기준

- Given 대기 중 When 참가자 입장 Then 2초 내 입장 인원 갱신
- Given 사회자 공개 Then 2초 내 비율 막대, 1위 강조
- Given 1024px 이상 Then GNB·푸터 없이 전체 화면

## ⚠️ 예외 상황

| 상황 | 처리 |
|---|---|
| QR 생성 실패 | 링크 텍스트로 대체 |
| 네트워크 끊김 | 마지막 화면 유지, 상단에 에러 문구 없음(프로젝터라 방해 최소화), 폴링 계속 |

## 🔌 사용 API

| Method | Endpoint | 용도 |
|---|---|---|
| GET | `/api/event/rooms/{code}` | 공개 상태 (폴링) |

## 📎 관련 문서

- `SCR-EVENT-001_event-participant.md`, `SCR-EVENT-002_event-host.md`
- 방 생성: `POST /api/event/rooms` (헤더 `x-admin-key` = `EVENT_ADMIN_KEY`, body `{ name, questions[] }`) — 관리자 전용, 화면 없음. PPT 생성기 폴더의 `create-room.js` 참고
