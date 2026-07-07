'use client'

import { Popup } from '@/components/ui/popup'

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = '진행하시겠어요?',
  description = '이 작업은 되돌릴 수 없어요',
}: ConfirmModalProps) {
  return (
    <Popup
      open={open}
      onClose={onClose}
      variant="confirm"
      title={title}
      description={description}
      confirmLabel="확인"
      cancelLabel="취소"
      onConfirm={onConfirm}
    />
  )
}
