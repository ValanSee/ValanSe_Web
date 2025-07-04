'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginThunk } from '@/store/thunks/authThunks'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { useAppSelector } from '@/hooks/utils/useAppSelector'

export default function KakaoRedirect() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')

    if (code) {
      try {
        dispatch(loginThunk(code))
        router.push('/onboarding')
      } catch (err) {
        console.error('로그인 실패', err)
      }
    }
  }, [])

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
