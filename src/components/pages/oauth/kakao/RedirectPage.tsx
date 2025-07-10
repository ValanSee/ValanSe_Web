'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginThunk } from '@/store/thunks/authThunks'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { fetchProfileThunk } from '@/store/thunks/authThunks'

export default function KakaoRedirect() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')

    if (code) {
      try {
        dispatch(loginThunk(code))
      } catch (err) {
        console.error('로그인 실패', err)
        router.push('/entry')
      }

      try {
        dispatch(fetchProfileThunk())
      } catch (err) {
        console.error('프로필 조회 실패', err)
        router.push('/onboarding')
      }
    }
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
