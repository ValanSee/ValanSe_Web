'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { consumePostLoginTarget } from '@/utils/authRedirect'

const currentPath = () => `${window.location.pathname}${window.location.search}`

/**
 * 로그인 후 history.go 로 되돌아온 페이지에서 마무리.
 * - 목적지가 다른 페이지면(목록에서 투표 등) 그쪽으로 이동
 * - bfcache 로 복원돼 로그아웃 상태 화면이 그대로 보이면 새로고침
 */
export function PostLoginRestore() {
  const router = useRouter()

  useEffect(() => {
    const target = consumePostLoginTarget()
    if (target && target !== currentPath()) router.push(target)

    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return
      const restored = consumePostLoginTarget()
      if (!restored) return
      if (restored === currentPath()) window.location.reload()
      else window.location.assign(restored)
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [router])

  return null
}
