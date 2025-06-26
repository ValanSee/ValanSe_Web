function KakaoLoginButton() {
  const KAKAO_URL = 'https://kauth.kakao.com/oauth/authorize'
  const KAKAO_CLIENT_ID = 'dfb1600c00bc8120aee6d3abceeeac85'
  const KAKAO_REDIRECT_URI =
    'https://valanse-sooty.vercel.app/oauth/kakao/redirect'

  const AUTH_URI = `${KAKAO_URL}?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`

  return (
    <button className="w-full max-w-xs bg-[#FEE500] text-black flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow-sm hover:brightness-95 mb-4">
      <a href={AUTH_URI}>카카오로 로그인</a>
    </button>
  )
}

export default KakaoLoginButton
