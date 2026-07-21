'use client'

import { Popup } from '@/components/ui/popup'
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
    <Popup
      open={open}
      onClose={pending ? () => {} : onClose}
      variant="confirm"
      title="대표 칭호로 장착할까요?"
      description={
        <>
          <span className="typo-title-03 text-foreground">{title.title}</span>{' '}
          칭호를 대표로 설정해요. 기존 장착 칭호는 자동으로 해제돼요.
        </>
      }
      confirmLabel={pending ? '장착 중…' : '장착'}
      cancelLabel="취소"
      onConfirm={onConfirm}
    />
  )
}

export default TitleEquipModal
