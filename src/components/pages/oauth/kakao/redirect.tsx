'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function KakaoRedirect() {
  const router = useRouter()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')

    if (code) {
      axios
        .post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/kakao/login`, { code })
        .then((res) => {
          // 토큰 저장
          localStorage.setItem('accessToken', res.data.accessToken)
          localStorage.setItem('refreshToken', res.data.refreshToken)
          router.push('/onboarding') // 온보딩으로 리디렉션
        })
        .catch((err) => {
          console.error('로그인 실패', err)
        })
    }
  }, [])

  return <div>로그인 중입니다...</div>
}
