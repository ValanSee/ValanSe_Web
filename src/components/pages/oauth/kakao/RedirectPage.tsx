'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginThunk } from '@/store/thunks/authThunks'
import { fetchProfileThunk } from '@/store/thunks/memberThunks'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { useAppSelector } from '@/hooks/utils/useAppSelector'

export default function KakaoRedirect() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code') // 코드 확인

    const handleLogin = async () => {
      if (code) {
        try {
          // 1. 로그인 시도
          await dispatch(loginThunk(code))
          try {
            // 2. 프로필 조회 시도
            const profile = await dispatch(fetchProfileThunk())
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
            alert('프로필 조회 실패')
            router.push('/entry')
          }
        } catch {
          // loginThunk 실패
          alert('로그인 실패')
          router.push('/entry')
        }
      }
    }

    handleLogin()
  }, [])

  // TODO: 로딩 스피너 디자인 나오면 반영
  return (
    <>
      {auth.loading ? (
        <div>로그인 중입니다...</div>
      ) : auth.error ? (
        <div>로그인 실패: {auth.error}</div>
      ) : (
        <div>로그인 성공</div>
      )}
    </>
  )
}
