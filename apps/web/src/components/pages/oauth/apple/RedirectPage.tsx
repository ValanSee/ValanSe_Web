'use client'

import OAuthRedirect from '@/components/pages/oauth/_shared/oauthRedirect'
import { appleLoginThunk } from '@/store/thunks/authThunks'
import { takePendingAppleLogin } from '@/utils/appleLogin'

/** Apple 로그인 버튼이 sessionStorage 에 넣어 둔 인증 값과 `?state=` 를 읽는다 */
function readAppleCallback() {
  const pending = takePendingAppleLogin()
  return {
    login: pending ? appleLoginThunk(pending) : null,
    state: new URLSearchParams(window.location.search).get('state'),
  }
}

export default function AppleRedirect() {
  return <OAuthRedirect method="apple" readCallback={readAppleCallback} />
}
