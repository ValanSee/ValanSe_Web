'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const navOptions = [
  {
    label: '홈',
    icon: '/home.svg',
    activeIcon: '/home-blue.svg',
    route: '/main',
  },
  {
    label: '인기',
    icon: '/hotissue.svg',
    activeIcon: '/hotissue-blue.svg',
    route: '/poll/hot',
  },
  {
    label: '밸런스',
    route: '/balanse',
    icon: '/poll.svg',
    activeIcon: '/poll-blue.svg',
  },
  {
    label: '만들기',
    icon: '/create.svg',
    activeIcon: '/create-blue.svg',
    route: '/create',
  },
  {
    label: '내 정보',
    icon: '/mypage.svg',
    activeIcon: '/mypage-blue.svg',
    route: '/my',
  },
]

function BottomNavBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <nav className="fixed bottom-0 w-full h-20 bg-white border-t flex items-center shadow-2xl shadow-black z-50">
      {navOptions.map((option) => {
        let isActive = false

        if (option.label === '인기') {
          // 정규표현식으로 `/poll/숫자` 감지하고, source=hot 인지 확인
          const isPollDetail = /^\/poll\/\d+$/.test(pathname)
          const isSourceHot = searchParams.get('source') === 'hot'
          isActive =
            pathname.startsWith('/poll/hot') || (isPollDetail && isSourceHot)
        } else {
          isActive = pathname.startsWith(option.route)
        }

        return (
          <Link
            key={option.label}
            href={option.route}
            className={`flex flex-col items-center justify-center w-full h-10 gap-1 text-xs font-bold leading-none ${isActive ? 'text-[#4D7298]' : 'text-[#1D1D1D]'}`}
          >
            <div className="flex items-center justify-center w-6 h-6">
              <Image
                src={isActive ? option.activeIcon : option.icon}
                alt={option.label}
                width={20}
                height={20}
              />
            </div>
            {option.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default BottomNavBar
