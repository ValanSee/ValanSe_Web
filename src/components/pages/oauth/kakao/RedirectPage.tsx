'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginThunk } from '@/store/thunks/authThunks'
import { fetchProfileThunk } from '@/store/thunks/memberThunks'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import Loading from '@/components/_shared/loading'

export default function KakaoRedirect() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')

    const handleLogin = async () => {
      if (code) {
        try {
          // 최소 0.8초 로딩 시간 보장
          const startTime = Date.now()

          // 1. 로그인 시도
          await dispatch(loginThunk(code))

          try {
            // 2. 프로필 조회 시도
            const profile = await dispatch(fetchProfileThunk())

            // 최소 0.8초 보장
            const elapsedTime = Date.now() - startTime
            const remainingTime = Math.max(0, 800 - elapsedTime)
            await new Promise((resolve) => setTimeout(resolve, remainingTime))

            if (profile) {
              // 프로필이 있으면 main 페이지로 이동
              router.push('/main')
            } else if (profile === null) {
              // 프로필이 없으면 onboarding 페이지로 이동
              router.push('/onboarding')
            } else {
              // 프로필 조회 실패
              router.push('/entry')
            }
          } catch {
            // fetchProfileThunk 실패
            setError('프로필 조회 실패')
            setTimeout(() => router.push('/entry'), 2000)
          }
        } catch {
          // loginThunk 실패
          setError('로그인 실패')
          setTimeout(() => router.push('/entry'), 2000)
        } finally {
          setIsLoading(false)
        }
      }
    }

    handleLogin()
  }, [dispatch, router])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-bold text-red-500 mb-4">{error}</p>
          <p className="text-gray-600">잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    )
  }

  return isLoading ? <Loading /> : null
}
