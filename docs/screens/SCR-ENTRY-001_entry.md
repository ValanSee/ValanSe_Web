# 화면 명세서: 로그인 진입 (Entry)

## 📌 기본 정보

| 항목 | 내용 |
|---|---|
| 화면 ID | SCR-ENTRY-001 |
| 화면명 | 로그인 진입 |
| 경로 | `/entry` |
| 인증 필요 | ✗ |
| 작성일 | 2026-05-16 |
| 최종 수정일 | 2026-11-02 |

## 🎯 화면 목적

비로그인 사용자에게 서비스 소개와 카카오·Apple 로그인 진입점을 제공한다. (Apple 로그인은 App Store 심사 4.8 대응)

## 🚪 진입 경로

- 토큰 없음/만료된 상태에서 `/` 진입 시 리다이렉트
- 로그아웃 직후
- **로그인 필요 기능(마이/투표/댓글 등)에서 미인증 시** `redirect` 파라미터와 함께 리다이렉트 (`/entry?redirect=<원래경로>`)
- 외부에서 진입 (TODO: 딥링크 정책 확인)

## 📐 레이아웃 구성

1. **상단 헤더** — 뒤로가기 버튼(`Header showBackButton`). 막다른 길 방지용
2. **로고/일러스트** (TODO: 디자인 확인)
3. **서비스 소개 카피**
4. **카카오 로그인 버튼** (KakaoLoginButton) — 위에 "⚡ 30초면 회원가입 완료!" 말풍선 (꼬리가 버튼을 가리킴)
5. **Apple 로그인 버튼** (AppleLoginButton) — 카카오 버튼과 같은 크기의 검은 버튼. Android 앱 WebView 에서는 숨김
6. **로그인 없이 둘러보기** 링크 → `/`

### PC 레이아웃 (`lg` ≥ 1024px)

- 뒤로가기 헤더 숨김 (공통 GNB 로 이동)
- 최대 1080px **좌우 2단** 배치
  - **왼쪽 서비스 소개** (PC 전용): `VALANSE` 라벨 · 헤드라인 "밸런스 게임에 진심인 사람들을 위한 플랫폼" · 보조 카피 · 장점 3개 (둘 중 하나 바로 투표 / 성별·나이별 통계 / 직접 만들고 공유)
  - **오른쪽 420px 로그인 카드**: 로고 · `로그인하고 투표에 참여해 보세요` → 카카오 로그인 버튼 → Apple 로그인 버튼 → `로그인 없이 둘러보기` (모바일 슬로건은 왼쪽 소개와 겹쳐 PC 에선 숨김)
- GNB 우측 로그인 버튼은 이 화면에서 숨김 ([README 공통 레이아웃](./README.md#공통-레이아웃-pc-lg--1024px))

## 🧩 섹션별 상세 명세

### 1. KakaoLoginButton

**사용자 액션**

- 클릭 → 카카오 OAuth 인가 페이지 이동
- 인가 후 `/oauth/kakao/redirect`로 콜백

### 2. AppleLoginButton

**표시 조건**

- iOS 앱(`window.__NATIVE_APPLE_LOGIN__`) · 일반 브라우저: 표시
- Android 앱 WebView(`__ANDROID_BRIDGE_READY__` 이고 네이티브 Apple 로그인 없음): 숨김 — Apple JS 팝업이 열리지 않고, Android 는 Apple 로그인 의무가 없음

**사용자 액션**

- 클릭 → Apple 로그인 창
  - iOS 앱: 네이티브 창 (`postMessage({type:'appleLogin'})` → 앱이 `nativeAppleLogin` 이벤트로 결과 전달)
  - 브라우저: Apple JS 팝업 (Services ID `com.valanse.web`, Return URL `{origin}/oauth/apple/redirect` — Apple 에 등록된 valanse.kr · develop.valanse.kr 에서만 동작, localhost 불가)
- 성공 → 인증 값(identityToken·authorizationCode·이름)을 sessionStorage 에 넣고 `/oauth/apple/redirect?state=<복귀경로>` 로 replace
- 취소 → 아무 일 없음 / 실패 → 버튼 아래 에러 문구

### 3. 뒤로가기 버튼

**사용자 액션**

- 페이지 안 동작(좋아요·투표·신고·댓글·GNB 로그인 버튼)에서 push 로 들어왔으면 → `router.back()` 으로 원래 화면 복귀
- 그 외(보호 페이지 가드 등) → `/`(홈)으로 이동. 보호 페이지(`/my` 등)로 `router.back()` 하면 가드가 다시 `/entry`로 보내 루프가 발생하므로, 공개 홈으로 명시적으로 탈출시킨다.
- push 여부는 진입 시 `validateLoginOrigin()` 으로 판단 (push 직전 저장한 방문 기록 길이 + 1 과 현재 길이가 같을 때만 유효)

## 🔄 사용자 시나리오

**시나리오 1: 최초 로그인**

1. `/entry` 진입
2. 카카오 로그인 버튼 클릭
3. 카카오 인가 → 콜백 → 신규면 `/onboarding`, 기존이면 저장된 복귀 경로(없으면 `/`)

**시나리오 2: Apple 로그인 (iOS 앱)**

1. `/entry` 진입 → Apple로 시작하기
2. 네이티브 Apple 로그인 창 (Face ID) → `/oauth/apple/redirect` → 신규면 `/onboarding`, 기존이면 복귀 경로

**시나리오 3: 로그인 필요 기능에서 튕겨온 뒤 로그인하지 않음**

1. 마이/투표 등에서 미인증 → `/entry?redirect=<원래경로>` 진입
2. 뒤로가기 버튼 클릭 → 좋아요 등 페이지 안 동작에서 왔으면 원래 화면, 보호 페이지에서 왔으면 `/`(홈) (막다른 길 없음)

## ⚠️ 예외 상황

| 상황 | 처리 |
|---|---|
| 사용자 취소 | `/entry`로 되돌아옴, 상태 변화 없음 |
| 인가 실패 | 에러 토스트 |
| Apple 로그인 창 닫기·취소 | 상태 변화 없음 |
| Apple 로그인 실패 (Apple JS 로드 실패 등) | 버튼 아래 에러 문구 |

## 🔌 사용 API

| Method | Endpoint | 용도 |
|---|---|---|
| (OAuth) | Kakao authorize | 카카오 인가 |
| (OAuth) | Apple JS `AppleID.auth.signIn` / iOS `ASAuthorization` | Apple 인증 |

## 📎 관련 문서

- `SCR-OAUTH-001_oauth-kakao.md`
- `SCR-OAUTH-002_oauth-apple.md`
- `SCR-ONBOARDING-001_onboarding.md`
- `auth-flow.md`
