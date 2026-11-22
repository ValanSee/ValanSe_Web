# 탭 이동 슬라이드 전환 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 하단 탭바를 고정하고, 하단 탭 · 화면 안 탭 이동 시 탭 순서 방향으로 본문을 슬라이드하며, 탭 이동 중 로고 로더 대신 스켈레톤을 보여준다.

**Architecture:** `BottomNavBar` 를 루트 레이아웃으로 올리고, `app/template.tsx` 안 클라이언트 래퍼가 `key={pathname}` 으로 재마운트하며 이전/다음 경로의 탭 인덱스로 방향 클래스를 고른다. 화면 안 탭은 공용 훅 `useSlideDirection` 으로 같은 클래스를 쓴다. 밸런스 카테고리는 `history.pushState` + 기존 클라이언트 fetch 로 바꿔 `loading.tsx` 를 피한다.

**Tech Stack:** Next 15.1 App Router, React 19, Tailwind 3.4 + `tailwindcss-animate`

**Spec:** `docs/superpowers/specs/2026-11-22-tab-slide-transition-design.md`

## Global Constraints

- 새 의존성 추가 없음 (애니메이션 · 테스트 라이브러리 포함). 저장소에 테스트 러너가 없으므로 각 태스크 검증은 `tsc` · `eslint` · 로컬 브라우저 시나리오로 한다.
- 모든 명령은 `apps/web` 에서: 타입 `pnpm exec tsc --noEmit -p .`, 린트 `pnpm exec eslint <변경 파일>`, 포맷 `pnpm exec prettier --check <변경 파일>`
- 디자인 토큰 규칙(AGENTS.md §8): `[#HEX]` 금지, `bg-brand-*` 토큰. 스켈레톤 블록은 `animate-pulse rounded-xl bg-brand-gray-50` (`pollOptionsSkeleton.tsx` 와 동일)
- 슬라이드: 약 250ms, ease-out, 이동 거리 화면 폭의 1/4, 페이드 동반. `prefers-reduced-motion` 이면 이동 없이 페이드만
- 방향: 다음 탭 인덱스 > 이전 → 오른쪽에서 들어옴(`slide-in-from-right`), 작으면 왼쪽에서. 탭 ↔ 일반 페이지 · 첫 진입은 페이드
- PC(`lg` 이상) 동작 변화 없음. 하단 탭바는 `lg:hidden` 유지
- 커밋은 Conventional Commits (AGENTS.md §9), 한국어 요약
- 브라우저 확인은 claude-in-chrome, 로컬 dev 는 `pnpm exec next dev -p 3100` (3000 은 로그인 테스트용으로 비워 둠; 로그인이 필요한 화면 확인은 3000 에서)

## Review Focus

1. **만들기 ↔ 마이(같은 `(auth)` 그룹) 이동** — 슬라이드가 재생돼야 한다. 루트 template 은 그룹 단위로만 재마운트되므로 `key={pathname}` 이 빠지면 조용히 안 움직인다. → Task 2 Step 3 에서 확인
2. **밸런스 카테고리를 빠르게 연달아 누름** — 마지막에 누른 카테고리 목록만 보여야 한다(늦게 온 이전 응답이 덮으면 안 됨). → Task 4 Step 4
3. **밸런스에서 카테고리 바꾼 뒤 뒤로가기 / 앞으로가기** — URL 과 탭 밑줄 · 목록이 함께 이전 카테고리로 돌아가야 하고, 로고 로더가 뜨면 안 된다. → Task 4 Step 4
4. **탭바 노출 경로 밖으로 이동(투표 상세, `/my/voted`)** — 탭바가 사라지고 해당 페이지 하단이 가려지지 않아야 하며, 다시 탭으로 돌아오면 탭바가 깜빡이지 않고 나타나야 한다. → Task 1 Step 4
5. **비로그인 상태로 만들기 · 마이 탭** — 로고 로더 대신 스켈레톤이 잠깐 보이고 `/entry` 로 이동해야 한다(무한 스켈레톤 금지). → Task 3 Step 4

---

