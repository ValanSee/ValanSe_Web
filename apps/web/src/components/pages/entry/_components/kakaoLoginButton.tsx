'use client'

import { useSearchParams } from 'next/navigation'
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
    // replace: 엔트리 히스토리를 덮어써서 로그인 후 뒤로가기 시 로그인/콜백 단계가 반복되지 않게 함
    window.location.replace(AUTH_URI)
  }

  return (
    <button
      type="button"
      onClick={goKakao}
      // 카카오 브랜드 가이드 준수: #FEE500 · 검정 텍스트. §8 예외.
      className="mb-4 flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3 typo-body-b-01 text-brand-black shadow-sm hover:brightness-95"
    >
      카카오로 로그인
    </button>
  )
}

export default KakaoLoginButton
