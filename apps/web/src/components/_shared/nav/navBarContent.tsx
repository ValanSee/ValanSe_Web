'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = {
  label: string
  route: string
  icon: string
  iconActive: string
}

const NAV_ITEMS: NavItem[] = [
  {
    label: '홈',
    route: '/main',
    icon: '/icons/nav/home.svg',
    iconActive: '/icons/nav/home-active.svg',
  },
  {
    label: '밸런스',
    route: '/balanse',
    icon: '/icons/nav/balanse.svg',
    iconActive: '/icons/nav/balanse-active.svg',
  },
  {
    label: '만들기',
    route: '/create',
    icon: '/icons/nav/create.svg',
    iconActive: '/icons/nav/create-active.svg',
  },
  {
    label: '내정보',
    route: '/my',
    icon: '/icons/nav/my.svg',
    iconActive: '/icons/nav/my-active.svg',
  },
]

function NavBarContent() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center bg-card pt-ds-2 pb-[calc(0.6875rem+env(safe-area-inset-bottom))] shadow-[0_0_2.3px_rgba(0,0,0,0.11)] backdrop-blur-2xl">
      {NAV_ITEMS.map(({ label, route, icon, iconActive }) => {
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
            <Image
              src={isActive ? iconActive : icon}
              alt=""
              width={28}
              height={28}
            />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export default NavBarContent
