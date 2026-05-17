# 화면 명세서: 카카오 OAuth 콜백 (OAuth Kakao Redirect)

## 📌 기본 정보

| 항목 | 내용 |
|---|---|
| 화면 ID | SCR-OAUTH-001 |
| 화면명 | 카카오 OAuth 콜백 |
| 경로 | `/oauth/kakao/redirect` |
| 인증 필요 | ✗ (인증을 만들어내는 화면) |
| 작성일 | 2026-05-16 |

## 🎯 화면 목적

카카오 인가 코드를 받아 서버에 로그인 토큰을 요청하고, 프로필 유무에 따라 메인 또는 온보딩으로 분기한다.

## 🚪 진입 경로

- 카카오 OAuth 인가 후 자동 리다이렉트 (`?code=...`)

## 📐 레이아웃 구성

1. **Loading 인디케이터** (전체 중앙)

## 🧩 섹션별 상세 명세

### 1. Loading + 분기 로직

**처리 흐름**

1. URL의 `code` 추출
2. `loginThunk` → 토큰 저장
3. `fetchProfileThunk` → 프로필 조회
4. 분기:
   - 프로필 있음 → `/main`
   - 프로필 없음 (신규) → `/onboarding`
   - 실패 → `/entry`

**사용자 액션**: 없음 (자동)

## ⚠️ 예외 상황

| 상황 | 처리 |
|---|---|
| `code` 없음 | `/entry`로 이동 + 토스트 |
| 서버 로그인 실패 | `/entry`로 이동 + 에러 메시지 |
| 프로필 조회 실패 | (TODO: 정책 확인) |

## 🔌 사용 API

| Method | Endpoint | 용도 |
|---|---|---|
| (`loginThunk` 내부) | (TODO) | 카카오 인가 코드 → 서비스 토큰 교환 |
| (`fetchProfileThunk` 내부) | (TODO) | 프로필 조회 |

## 📎 관련 문서

- `SCR-ENTRY-001_entry.md`
- `SCR-ONBOARDING-001_onboarding.md`
- `auth-flow.md`
