'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import Loading from '@/components/_shared/loading'
import {
  buildCurrentReturnPath,
  entryHrefWithRedirect,
} from '@/utils/authRedirect'
import { getAccessToken } from '@/utils/tokenUtils'

/** 이 경로들은 액세스 토큰 + Redux 세션(isLogined) 필요 */
function requiresStrictAuth(pathname: string): boolean {
  if (pathname === '/create' || pathname.startsWith('/create/')) return true
  if (pathname === '/my' || pathname.startsWith('/my/')) return true
  if (
    pathname === '/account-deletion' ||
    pathname.startsWith('/account-deletion/')
  )
    return true
  return false
}

function AuthGuardInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isLogined = useAppSelector((s) => s.auth.isLogined)

  const returnPath = useMemo(
    () => buildCurrentReturnPath(pathname, searchParams),
    [pathname, searchParams],
  )

  const strict = requiresStrictAuth(pathname)
  const hasToken = Boolean(getAccessToken())

  useEffect(() => {
    if (!strict) return
    if (!getAccessToken()) {
      router.replace(entryHrefWithRedirect(returnPath))
    }
  }, [strict, returnPath, router])

  if (!strict) {
    return <>{children}</>
  }

  if (!hasToken) {
    return <Loading />
  }

  if (!isLogined) {
    return <Loading />
  }

  return <>{children}</>
}

/**
 * (auth) 레이아웃용: 일부 경로만 로그인 강제.
 * `useSearchParams` 때문에 Suspense로 감싸서 export.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loading />}>
      <AuthGuardInner>{children}</AuthGuardInner>
    </Suspense>
  )
}
