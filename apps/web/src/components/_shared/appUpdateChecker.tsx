'use client'

import { useCallback, useEffect, useState } from 'react'
import AppUpdateModal from '@/components/ui/modal/appUpdateModal'
import {
  APP_STORE_URL,
  MIN_SUPPORTED_APP_VERSION,
  getAppVersion,
} from '@/constants/appVersion'

// "나중에" 를 누르면 이번 실행 동안은 다시 띄우지 않는다. 앱을 새로 켜면 다시 뜸
const DISMISSED_KEY = 'app-update-dismissed'

// Android 의 브릿지 사전 주입은 늦을 수 있어 잠시 재확인 (layout APP_NO_ZOOM_SCRIPT 와 같은 이유)
const DETECT_INTERVAL_MS = 300
const DETECT_ATTEMPTS = 10

function isDismissed() {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

export function AppUpdateChecker() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (MIN_SUPPORTED_APP_VERSION <= 0 || isDismissed()) return

    let attempts = 0
    const check = () => {
      // 우리 앱은 모든 버전이 __ANDROID_BRIDGE_READY__ 를 심는다 (다른 WebView 와 구분)
      if (!window.__ANDROID_BRIDGE_READY__) return false
      if (getAppVersion() < MIN_SUPPORTED_APP_VERSION) setOpen(true)
      return true
    }
    if (check()) return

    const timer = setInterval(() => {
      attempts += 1
      if (check() || attempts >= DETECT_ATTEMPTS) clearInterval(timer)
    }, DETECT_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // 저장소를 못 쓰면 닫기만 하고 다음 페이지 진입 시 다시 확인
    }
  }, [])

  const handleUpdate = useCallback(() => {
    window.location.href = APP_STORE_URL
  }, [])

  return (
    <AppUpdateModal
      open={open}
      onCloseAction={handleClose}
      onConfirmAction={handleUpdate}
    />
  )
}
