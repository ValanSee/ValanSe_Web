'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AppDispatch } from '@/store/store'
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

/** 소셜 로그인 thunk (loginThunk · appleLoginThunk) */
export type OAuthLoginAction = (dispatch: AppDispatch) => Promise<void>

type OAuthRedirectProps = {
  /** analytics method 값 */
  method: 'kakao' | 'apple'
  /** 콜백에서 로그인 요청과 로그인 후 복귀 경로(state)를 꺼낸다. 로그인할 값이 없으면 login 은 null */
  readCallback: () => { login: OAuthLoginAction | null; state: string | null }
}

/**
 * 소셜 로그인 콜백 공통 화면: 서버 로그인 → 프로필 조회 → 기존 회원은 복귀 경로, 신규는 온보딩
 */
export default function OAuthRedirect({
  method,
  readCallback,
}: OAuthRedirectProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { login, state } = readCallback()
    const redirectAfterLogin = safeRedirectPath(state)

    const handleLogin = async () => {
      if (login) {
        try {
          // 최소 0.8초 로딩 시간 보장
          const startTime = Date.now()

          // 1. 로그인 시도
          await dispatch(login)
          trackEvent('login', { method })

          try {
            // 2. 프로필 조회 시도
            const profile = await dispatch(fetchProfileThunk())

            // 최소 0.8초 보장
            const elapsedTime = Date.now() - startTime
            const remainingTime = Math.max(0, 800 - elapsedTime)
            await new Promise((resolve) => setTimeout(resolve, remainingTime))

            if (profile) {
              const target = redirectAfterLogin ?? '/'
              // 원래 화면 기록 위치로 되돌아가 뒤로가기가 소셜 로그인 화면으로 가지 않게 한다
              if (!returnToLoginOrigin(target)) router.replace(target)
            } else if (profile === null) {
              // 프로필 없음 = 신규 가입 (온보딩으로 이동)
              trackEvent('sign_up', { method })
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
        // 로그인할 값 없이 들어옴 (직접 접근·새로고침) → 로그인 화면으로
        router.replace(
          redirectAfterLogin
            ? entryHrefWithRedirect(redirectAfterLogin)
            : '/entry',
        )
      }
    }

    void handleLogin()
    // readCallback 은 모듈 함수라 바뀌지 않음. 콜백 값은 진입 시 한 번만 읽는다
  }, [dispatch, router, method, readCallback])

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
