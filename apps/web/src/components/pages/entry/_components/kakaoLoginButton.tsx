'use client'

import { useSearchParams } from 'next/navigation'
import { Icon } from '@iconify/react'
import { safeRedirectPath } from '@/utils/authRedirect'

function KakaoLoginButton() {
  const searchParams = useSearchParams()
  const fromQuery = searchParams.get('redirect')
  const safeReturn = safeRedirectPath(fromQuery)

  const KAKAO_URL = process.env.NEXT_PUBLIC_KAKAO_URL!
  const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!
  const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!

  const stateParam = safeReturn
    ? `&state=${encodeURIComponent(safeReturn)}`
    : ''

  const AUTH_URI = `${KAKAO_URL}?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code${stateParam}`

  const goKakao = () => {
    // 엔트리 히스토리를 덮어써 로그인 후 뒤로가기 시 반복 방지
    window.location.replace(AUTH_URI)
  }

  return (
    <button
      type="button"
      onClick={goKakao}
      className="typo-label-01 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-kakao text-brand-black hover:brightness-95"
    >
      <Icon icon="ri:kakao-talk-fill" width={24} aria-hidden />
      카카오로 로그인
    </button>
  )
}

export default KakaoLoginButton
