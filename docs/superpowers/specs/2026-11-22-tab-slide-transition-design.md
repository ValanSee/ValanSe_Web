# 탭 이동 슬라이드 전환 설계

- 날짜: 2026-11-22
- 대상: `apps/web` (모바일 웹 · 앱 WebView). PC(`lg` 이상)는 현재 동작 유지
- 브랜치: `feat/tab-slide-transition` (base `main`)

## 1. 왜 하는가

탭을 옮길 때 화면이 "앱처럼" 이어지지 않고 끊긴다.

- 하단 탭바(`BottomNavBar`)가 각 페이지 안에 들어 있어서, 페이지가 바뀌면 탭바도 같이 사라졌다 다시 그려진다.
- 라우트 그룹의 `loading.tsx` 가 전체 화면 로고 로더(`components/_shared/loading.tsx`)를 띄워, 이동 중 탭바까지 가려진다.
- 새 화면은 방향 없이 페이드인만 된다(`app/template.tsx`). transform 을 피한 이유는 탭바가 페이지 안의 fixed 요소라 흔들리기 때문이었다.

사용자 요청(그대로): "탭 이동시 loader 뜨는게 좀 이상. 바텀탭은 유지되고, 오른쪽탭이면 왼쪽으로 슬라이드 이런식으로 자연스럽게", 로딩 중에는 "스켈레톤", 화면 안 탭도 "같은 방향 슬라이드".

## 2. 목표

1. **하단 탭바 고정** — 홈 · 밸런스 · 만들기 · 마이 사이를 오갈 때 탭바는 한 번도 사라지거나 깜빡이지 않는다.
2. **방향 슬라이드 (하단 탭)** — `NAV_ITEMS` 순서상 오른쪽 탭으로 가면 새 본문이 오른쪽에서 들어오고(왼쪽으로 미끄러짐), 왼쪽 탭으로 가면 왼쪽에서 들어온다.
3. **로고 로더 제거 (탭 이동 한정)** — 탭 이동 중 데이터가 없으면 본문 자리에 그 탭 모양의 스켈레톤을 보여준다.
4. **화면 안 탭도 같은 규칙** — 아래 3곳에서 탭바 아래 내용만 같은 방향 규칙으로 슬라이드한다. 헤더·탭바는 움직이지 않는다.
   - 밸런스 카테고리 탭 `components/pages/balanse/balansePage.tsx`
   - 마이 기록 탭 `components/pages/my/_shared/historyPage.tsx`
   - 칭호 탭 `components/pages/my/titles/titleTabs.tsx` (부모 `titlesPage.tsx`)

## 3. 하지 않는 것 (non-goals)

- 손가락 스와이프로 탭 넘기기
- 나가는 화면의 퇴장 애니메이션(이전 화면이 반대로 밀려나가는 것). 들어오는 화면만 움직인다 — 아래 4.2 참고
- 일반 페이지 이동(투표 상세, 설정 하위 등)의 전환 방식 변경 — 지금처럼 페이드
- 앱 첫 진입 · OAuth 리다이렉트 · 온보딩의 로고 로더(스플래시 역할) 변경
- PC 레이아웃 변경

## 4. 정해진 방식

### 4.1 하단 탭바를 레이아웃으로 올림

- `<BottomNavBar />` 를 루트 레이아웃(`app/layout.tsx`)에서 **한 번만** 렌더한다. 현재 이를 직접 렌더하는 7개 페이지(`mainPage`, `balansePage`, `createPage`, `myPage`, `aboutPage`, `topicsPage`, `mtPptPage`)에서는 제거한다.
- 탭바는 **지금 탭바가 보이던 경로에서만** 보인다: `/`, `/balanse`, `/create`, `/my`, `/about`, `/topics`, `/topics/mt-ppt`. 경로 목록은 `nav/navItems.ts` 옆에 상수로 둔다(정확 일치. `/my/voted`, `/my/created` 같은 하위 경로는 지금처럼 탭바 없음).
- `ChromeGate` 처럼 클라이언트 컴포넌트가 `usePathname()` 으로 노출 여부를 정한다. `lg:hidden` 은 유지.
- `BottomNavBar` 의 `Suspense` fallback 은 지금 전체 화면 로고 로더다. 레이아웃으로 올리면서 fallback 을 없애거나(`null`) 탭바 모양 자리표시로 바꾼다.
- `/about`, `/topics`, `/topics/mt-ppt` 는 지금처럼 활성 표시 없는 탭바가 보이고, 이 경로들과 오가는 이동은 페이드다. **(내 결정 — 현재 동작 유지)**
- 각 페이지의 `pb-24` (탭바 높이만큼 하단 여백)는 그대로 둔다.

