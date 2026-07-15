'use client'

import { Popup } from '@/components/ui/popup'

interface ExitConfirmModalProps {
  open: boolean
  onCloseAction: () => void
  onConfirmAction: () => void
}

export default function ExitConfirmModal({
  open,
  onCloseAction,
  onConfirmAction,
}: ExitConfirmModalProps) {
  return (
    <Popup
      open={open}
      onClose={onCloseAction}
      variant="confirm"
      title="정말 종료할까요?"
      confirmLabel="종료"
      cancelLabel="취소"
      onConfirm={onConfirmAction}
    />
  )
}
