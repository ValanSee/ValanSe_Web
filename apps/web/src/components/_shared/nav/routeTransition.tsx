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
    <div className={cn('page-safe-bottom', slideInClass(dir))}>{children}</div>
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