### 4.2 방향 슬라이드 (하단 탭)

- 애니메이션 라이브러리를 추가하지 않는다. 이미 쓰는 `tailwindcss-animate` 의 `animate-in slide-in-from-right-* / slide-in-from-left-*` 를 쓴다. **(내 결정)**
- 방향 계산: 이전 경로와 새 경로가 **둘 다 `NAV_ITEMS` 의 탭**일 때만 인덱스를 비교해 방향을 정한다. 그 외(탭 ↔ 일반 페이지, 일반 ↔ 일반)는 지금처럼 페이드.
- 이전 경로는 클라이언트 모듈 변수 등으로 기억한다(새로고침 후 첫 화면은 애니메이션 없음 또는 페이드).
- 적용 위치: `app/template.tsx` 안에 클라이언트 래퍼를 두고 **`key={pathname}`** 으로 경로마다 재마운트한다. 루트 template 은 라우트 그룹(`(public)`/`(unauth)`/`(auth)`) 단위로만 재마운트되므로(Next 15.1 `layout-router` 의 TemplateContext key), 같은 그룹인 만들기↔마이 이동은 template 만으로는 애니메이션이 재생되지 않는다. template 의 기존 주석("네비게이션마다 재마운트")도 바로잡는다.
- 탭바가 레이아웃으로 빠지므로 transform 을 써도 탭바는 흔들리지 않는다.
- 들어오는 화면만 움직인다(enter-only). App Router 는 이전 페이지를 즉시 언마운트하므로 퇴장 애니메이션은 View Transitions 등 별도 구조가 필요해 이번 범위 밖. **(내 결정)**
- 타이밍: 약 250ms, ease-out, 이동 거리는 화면 폭 전체가 아닌 일부(예: 24~33%) + 페이드 동반. **(내 결정 — 실제 보고 조정 가능)**
- `prefers-reduced-motion` 사용자: 슬라이드 없이 페이드만 (`motion-reduce:` 변형).

### 4.3 로딩 중 스켈레톤

| 탭 | 데이터 | 현재 로딩 | 바꾼 후 |
|---|---|---|---|
| 홈 `/` (`(public)/page.tsx`) | 서버 fetch, `revalidate=60` | `loading.tsx` 없음 → 준비될 때까지 이전 화면 유지 | 그대로 둔다. (`(public)/loading.tsx` 를 만들면 투표 상세에도 적용되므로 만들지 않는다) |
| 밸런스 `/balanse` | 서버 fetch (`searchParams`) | `(unauth)/balanse/loading.tsx` 로고 로더 | 밸런스 화면 모양 스켈레톤 |
| 만들기 `/create` | 클라이언트 | `(auth)/create/loading.tsx` 로고 로더 + `AuthGuard` 로더 | 만들기 화면 모양 스켈레톤 |
| 마이 `/my` | 클라이언트 | `(auth)/my/loading.tsx` 로고 로더 + `AuthGuard` 로더 | 마이 화면 모양 스켈레톤 |

- 스켈레톤은 **탭마다 실제 화면의 대략적인 모양**(헤더 · 탭바 자리 · 카드/목록 자리)을 따른다. 스타일은 기존 `pollOptionsSkeleton.tsx` 와 같게(`animate-pulse`, `bg-brand-gray-50`, `rounded-xl`). **(내 결정)**
- `AuthGuard`(`components/_shared/authGuard.tsx`)는 토큰 확인 중 로고 로더를 보여준다. **하단 탭 경로(`/create`, `/my`)에서는** 같은 스켈레톤을 보여주고, 그 외 보호 경로는 지금처럼 로고 로더.
- 비로그인 사용자가 만들기·마이를 누르면 스켈레톤이 잠깐 보이고(슬라이드 포함) `/entry` 로 이동한다. 지금 로고 로더 뒤 이동하는 것과 같은 흐름이다. **(내 결정)**
- `(auth)/loading.tsx`, `(unauth)/loading.tsx` 등 그룹 공용 로더는 그대로 둔다(일반 페이지용).

