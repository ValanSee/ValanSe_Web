'use client'

import { Popup } from '@/components/ui/popup'

interface LoginRequiredModalProps {
  open: boolean
  onClose: () => void
  onLogin: () => void
}

export default function LoginRequiredModal({
  open,
  onClose,
  onLogin,
}: LoginRequiredModalProps) {
  return (
    <Popup
      open={open}
      onClose={onClose}
      variant="confirm"
      title="로그인이 필요해요"
      description="로그인 후 이용해 주세요"
      confirmLabel="로그인"
      cancelLabel="취소"
      onConfirm={onLogin}
    />
  )
}
