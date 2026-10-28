'use client'

import { Popup } from '@/components/ui/popup'

interface AppUpdateModalProps {
  open: boolean
  onCloseAction: () => void
  onConfirmAction: () => void
}

export default function AppUpdateModal({
  open,
  onCloseAction,
  onConfirmAction,
}: AppUpdateModalProps) {
  return (
    <Popup
      open={open}
      onClose={onCloseAction}
      variant="confirm"
      title="새 버전이 나왔어요"
      description={
        <>
          지금 버전에서는 일부 기능이
          <br />
          동작하지 않을 수 있어요.
          <br />
          업데이트 후 이용해 주세요.
        </>
      }
      confirmLabel="업데이트"
      cancelLabel="나중에"
      onConfirm={onConfirmAction}
    />
  )
}
