'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icon } from '@/components/ui/icon'
import { safeRedirectPath } from '@/utils/authRedirect'
import {
  AppleLoginCanceledError,
  canUseAppleLogin,
  requestAppleCredential,
  savePendingAppleLogin,
} from '@/utils/appleLogin'

/**
 * Apple 로그인 (App Store 심사 4.8: 카카오 같은 제3자 로그인이 있으면 함께 제공).
 * iOS 앱은 네이티브 창, 브라우저는 Apple JS 팝업으로 인증 값을 받아 콜백 화면에서 서버 로그인한다.
 */
function AppleLoginButton() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const safeReturn = safeRedirectPath(searchParams.get('redirect'))

  // 앱 브릿지 플래그는 클라이언트에서만 알 수 있어 마운트 후 판단 (Android 앱 WebView 는 숨김)
  const [visible, setVisible] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => setVisible(canUseAppleLogin()), [])

  if (!visible) return null

  const goApple = async () => {
    setError(null)
    setPending(true)
    try {
      const credential = await requestAppleCredential()
      savePendingAppleLogin(credential)
      const state = safeReturn ? `?state=${encodeURIComponent(safeReturn)}` : ''
      // 엔트리 히스토리를 덮어써 로그인 후 뒤로가기 시 반복 방지 (카카오와 동일)
      router.replace(`/oauth/apple/redirect${state}`)
    } catch (err) {
      setPending(false)
      if (!(err instanceof AppleLoginCanceledError)) {
        setError('Apple 로그인에 실패했어요. 다시 시도해 주세요.')
      }
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-ds-2">
      <button
        type="button"
        onClick={goApple}
        disabled={pending}
        className="typo-label-02 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-black font-semibold text-white hover:brightness-110 disabled:opacity-60"
      >
        <Icon icon="ri:apple-fill" width={24} aria-hidden />
        Apple로 시작하기
      </button>
      {error && (
        <p role="alert" className="typo-label-03 text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export default AppleLoginButton
