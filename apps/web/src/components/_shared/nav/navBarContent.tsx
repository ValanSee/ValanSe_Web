'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentType, SVGProps } from 'react'
import { BalanseIcon, CreateIcon, HomeIcon, MyIcon } from './icons'

type NavItem = {
  label: string
  route: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

const NAV_ITEMS: NavItem[] = [
  { label: '홈', route: '/main', Icon: HomeIcon },
  { label: '밸런스', route: '/balanse', Icon: BalanseIcon },
  { label: '만들기', route: '/create', Icon: CreateIcon },
  { label: '내정보', route: '/my', Icon: MyIcon },
]

function NavBarContent() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 flex w-full items-center bg-card pt-ds-2 pb-[calc(0.6875rem+env(safe-area-inset-bottom))] shadow-[0_0_2.3px_rgba(0,0,0,0.11)] backdrop-blur-2xl"
    >
      {NAV_ITEMS.map(({ label, route, Icon }) => {
        const isActive = pathname.startsWith(route)
        return (
          <Link
            key={route}
            href={route}
            aria-current={isActive ? 'page' : undefined}
            className={`typo-label-01 flex flex-1 flex-col items-center justify-center gap-1 px-ds-2 text-center transition-colors ${
              isActive ? 'text-primary' : 'text-brand-gray-75'
            }`}
          >
            <Icon className="h-7 w-7" aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export default NavBarContent
