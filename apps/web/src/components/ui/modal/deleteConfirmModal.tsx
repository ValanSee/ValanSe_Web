'use client'

import { Popup } from '@/components/ui/popup'

interface DeleteConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title = '삭제할까요?',
  description = '삭제한 항목은 복구할 수 없어요',
}: DeleteConfirmModalProps) {
  return (
    <Popup
      open={open}
      onClose={onClose}
      variant="confirm"
      title={title}
      description={description}
      confirmLabel="삭제"
      cancelLabel="취소"
      onConfirm={onConfirm}
    />
  )
}
