'use client'

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

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
  title = '진행하시겠습니까?',
  description = '이 작업은 되돌릴 수 없습니다.',
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <ModalOverlay onClose={onClose}>
      <Modal>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>

        <ModalBody>
          <ModalDescription>{description}</ModalDescription>
        </ModalBody>

        <ModalFooter>
          <Button variant="destructive" onClick={onConfirm}>
            확인
          </Button>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
        </ModalFooter>
      </Modal>
    </ModalOverlay>
  )
}
