'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import { NAV_ITEMS, isNavActive } from './navItems'

function NavBarContent() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 lg:hidden left-0 z-50 flex w-full items-center bg-card pt-ds-2 pb-[calc(0.6875rem+env(safe-area-inset-bottom))] shadow-[0_0_2.3px_rgba(0,0,0,0.11)] backdrop-blur-2xl">
      {NAV_ITEMS.map(({ label, route, icon }) => {
        const isActive = isNavActive(pathname, route)
        return (
          <Link
            key={route}
            href={route}
            aria-current={isActive ? 'page' : undefined}
            className={`typo-label-03 flex flex-1 flex-col items-center justify-center gap-1 px-ds-2 text-center transition-colors ${
              isActive ? 'text-primary' : 'text-brand-gray-75'
            }`}
          >
            <Icon icon={icon} width={28} height={28} aria-hidden />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export default NavBarContent
