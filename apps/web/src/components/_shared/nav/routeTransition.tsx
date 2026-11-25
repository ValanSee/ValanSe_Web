'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getSlideDirection, slideInClass } from '@/lib/slideTransition'
import { getTabIndex } from './navItems'

// 직전 경로. 모듈 변수라 클라이언트 네비게이션 사이에 유지된다.
let lastPathname: string | null = null

function SlideIn({
  pathname,
  children,
}: {
  pathname: string
  children: React.ReactNode
}) {
  // 마운트 시 한 번만 방향 결정 (StrictMode 이중 렌더에도 유지)
  const [dir] = useState(() =>
    getSlideDirection(getTabIndex(lastPathname ?? ''), getTabIndex(pathname)),
  )

  useEffect(() => {
    lastPathname = pathname
  }, [pathname])

  return (
    // 바깥(움직이지 않는) 요소의 overflow-x-clip: 옆에서 들어오는 동안 본문이 화면 밖으로 밀려
    // 모바일 브라우저가 레이아웃 폭을 넓혔다 줄이며 고정 하단 탭바를 다시 배치(깜빡임)하지 않게 한다.
    // 움직이는 래퍼 자체에 걸면 래퍼 박스가 같이 밀려 효과가 없다. hidden 이 아니라 clip 이라 sticky 헤더는 그대로 동작
    <div className="overflow-x-clip">
      <div className={cn('page-safe-bottom', slideInClass(dir))}>
        {children}
      </div>
    </div>
  )
}

export default function RouteTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <SlideIn key={pathname} pathname={pathname}>
      {children}
    </SlideIn>
  )
}
