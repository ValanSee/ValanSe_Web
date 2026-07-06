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
import { Button } from '@/components/common/Button'
import { Title } from '@/types/_shared/title'

interface TitleEquipModalProps {
  open: boolean
  title: Title | null
  pending: boolean
  onClose: () => void
  onConfirm: () => void
}

const TitleEquipModal = ({
  open,
  title,
  pending,
  onClose,
  onConfirm,
}: TitleEquipModalProps) => {
  if (!open || !title) return null

  return (
    <ModalOverlay onClose={onClose}>
      <Modal>
        <ModalHeader>
          <ModalTitle>대표 칭호로 장착할까요?</ModalTitle>
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>
        <ModalBody>
          <ModalDescription>
            <span className="font-semibold text-[#1D1D1D]">{title.title}</span>{' '}
            칭호를 대표 칭호로 설정합니다. 기존 장착 칭호는 자동으로
            해제됩니다.
          </ModalDescription>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onConfirm} disabled={pending}>
            {pending ? '장착 중...' : '장착'}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            취소
          </Button>
        </ModalFooter>
      </Modal>
    </ModalOverlay>
  )
}

export default TitleEquipModal
