'use client'

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal'

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
  if (!open) return null

  return (
    <ModalOverlay onClose={onCloseAction} className="z-100">
      <Modal className="w-[90vw] max-w-none">
        <ModalHeader>
          <ModalTitle>정말 종료하시겠습니까?</ModalTitle>
          <ModalCloseButton onClick={onCloseAction} />
        </ModalHeader>

        <ModalFooter className="flex gap-2">
          <button
            type="button"
            onClick={onCloseAction}
            className="flex-1 h-[60px] bg-[#E4E4E4] rounded-lg text-[18px] text-[#8E8E8E] font-[400] hover:bg-[#D4D4D4] transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirmAction}
            className="flex-1 h-[60px] bg-[#839DB7] rounded-lg text-[18px] text-white font-[400] hover:bg-[#7289A3] transition-colors"
          >
            종료
          </button>
        </ModalFooter>
      </Modal>
    </ModalOverlay>
  )
}
