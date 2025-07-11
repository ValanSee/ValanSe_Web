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
    const code = new URLSearchParams(window.location.search).get('code')

    const handleLogin = async () => {
      if (code) {
        try {
          // 1. 로그인 시도
          await dispatch(loginThunk(code))
          // 2. 프로필 조회 시도
          try {
            const profile = await dispatch(fetchProfileThunk())
            if (profile) {
              alert(`Profile이 있습니다. ${profile}`)
              router.push('/main')
            } else {
              alert('Profile이 없습니다.')
              router.push('/onboarding')
            }
          } catch (profileErr) {
            // 프로필이 없으면 onboarding 페이지로 이동
            console.error('프로필이 없습니다:', profileErr)
            router.push('/onboarding')
          }
        } catch (loginErr) {
          console.error('로그인 실패', loginErr)
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
