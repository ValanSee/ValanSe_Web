import type { AppleLoginRequest } from '@/types/api/auth'

/** Apple Developer 에 등록한 웹 Services ID (서버 oauth.apple.client-ids 에도 등록) */
export const APPLE_WEB_CLIENT_ID = 'com.valanse.web'

const APPLE_JS_URL =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/ko_KR/appleid.auth.js'

/** 앱 BRIDGE_SCRIPT 와 맞춘 메시지 type · 결과 이벤트 이름 (Native App.tsx) */
const NATIVE_MESSAGE_TYPE = 'appleLogin'
const NATIVE_RESULT_EVENT = 'nativeAppleLogin'

/** 버튼에서 받은 Apple 인증 값을 콜백 화면(/oauth/apple/redirect)으로 넘기는 저장소 키 */
const PENDING_KEY = 'apple-login-pending'

type NativeAppleResult =
  | { identityToken: string; authorizationCode: string; name?: string }
  | { error: 'canceled' | 'failed' }

/** 사용자가 Apple 로그인 창을 닫음 (에러 화면 없이 그대로 둔다) */
export class AppleLoginCanceledError extends Error {}

/**
 * Apple 로그인 버튼을 보여줄지.
 * Android 앱 WebView 는 Apple JS 팝업이 열리지 않아 숨긴다 (Android 는 Apple 로그인 의무 아님).
 */
export function canUseAppleLogin(): boolean {
  if (window.__NATIVE_APPLE_LOGIN__) return true
  return !window.__ANDROID_BRIDGE_READY__
}

/** Apple JS 는 Services ID 에 등록한 Return URL 로만 동작 (valanse.kr · develop.valanse.kr) */
export function appleRedirectUri(): string {
  return `${window.location.origin}/oauth/apple/redirect`
}

/**
 * Apple 로그인 창을 띄워 서버(/auth/apple/login)에 보낼 값을 받는다.
 * iOS 앱은 네이티브 창, 그 외 브라우저는 Apple JS 팝업.
 */
export async function requestAppleCredential(): Promise<AppleLoginRequest> {
  return window.__NATIVE_APPLE_LOGIN__
    ? requestNativeCredential()
    : requestWebCredential()
}

function requestNativeCredential(): Promise<AppleLoginRequest> {
  return new Promise((resolve, reject) => {
    const onResult = (event: Event) => {
      window.removeEventListener(NATIVE_RESULT_EVENT, onResult)
      const result = (event as CustomEvent<NativeAppleResult>).detail
      if ('error' in result) {
        reject(
          result.error === 'canceled'
            ? new AppleLoginCanceledError()
            : new Error('Apple 로그인 실패'),
        )
        return
      }
      resolve(result)
    }
    window.addEventListener(NATIVE_RESULT_EVENT, onResult)
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: NATIVE_MESSAGE_TYPE }),
    )
  })
}

let appleJsLoading: Promise<void> | null = null

function loadAppleJs(): Promise<void> {
  if (window.AppleID) return Promise.resolve()
  appleJsLoading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = APPLE_JS_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      appleJsLoading = null
      reject(new Error('Apple JS 로드 실패'))
    }
    document.head.appendChild(script)
  })
  return appleJsLoading
}

async function requestWebCredential(): Promise<AppleLoginRequest> {
  await loadAppleJs()
  const redirectUri = appleRedirectUri()
  window.AppleID!.auth.init({
    clientId: APPLE_WEB_CLIENT_ID,
    scope: 'name email',
    redirectURI: redirectUri,
    usePopup: true,
  })
  try {
    const { authorization, user } = await window.AppleID!.auth.signIn()
    // 이름은 최초 동의 때만 온다
    const name = [user?.name?.lastName, user?.name?.firstName]
      .filter(Boolean)
      .join('')
    return {
      identityToken: authorization.id_token,
      authorizationCode: authorization.code,
      redirectUri,
      ...(name ? { name } : {}),
    }
  } catch (err) {
    // 팝업 닫기·취소는 { error: 'popup_closed_by_user' | 'user_cancelled_authorize' } 로 reject
    const code = (err as { error?: string })?.error
    if (
      code === 'popup_closed_by_user' ||
      code === 'user_cancelled_authorize'
    ) {
      throw new AppleLoginCanceledError()
    }
    throw err
  }
}

/** 버튼 → 콜백 화면으로 인증 값을 넘긴다 (URL 에 토큰을 싣지 않기 위해 sessionStorage) */
export function savePendingAppleLogin(request: AppleLoginRequest) {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(request))
}

/** 콜백 화면에서 한 번만 꺼내고 지운다 */
export function takePendingAppleLogin(): AppleLoginRequest | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    sessionStorage.removeItem(PENDING_KEY)
    return raw ? (JSON.parse(raw) as AppleLoginRequest) : null
  } catch {
    return null
  }
}
