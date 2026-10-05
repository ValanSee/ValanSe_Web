'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { getAccessToken } from '@/utils/tokenUtils'
import { entryHrefWithRedirect } from '@/utils/authRedirect'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, isNavActive } from './navItems'

/** 우측에 따로 버튼으로 노출하는 메뉴 */
const ACTION_ROUTES = ['/create', '/my']
const MENU_ITEMS = NAV_ITEMS.filter(
  ({ route }) => !ACTION_ROUTES.includes(route),
)
/** 로그인 진행 중인 화면에선 로그인 버튼이 자기 자신을 가리키므로 숨김 */
const AUTH_FLOW_PREFIXES = ['/entry', '/oauth', '/onboarding']

/**
 * PC(lg 이상) 전용 상단 GNB. 모바일에서는 하단 탭바가 같은 역할.
 * 링크는 SSR HTML 에 그대로 포함돼 크롤러가 따라갈 수 있다.
 */
export default function DesktopHeader() {
  const pathname = usePathname()
  const isLogined = useAppSelector((s) => s.auth.isLogined)
  // 토큰은 localStorage 에만 있어 서버 렌더 시점엔 로그인 여부를 모름 → 마운트 후에 우측 버튼 결정
  const [hasToken, setHasToken] = useState<boolean | null>(null)
  const inAuthFlow = AUTH_FLOW_PREFIXES.some((p) => pathname.startsWith(p))

  useEffect(() => {
    setHasToken(Boolean(getAccessToken()))
  }, [isLogined])

  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-card lg:block">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-ds-10 px-ds-6">
        <Link href="/" className="flex items-center gap-ds-2" aria-label="홈">
          <Image
            src="/assets/logo.svg"
            alt="ValanSe"
            width={28}
            height={26}
            priority
          />
          <span className="typo-heading-05 text-foreground">ValanSe</span>
        </Link>

        <nav className="flex flex-1 items-center gap-ds-6">
          {MENU_ITEMS.map(({ label, route }) => {
            const isActive = isNavActive(pathname, route)
            return (
              <Link
                key={route}
                href={route}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'typo-title-02 transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-brand-gray-200',
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-ds-2">
          <Link
            href="/create"
            className={buttonVariants({ size: 'm', variant: 'primary' })}
          >
            밸런스 만들기
          </Link>
          {inAuthFlow ? null : hasToken === null ? (
            // 로그인 여부 확인 전 자리만 확보해 레이아웃 흔들림 방지
            <span className="h-10 w-[72px]" aria-hidden />
          ) : hasToken ? (
            <Link
              href="/my"
              aria-current={isNavActive(pathname, '/my') ? 'page' : undefined}
              className={buttonVariants({ size: 'm', variant: 'ghost' })}
            >
              마이
            </Link>
          ) : (
            <Link
              href={entryHrefWithRedirect(pathname)}
              className={buttonVariants({ size: 'm', variant: 'ghost' })}
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