## 파일 구조

| 파일 | 책임 |
|---|---|
| `src/components/_shared/nav/navItems.ts` (수정) | 탭 목록 + `BOTTOM_NAV_PATHS`, `showsBottomNav`, `getTabIndex` |
| `src/components/_shared/nav/bottomNavBar.tsx` (수정) | 노출 경로에서만 렌더, 로고 로더 fallback 제거 |
| `src/lib/slideTransition.ts` (생성) | 방향 계산 · 방향별 클래스 문자열(순수 함수) |
| `src/hooks/utils/useSlideDirection.ts` (생성) | 화면 안 탭용: 인덱스 변화 → 방향 클래스 |
| `src/components/_shared/nav/routeTransition.tsx` (생성) | 경로 변화 → `key` 재마운트 + 방향 클래스 |
| `src/app/template.tsx` (수정) | `RouteTransition` 사용, 주석 정정 |
| `src/app/layout.tsx` (수정) | `<BottomNavBar />` 1회 렌더 |
| 7개 페이지 (수정) | `<BottomNavBar />` 제거 |
| `src/components/_shared/skeleton/*.tsx` (생성) | 탭별 스켈레톤 |
| `src/app/(unauth)/balanse/loading.tsx`, `src/app/(auth)/create/loading.tsx`, `src/app/(auth)/my/loading.tsx` (수정) | 스켈레톤으로 교체 |
| `src/components/_shared/authGuard.tsx` (수정) | `/create`, `/my` 에서 스켈레톤 |
| `src/components/pages/balanse/balansePage.tsx` (수정) | pushState 카테고리 전환 · 목록 스켈레톤 · 슬라이드 |
| `historyPage.tsx`, `titlesPage.tsx` (수정) | 목록 슬라이드 |

---

### Task 1: 하단 탭바를 레이아웃으로 고정

**Files:**
- Modify: `apps/web/src/components/_shared/nav/navItems.ts`
- Modify: `apps/web/src/components/_shared/nav/bottomNavBar.tsx`
- Modify: `apps/web/src/app/layout.tsx:155` (`<main>` 바로 뒤)
- Modify (각 파일의 `import BottomNavBar` 와 `<BottomNavBar />` 제거): `src/components/pages/{main/mainPage,balanse/balansePage,create/createPage,my/myPage,about/aboutPage,topics/topicsPage,topics/mtPptPage}.tsx`

**Interfaces:**
- Produces (`navItems.ts`):
  - `BOTTOM_NAV_PATHS: readonly string[]` = `['/', '/balanse', '/create', '/my', '/about', '/topics', '/topics/mt-ppt']`
  - `showsBottomNav(pathname: string): boolean` — `BOTTOM_NAV_PATHS` 정확 일치
  - `getTabIndex(pathname: string): number` — `NAV_ITEMS` 의 `route` 와 **정확 일치**하는 인덱스, 없으면 `-1` (`/my/voted` → `-1`)

- [ ] **Step 1: `navItems.ts` 에 위 3개 추가**
- [ ] **Step 2: `bottomNavBar.tsx` 를 클라이언트 컴포넌트로** — `usePathname()` 으로 `showsBottomNav` 가 false 면 `null`. `Suspense` fallback 은 `null` (로고 로더 import 제거). `NavBarContent` 는 그대로 사용.
- [ ] **Step 3: `layout.tsx` 의 `<main>` 다음 줄에 `<BottomNavBar />`, 7개 페이지에서 제거.** 각 페이지의 `pb-24` 는 유지.
- [ ] **Step 4: 검증** — `tsc`, 변경 파일 `eslint`·`prettier --check` 통과. 브라우저(390×844): `/` → `/balanse` → `/create`(3000, 로그인) → `/my` 이동 중 탭바가 사라지지 않음. `/poll/<id>`, `/my/voted` 에서 탭바 없음 · 하단 내용 가려지지 않음. `/about`, `/topics` 에서 탭바 보임. PC 폭(1280)에서 탭바 없음.
- [ ] **Step 5: Commit** — `refactor(web): 하단 탭바를 루트 레이아웃으로 올려 탭 이동 중 유지`

