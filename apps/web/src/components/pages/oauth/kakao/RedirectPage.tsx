'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginThunk } from '@/store/thunks/authThunks'
import { fetchProfileThunk } from '@/store/thunks/memberThunks'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import Loading from '@/components/_shared/loading'
import {
  entryHrefWithRedirect,
  rememberPostAuthRedirect,
  returnToLoginOrigin,
  safeRedirectPath,
} from '@/utils/authRedirect'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_COLUMN } from '@/constants/layout'
import { trackEvent } from '@/lib/analytics'

export default function KakaoRedirect() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const oauthState = params.get('state')
    const redirectAfterLogin = safeRedirectPath(oauthState)

    const handleLogin = async () => {
      if (code) {
        try {
          // 최소 0.8초 로딩 시간 보장
          const startTime = Date.now()

          // 1. 로그인 시도
          // redirectUri는 카카오 authorize 단계에서 사용한 값과 동일해야 함
          const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!
          await dispatch(loginThunk(code, redirectUri))
          trackEvent('login', { method: 'kakao' })

          try {
            // 2. 프로필 조회 시도
            const profile = await dispatch(fetchProfileThunk())

            // 최소 0.8초 보장
            const elapsedTime = Date.now() - startTime
            const remainingTime = Math.max(0, 800 - elapsedTime)
            await new Promise((resolve) => setTimeout(resolve, remainingTime))

            if (profile) {
              const target = redirectAfterLogin ?? '/'
              // 원래 화면 기록 위치로 되돌아가 뒤로가기가 카카오 로그인으로 가지 않게 한다
              if (!returnToLoginOrigin(target)) router.replace(target)
            } else if (profile === null) {
              // 프로필 없음 = 신규 가입 (온보딩으로 이동)
              trackEvent('sign_up', { method: 'kakao' })
              if (redirectAfterLogin) {
                rememberPostAuthRedirect(redirectAfterLogin)
              }
              router.replace('/onboarding')
            } else {
              router.replace(
                redirectAfterLogin
                  ? entryHrefWithRedirect(redirectAfterLogin)
                  : '/entry',
              )
            }
          } catch {
            // fetchProfileThunk 실패
            setError('프로필 조회 실패')
            setTimeout(
              () =>
                router.replace(
                  redirectAfterLogin
                    ? entryHrefWithRedirect(redirectAfterLogin)
                    : '/entry',
                ),
              2000,
            )
          }
        } catch {
          // loginThunk 실패
          setError('로그인 실패')
          setTimeout(
            () =>
              router.replace(
                redirectAfterLogin
                  ? entryHrefWithRedirect(redirectAfterLogin)
                  : '/entry',
              ),
            2000,
          )
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    void handleLogin()
  }, [dispatch, router])

  if (error) {
    return (
      <div
        className={cn(
          'flex min-h-screen items-center justify-center bg-card',
          DESKTOP_PAGE_COLUMN,
        )}
      >
        <div className="text-center">
          <p className="typo-heading-05 mb-4 text-destructive">{error}</p>
          <p className="typo-body-b-01 text-brand-gray-200">
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        </div>
      </div>
    )
  }

  return isLoading ? <Loading /> : null
}
