# 디자인시스템 개편 로드맵

**최종 수정**: 2026-07-06

이 문서는 ValanSe 웹 앱의 디자인 대개편 진행 계획을 정리합니다. 기초 컴포넌트부터 순차적으로 재작성하고, 페이지 코드 대치환은 컴포넌트 층이 확정된 뒤 진행합니다.

## 배경

- **PR #127** (`feat/design-system-tokens` · 머지 완료) — 브랜드 팔레트(Yellow / Violet / Gray / Red / Black), 타이포 스케일(Heading / Title / Body / Label 21종), Pretendard 폰트, ESLint 하드코딩 hex warn 룰 확정.
- **PR #129** (`feat/bottom-nav-redesign` · 진행 중) — 바텀탭을 Figma 신규 사양(V300 active, G75 inactive, 파일 세트 SVG)으로 재작성. "인기" 탭 제거.
- **본 로드맵** — Figma [`Valanse_develop_mode` 노드 `123:500`](https://www.figma.com/design/bQIUgk3g44EyADlWTLxecw/Valanse_develop_mode?node-id=123-500&m=dev) "Design(확정디자인)" 카탈로그를 기초로 컴포넌트 라이브러리를 순차 개편합니다.

## 원칙

### 1. 레이어 구조 (컴포넌트 위치)

| 폴더 | 역할 |
|---|---|
| `src/components/ui/` | shadcn 원본 최소 스타일. 원자적 프리미티브. |
| `src/components/common/` | **브랜드 래퍼**. 페이지가 항상 여기서 import (본 로드맵에서 신규 도입). |
| `src/components/pages/` | 도메인 페이지 코드. `common/`을 조합. |

`common/`이 신설되면 AGENTS.md §9 Component Convention의 "공통 컴포넌트 우선" 원칙과 정합.

### 2. Variant 관리 — CVA

`class-variance-authority`를 도입해 Button/Chip 같은 다변량 컴포넌트를 선언적으로 관리합니다. shadcn 표준이며 Storybook autodocs와 결합이 좋습니다.

```tsx
const buttonVariants = cva('base classes', {
  variants: {
    variant: { primary: '...', secondary: '...' },
    size: { xl: '...', l: '...' },
  },
  defaultVariants: { variant: 'primary', size: 'l' },
})
```

### 3. 컬러 · 타이포

- **컬러 우선순위**: shadcn 시멘틱(`bg-primary`) → `brand-*` 팔레트 → hex 금지 (AGENTS.md §8)
- **타이포**: `.typo-heading-*` / `.typo-title-*` / `.typo-body-*` / `.typo-label-*` 유틸리티 클래스만 사용

### 4. Storybook

각 컴포넌트마다 variant × state 커버리지 스토리 필수. title 계층은 `Common/<Name>`.

### 5. 1 컴포넌트 = 1 PR

컴포넌트 코드 + Storybook + 시각 확인만. 페이지 컴포넌트의 실제 교체는 별도 PR(P8)에서 도메인별로 분할.

### 6. 컨벤셔널 커밋 · 브랜치

- `feat/<component>-redesign` (base: `develop`)
- 커밋 prefix: `feat(<component>):`
- PR 본문: Summary / Test plan / Notes / Figma 노드 링크

## PR 매트릭스

| # | PR | 브랜치 | 신규/재작성 파일 | Figma componentSetId | Variant/상태 |
|---|---|---|---|---|---|
| **P0** | 로드맵 문서화 | `docs/design-system-roadmap` | `docs/design-system-roadmap.md` · `AGENTS.md` §10 링크 | — | — |
| **P1** | Button 재작성 | `feat/button-redesign` | `ui/button.tsx` · `common/Button.tsx` · Storybook · **CVA 설치** | `6273:8262` | 5 size × 7~8 status ≈ 40 |
| **P2** | Header + Tab Bar | `feat/header-tab-redesign` | `_shared/header.tsx` · `ui/tabs.tsx` · `common/Header.tsx` · `common/TabBar.tsx` · Storybook | `6315:6803`, `6321:7510` | header xl/s · tab selected+HOT |
| **P3** | TextField | `feat/textfield-redesign` | `ui/textField.tsx` · `common/TextField.tsx` · Storybook | `6280:8355` | 5 states (default/focus/filled/disabled/error) |
| **P4** | Chip + Badge | `feat/chip-badge-redesign` | `ui/chip.tsx` · `ui/badge.tsx` · `common/Chip.tsx` · `common/Badge.tsx` · Storybook | `6288:5807`, `6339:8861` | ~20+18 variants |
| **P5** | Dropdown | `feat/dropdown-redesign` | `ui/dropdown.tsx` (shadcn Select 활용) · `common/Dropdown.tsx` · Storybook | `6280:9019` | 4 states |
| **P6** | Modal 통합 | `feat/modal-redesign` | `ui/modal.tsx` · `ui/modal/{confirm,delete,exit,loginRequired}Modal.tsx` · `common/Modal.tsx` · Storybook | `6358:8151` | 3 (투버튼/원버튼/오류) |
| **P7** | Vote Card | `feat/vote-card-redesign` | `pages/poll/pollCard.tsx` · `common/VoteCard.tsx` (선택) · Storybook | `6315:7668`, `6328:8114` | 4 (홈/밸런스 × 전/후) |
| **P8** | 페이지 하드코딩 대치환 | `refactor/hardcoded-styles-migration/<domain>` (여러 서브 PR) | 페이지 컴포넌트 전반 | — | — |

## P1 (Button) 상세 — 다른 PR의 청사진

### 의존성

```bash
pnpm --filter valanse-web add class-variance-authority
```

### `apps/web/src/components/ui/button.tsx` (CVA)

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:      'bg-primary text-primary-foreground hover:bg-brand-violet-400',
        secondary:    'bg-secondary text-secondary-foreground hover:bg-brand-gray-75',
        ghost_purple: 'bg-brand-violet-50 text-primary hover:bg-brand-violet-75',
        ghost_black:  'bg-transparent text-foreground hover:bg-secondary',
        outline:      'border border-border bg-transparent text-foreground hover:bg-secondary',
        gray:         'bg-brand-gray-50 text-brand-gray-500 hover:bg-brand-gray-75',
      },
      size: {
        xl: 'h-14 px-3 rounded-xl typo-body-b-01',
        l:  'h-12 px-3 rounded-xl typo-body-b-01',
        m:  'h-10 px-3 rounded-[10px] typo-body-b-02',
        s:  'h-8  px-3 rounded-lg typo-label-01',
        ss: 'px-2 py-1 rounded gap-1 typo-body-c-03',
      },
    },
    defaultVariants: { variant: 'primary', size: 'l' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
```

### `apps/web/src/components/common/Button.tsx` (브랜드 래퍼)

```tsx
export { Button, type ButtonProps } from '@/components/ui/button'
```

지금은 shadcn을 재수출만 하지만, 아이콘 슬롯 · 로딩 상태 등 브랜드 특화 확장 시 이 파일이 확장 지점입니다.

### Storybook: `apps/web/src/components/common/Button.stories.tsx`

- `title: 'Common/Button'`, `component: Button`
- 스토리: 각 variant × size 조합 대표 10개 (모든 size의 primary + primary variant의 모든 status) + Disabled + WithIcon

### 검증

- `pnpm --filter valanse-web lint` 통과 (신규 hex 0)
- `pnpm --filter valanse-web build` 통과
- Storybook 각 스토리 렌더 확인
- 기존 사용처(`ui/modal/*`, `pages/my/titles/*`) API 호환 검토: `variant="default"` → `variant="primary"` 마이그레이션은 이 스코프에서 함께

### 미포함

- 페이지 컴포넌트의 `<button>` → `<Button>` 대치환 (P8)
- 아이콘 슬롯 API 정식화 (필요 시 후속 PR)

## 실행 순서 (권장)

| 순서 | PR | 이유 |
|---|---|---|
| P0 | 로드맵 문서화 | 후속 PR의 나침반 |
| P1 | Button | 최광범위 사용 · CVA 첫 도입 · 청사진 |
| P2 | Header + Tab | 페이지 상단 공통 |
| P3 | TextField | 폼 기반 |
| P4 | Chip + Badge | 필터·HOT 표시 |
| P5 | Dropdown | 폼 확장 |
| P6 | Modal | 인터랙션 공통 |
| P7 | Vote Card | 서비스 핵심 카드 |
| P8 | 페이지 마이그레이션 | P1~P7 완료 후, 도메인별 서브 PR로 분할 |

각 PR 머지 후 다음 PR 시작(직렬).

## 명시적으로 하지 않는 것

- **Table / Toast / Snackbar** — Figma 카탈로그에 없음
- **다크모드** — 이전 결정대로 스코프 밖
- **아이콘 라이브러리 도입** — 필요 시 개별 PR
- **shadcn CLI 재실행** — 기존 컴포넌트를 CVA로 재작성하는 방식
- **컴포넌트 테스트(Vitest/Playwright)** — Storybook 시각 확인으로 대체. 필요 시 별도 PR

## 관련 문서

- [`AGENTS.md`](../AGENTS.md) §8 디자인 토큰 규칙 · §9 코드 컨벤션
- [`docs/screens/`](./screens/) — 화면 명세서