### Task 2: 하단 탭 방향 슬라이드

**Files:**
- Create: `apps/web/src/lib/slideTransition.ts`
- Create: `apps/web/src/components/_shared/nav/routeTransition.tsx`
- Modify: `apps/web/src/app/template.tsx`

**Interfaces:**
- Consumes: `getTabIndex` (Task 1)
- Produces (`slideTransition.ts`):
  - `type SlideDirection = 'left' | 'right' | null`
  - `getSlideDirection(prev: number, next: number): SlideDirection` — 둘 중 하나라도 `< 0` 이거나 같으면 `null`; `next > prev` → `'right'`(오른쪽에서 들어옴), 아니면 `'left'`
  - `slideInClass(dir: SlideDirection): string` — 공통 `'animate-in fade-in duration-[250ms] ease-out'` + `'right'` → `'slide-in-from-right-1/4 motion-reduce:slide-in-from-right-0'`, `'left'` → `'slide-in-from-left-1/4 motion-reduce:slide-in-from-left-0'`, `null` → 페이드만. Tailwind JIT 가 읽도록 클래스는 **완성된 리터럴 문자열**로 둔다(조합 금지).
- Produces: `RouteTransition({ children }: { children: React.ReactNode })` — 기본 export

- [ ] **Step 1: `slideTransition.ts` 작성.** 저장소에 테스트 러너가 없으므로 `node -e` 로 아래를 확인할 수 있게 순수 함수로만 둔다: `getSlideDirection(0,3)==='right'`, `(3,1)==='left'`, `(-1,2)===null`, `(2,2)===null`, `(1,-1)===null`.
- [ ] **Step 2: `routeTransition.tsx` 작성** — `'use client'`. 구조: `RouteTransition` 이 `usePathname()` 을 읽어 내부 컴포넌트 `<SlideIn key={pathname}>` 를 렌더(경로마다 재마운트, searchParams 만 바뀌면 재마운트 안 함). 이전 경로는 모듈 변수 `lastPathname: string | null`. `SlideIn` 은 마운트 시 한 번 `useState(() => getSlideDirection(getTabIndex(lastPathname ?? ''), getTabIndex(pathname)))` 로 방향을 정하고, `lastPathname = pathname` 갱신은 `useEffect` 에서(StrictMode 이중 렌더에도 방향 유지). 렌더: `<div className={cn('page-safe-bottom', slideInClass(dir))}>{children}</div>`.
- [ ] **Step 3: `template.tsx` 를 `<RouteTransition>{children}</RouteTransition>` 로** — 주석을 "루트 template 은 라우트 그룹 단위로만 재마운트되므로 pathname key 로 직접 재마운트한다. 하단 탭바는 레이아웃에 있어 transform 을 써도 흔들리지 않는다" 취지로 정정.
- [ ] **Step 4: 검증** — `tsc`/`eslint`/`prettier`. 브라우저: 홈→마이(오른쪽에서 들어옴), 마이→밸런스(왼쪽), **만들기↔마이(같은 그룹, 반드시 움직임)**, 홈→투표 상세(페이드), 새로고침 첫 화면(페이드). DevTools 로 `prefers-reduced-motion: reduce` 에뮬레이션 시 이동 없음. 애니메이션 후 본문 래퍼에 `transform` 이 남지 않음(`getComputedStyle(...).transform === 'none'`) → 헤더 sticky 정상.
- [ ] **Step 5: Commit** — `feat(web): 하단 탭 이동 시 탭 순서 방향으로 슬라이드`

### Task 3: 탭 이동 중 스켈레톤

