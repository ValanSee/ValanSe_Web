'use client'

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal'

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
  if (!open) return null

  return (
    <ModalOverlay onClose={onClose}>
      <Modal className="w-[90vw] max-w-none">
        <ModalHeader className="pb-0">
          <ModalTitle>로그인이 필요합니다</ModalTitle>
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>

        <ModalBody>
          <ModalDescription className="text-base text-gray-600">
            로그인 후 이용해주세요.
          </ModalDescription>
        </ModalBody>

        <ModalFooter className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[60px] bg-[#E4E4E4] rounded-lg text-[18px] text-[#8E8E8E] font-[400] hover:bg-[#D4D4D4] transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="flex-1 h-[60px] bg-[#839DB7] rounded-lg text-[18px] text-white font-[400] hover:bg-[#7289A3] transition-colors"
          >
            로그인
          </button>
        </ModalFooter>
      </Modal>
    </ModalOverlay>
  )
}
