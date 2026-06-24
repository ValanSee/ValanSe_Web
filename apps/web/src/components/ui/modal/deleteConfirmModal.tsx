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
  title = '삭제하시겠습니까?',
  description = '이 작업은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?',
}: DeleteConfirmModalProps) {
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
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            삭제
          </Button>
        </ModalFooter>
      </Modal>
    </ModalOverlay>
  )
}