**Files:**
- Create: `apps/web/src/components/_shared/skeleton/balanseListSkeleton.tsx` — `BalanseListSkeleton()` : 카드 3개 모양(Task 4 에서도 사용)
- Create: `apps/web/src/components/_shared/skeleton/tabPageSkeletons.tsx` — `BalansePageSkeleton()`, `CreatePageSkeleton()`, `MyPageSkeleton()`, `tabPageSkeletonFor(pathname: string): React.ReactNode | null` (`/balanse`·`/create`·`/my` 정확 일치일 때만 해당 스켈레톤, 아니면 `null`)
- Modify: `src/app/(unauth)/balanse/loading.tsx`, `src/app/(auth)/create/loading.tsx`, `src/app/(auth)/my/loading.tsx`
- Modify: `apps/web/src/components/_shared/authGuard.tsx:51,55,67`

**Interfaces:**
- Produces: `BalanseListSkeleton`, `tabPageSkeletonFor` (Task 4 가 `BalanseListSkeleton` 사용)

- [ ] **Step 1: 스켈레톤 컴포넌트 작성** — 각 페이지 스켈레톤은 실제 화면처럼 모바일 헤더(`Header` 를 같은 title 로 실제 렌더 — "밸런스 게임" 등 각 페이지 값 그대로) + 본문 블록. 밸런스는 카테고리 탭바 자리(높이 동일 블록) + `BalanseListSkeleton`. 마이는 프로필 블록 + 메뉴 행 4~5개. 만들기는 입력 블록들. `aria-hidden` + 루트에 `aria-busy`. 페이지 루트 클래스(`min-h-screen bg-card pb-24`)는 실제 페이지와 맞춰 배경이 튀지 않게.
- [ ] **Step 2: `loading.tsx` 3개 교체** — `my/loading.tsx` · `create/loading.tsx` 는 하위 경로(`/my/voted` 등)에도 적용되므로, 세 파일 모두 `'use client'` 로 `usePathname()` 을 읽어 `tabPageSkeletonFor(pathname) ?? <Loading />` 를 반환한다(탭 경로만 스켈레톤, 하위 경로는 기존 로고 로더).
- [ ] **Step 3: `AuthGuard`** — `<Loading />` 3곳을 `tabPageSkeletonFor(pathname) ?? <Loading />` 로. Suspense fallback 은 `pathname` 을 못 쓰므로 그대로 둔다.
- [ ] **Step 4: 검증** — DevTools Network "Slow 4G" 에서 홈→밸런스, 홈→만들기, 홈→마이: 로고 로더 없이 스켈레톤이 슬라이드로 들어옴. 로그아웃 상태로 만들기/마이 탭 → 스켈레톤 후 `/entry` 이동. 앱 첫 진입 · OAuth 리다이렉트 로고 로더는 그대로.
- [ ] **Step 5: Commit** — `feat(web): 탭 이동 중 로고 로더 대신 화면별 스켈레톤`

### Task 4: 밸런스 카테고리 탭 — URL 만 바꾸고 목록만 교체

**Files:**
- Modify: `apps/web/src/components/pages/balanse/balansePage.tsx` (`updateCategory` 75–79, 목록 fetch effect 114–139, 목록 렌더 205–220)
- Create: `apps/web/src/hooks/utils/useSlideDirection.ts`

**Interfaces:**
- Consumes: `getSlideDirection`, `slideInClass` (Task 2), `BalanseListSkeleton` (Task 3)
- Produces: `useSlideDirection(index: number): string` — 이전 렌더의 `index` 를 `useRef` 로 기억, 바뀐 렌더에서 `slideInClass(getSlideDirection(prev, index))` 를 반환(첫 렌더는 `''` — 애니메이션 없음). Task 5 도 사용.

- [ ] **Step 1: `useSlideDirection.ts` 작성**
- [ ] **Step 2: `updateCategory`** — `router.push` 대신 `window.history.pushState(null, '', \`?${params}\`)`. (Next 14.1+ 는 이를 `useSearchParams` 에 반영하므로 `category`/`listKey` 가 바뀌고 기존 effect 가 `fetchVotes` 로 받아온다.) PC 사이드바 `hrefWith` 링크는 그대로.
- [ ] **Step 3: 목록 effect · 렌더**
  - effect 안에 `let cancelled = false` / cleanup 에서 `cancelled = true`, `setVotes` 등은 `!cancelled` 일 때만 → 마지막 요청만 반영
  - 카테고리가 바뀌어 fetch 중(`loading`)이면 목록 자리에 `BalanseListSkeleton` (기존 카드 대신)
  - 목록 컨테이너를 `key={category}` 인 래퍼로 감싸고 `useSlideDirection(TABS.findIndex(t => t.value === category))` 클래스를 붙인다. 카드별 기존 `slide-in-from-bottom-2` 등장 애니메이션은 카테고리 전환 시 겹치지 않도록 래퍼 슬라이드와 함께 보기에 어색하면 제거 — 판단을 커밋 메시지에 남긴다
