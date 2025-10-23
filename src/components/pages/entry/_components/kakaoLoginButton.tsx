function KakaoLoginButton() {
  const KAKAO_URL = process.env.NEXT_PUBLIC_KAKAO_URL!
  const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!
  const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!

  const AUTH_URI = `${KAKAO_URL}?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`

  return (
    <a
      href={AUTH_URI}
      className="w-full max-w-xs bg-[#FEE500] text-black flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow-sm hover:brightness-95 mb-4"
    >
      카카오로 로그인
    </a>
  )
}

export default KakaoLoginButton
