# 화면 명세서: Apple 로그인 콜백 (OAuth Apple Redirect)

## 📌 기본 정보

| 항목 | 내용 |
|---|---|
| 화면 ID | SCR-OAUTH-002 |
| 화면명 | Apple 로그인 콜백 |
| 경로 | `/oauth/apple/redirect` |
| 인증 필요 | ✗ (인증을 만들어내는 화면) |
| 작성일 | 2026-11-02 |

## 🎯 화면 목적

로그인 화면의 Apple 버튼이 받아 둔 Apple 인증 값으로 서버에 로그인하고, 프로필 유무에 따라 복귀 경로 또는 온보딩으로 분기한다.

## 🚪 진입 경로

- `/entry` 의 AppleLoginButton 성공 후 `router.replace('/oauth/apple/redirect?state=<복귀경로>')`
- Apple Developer Services ID `com.valanse.web` 의 Return URL 로도 등록되어 있음 (Apple JS 팝업 검증용)

## 📐 레이아웃 구성

1. **Loading 인디케이터** (전체 중앙)

## 🧩 섹션별 상세 명세

### 1. Loading + 분기 로직

**처리 흐름**

1. sessionStorage `apple-login-pending` 에서 인증 값(identityToken · authorizationCode · redirectUri? · name?)을 꺼내고 바로 삭제 (URL 에 토큰을 싣지 않음)
2. `appleLoginThunk` → `POST /auth/apple/login` → 토큰 저장
3. 이후는 카카오 콜백과 동일 (`SCR-OAUTH-001` 처리 흐름 3~4, 공통 컴포넌트 `oauthRedirect.tsx`)

**사용자 액션**: 없음 (자동)

## ⚠️ 예외 상황

| 상황 | 처리 |
|---|---|
| 인증 값 없음 (직접 접근·새로고침) | `/entry`(복귀 경로 있으면 `?redirect=`)로 replace |
| 서버 로그인 실패 (서버 Apple 설정 전이면 503) | "로그인 실패" 표시 후 2초 뒤 `/entry` |
| 프로필 조회 실패 | "프로필 조회 실패" 표시 후 2초 뒤 `/entry` |

## 🔌 사용 API

| Method | Endpoint | 용도 |
|---|---|---|
| POST | `/auth/apple/login` | Apple identityToken 검증 · 신규 가입 · 서비스 토큰 발급 (ValanSe_Server#331) |
| (`fetchProfileThunk` 내부) | (TODO) | 프로필 조회 |

## 📎 관련 문서

- `SCR-ENTRY-001_entry.md`
- `SCR-OAUTH-001_oauth-kakao.md`
- `SCR-ONBOARDING-001_onboarding.md`