### 4.4 화면 안 탭 슬라이드

- 공용 헬퍼를 `components/ui/tabBar.tsx` 근처에 둔다. 현재 선택 탭의 인덱스를 받아 이전 인덱스와 비교해 방향 클래스를 돌려주고, 내용 래퍼에 `key={선택 탭}` 을 줘서 바뀔 때마다 들어오는 애니메이션이 재생되게 한다. 타이밍 · reduced-motion 규칙은 4.2 와 같다.
- **밸런스 카테고리 탭** (사용자 선택: 목록만 브라우저에서 받아오기)
  - 지금은 `router.push('?category=…')` 로 서버에서 다시 받는다. searchParams 가 페이지 캐시 키에 들어가 매번 `balanse/loading.tsx` 가 페이지 전체를 덮는다(`startTransition` 으로도 막을 수 없음).
  - 바꾼 후: 모바일 탭을 누르면 **`window.history.pushState` 로 URL 만 `?category=…` 로 바꾸고**(Next 14.1+ 는 이를 `useSearchParams` 와 동기화), 목록은 기존 클라이언트 `fetchVotes`(무한 스크롤에 쓰는 것)로 받아온다. 서버 왕복 · `loading.tsx` 없음.
  - 받는 동안 헤더 · 탭바는 그대로, **목록 자리만** 스켈레톤. 도착하면 목록을 방향 슬라이드로 넣는다. 탭 밑줄은 누르는 즉시 이동.
  - 유지할 것: 직접 접속 · 새로고침 · PC 사이드바 링크(`hrefWith`, 크롤러용 `<a>`)는 지금처럼 서버 렌더링. 뒤로가기/앞으로가기로 카테고리가 바뀌면 그 카테고리 목록을 다시 받아 보여준다(방향은 탭 순서 기준).
  - 빠르게 연달아 누를 때 늦게 도착한 이전 응답이 화면을 덮지 않게 한다(마지막 요청만 반영). 실패 시 기존 에러 표시 방식 사용.
  - `trackEvent` 등 기존 카테고리 변경 시 부수효과가 있으면 유지.
- 기록 탭 · 칭호 탭은 state 만 바뀌므로 슬라이드만 넣는다(데이터 로딩 방식은 그대로).

## 5. 제약

- Next 15.1 App Router, Tailwind 3.4 + `tailwindcss-animate`. 새 의존성 추가 없음.
- 디자인 토큰 규칙(AGENTS.md §8): `[#HEX]` 임의값 금지, `bg-brand-*` 등 토큰 사용.
- 페이지 코드 변경 시 `docs/screens/*.md` 의 해당 SCR 문서에 로딩/전환 동작을 반영(AGENTS.md §0~4, `usecase-sync` 스킬).
- transform 은 애니메이션 중에만 걸린다(fill-mode 없음). 애니메이션 중에는 페이지 안의 fixed 헤더가 함께 움직이는데, 이는 "새 화면이 통째로 들어오는" 모습으로 의도된 것.
- 앱 WebView(Android/iOS)에서도 같은 동작.

## 6. 빌더에게 맡기는 것

- 방향 기억 · 노출 경로 판단 컴포넌트의 이름과 파일 위치
- 탭별 스켈레톤의 세부 모양(블록 개수 · 높이)
- 슬라이드 거리 · 시간의 정확한 값 (4.2 범위 안에서)
- 칭호 탭처럼 부모가 state 를 가진 곳에서 헬퍼를 부모/자식 어디에 둘지

## 7. 확인 방법

- 로컬 dev 서버에서 모바일 뷰포트로: 하단 탭 4개 사이를 좌→우, 우→좌로 이동하며 탭바 고정 · 방향 · 스켈레톤 확인. 네트워크를 느리게(Slow 4G) 해서 스켈레톤이 보이는지 확인.
- 밸런스 카테고리 · 기록 탭 · 칭호 탭에서 좌우 이동 확인
- 일반 이동(홈 → 투표 상세, 마이 → 기록)이 지금처럼 페이드인지 확인
- PC 폭에서 변화 없음 확인
- `prefers-reduced-motion` 에뮬레이션 시 슬라이드 없음 확인
- 실기기 WebView 는 머지 후 사용자가 확인
