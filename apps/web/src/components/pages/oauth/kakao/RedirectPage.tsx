'use client'

import OAuthRedirect from '@/components/pages/oauth/_shared/oauthRedirect'
import { loginThunk } from '@/store/thunks/authThunks'

/** 카카오 인가 후 `?code=&state=` 로 돌아오는 콜백 */
function readKakaoCallback() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  // redirectUri는 카카오 authorize 단계에서 사용한 값과 동일해야 함
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!
  return {
    login: code ? loginThunk(code, redirectUri) : null,
    state: params.get('state'),
  }
}

export default function KakaoRedirect() {
  return <OAuthRedirect method="kakao" readCallback={readKakaoCallback} />
}