- [ ] **Step 4: 검증** — 모바일 폭: 카테고리 오른쪽 탭 → 목록이 오른쪽에서, 왼쪽 → 왼쪽에서. 헤더 · 탭바 그대로, 로고 로더 없음, 받는 동안 목록 스켈레톤. URL `?category=` 갱신. **빠르게 3개 연달아 클릭 → 마지막 카테고리 목록만.** **뒤로가기/앞으로가기 → URL · 밑줄 · 목록 모두 이전 카테고리, 로더 없음.** `/balanse?category=<x>` 직접 접속 시 SSR HTML 에 목록 카드 포함(`curl` 로 확인). 무한 스크롤 다음 페이지 정상. PC 사이드바 링크 이동 정상.
- [ ] **Step 5: Commit** — `feat(web): 밸런스 카테고리 전환을 목록만 교체 + 방향 슬라이드로`

### Task 5: 마이 기록 탭 · 칭호 탭 슬라이드

**Files:**
- Modify: `apps/web/src/components/pages/my/_shared/historyPage.tsx` (목록 컨테이너 81행)
- Modify: `apps/web/src/components/pages/my/titles/titlesPage.tsx` (목록 렌더 부분, `tab` state 33행)

**Interfaces:**
- Consumes: `useSlideDirection` (Task 4)

- [ ] **Step 1: historyPage** — 목록 컨테이너(`flex flex-col gap-3 px-4 pb-24 pt-3`)를 `key={category}` + `useSlideDirection(CATEGORIES.findIndex(c => c.value === category))` 클래스.
- [ ] **Step 2: titlesPage** — 목록 영역을 `key={tab}` + `useSlideDirection(tab === 'owned' ? 0 : 1)` 클래스. `TitleTabs` 는 변경 없음.
- [ ] **Step 3: 검증** — 3000 포트 로그인 상태에서 `/my/voted`, `/my/created` 카테고리 좌우, `/my/titles` 보유↔잠금 방향 확인. 정렬 토글은 슬라이드 없음.
- [ ] **Step 4: Commit** — `feat(web): 마이 기록 · 칭호 탭 전환에 방향 슬라이드`

### Task 6: 화면 명세 동기화 · 전체 확인 · PR

**Files:**
- Modify: `docs/screens/SCR-HOME-001_home.md`, `SCR-BALANSE-001_balanse.md`, `SCR-CREATE-001_create.md`, `SCR-MY-001_my.md`, `SCR-MY-VOTED-001_my-voted.md`, `SCR-MY-CREATED-001_my-created.md`, `SCR-ABOUT-001_about.md`, `SCR-TOPICS-001_topics.md`, `SCR-TOPICS-002_mt-ppt.md` — 해당되는 것만(하단 탭바 위치, 로딩 스켈레톤, 카테고리 전환 방식, 슬라이드). `usecase-sync` 스킬 규칙 따름.

- [ ] **Step 1: 명세 문서 갱신**
- [ ] **Step 2: 전체 검증** — `pnpm exec tsc --noEmit -p .`, `pnpm lint`, `pnpm build` 통과. Review Focus 5개 항목을 브라우저에서 다시 한 번.
- [ ] **Step 3: Commit** — `docs(screens): 탭 슬라이드 · 스켈레톤 전환 반영`
- [ ] **Step 4: 푸시 · PR(base `main`)** — 사용자 승인 후. PR 본문에 슬라이드 GIF(claude-in-chrome `gif_creator`) 첨부.
