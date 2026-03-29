'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { isTabRoute } from '@/utils/nativeBack'
import ExitConfirmModal from '@/components/ui/modal/exitConfirmModal'

export function NativeBackHandler() {
  const pathname = usePathname()
  const router = useRouter()
  const [showExitModal, setShowExitModal] = useState(false)

  const handleNativeBack = useCallback(() => {
    if (isTabRoute(pathname)) {
      setShowExitModal(true)
    } else {
      router.back()
    }
  }, [pathname, router])

  const handleExitConfirm = useCallback(() => {
    setShowExitModal(false)
    window.AndroidBridge?.closeApp()
  }, [])

  useEffect(() => {
    window.addEventListener('interceptNativeBack', handleNativeBack)
    return () => {
      window.removeEventListener('interceptNativeBack', handleNativeBack)
    }
  }, [handleNativeBack])

  return (
    <ExitConfirmModal
      open={showExitModal}
      onCloseAction={() => setShowExitModal(false)}
      onConfirmAction={handleExitConfirm}
    />
  )
}
