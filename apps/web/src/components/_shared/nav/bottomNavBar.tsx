'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import NavBarContent from './navBarContent'
import { showsBottomNav } from './navItems'

function BottomNavBar() {
  const pathname = usePathname()
  if (!showsBottomNav(pathname)) return null

  return (
    <Suspense fallback={null}>
      <NavBarContent />
    </Suspense>
  )
}

export default BottomNavBar
