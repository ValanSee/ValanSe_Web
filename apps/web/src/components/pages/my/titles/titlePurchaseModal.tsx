'use client'

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Title } from '@/types/_shared/title'

interface TitlePurchaseModalProps {
  open: boolean
  title: Title | null
  point: number
  pending: boolean
  onClose: () => void
  onConfirm: () => void
}

const TitlePurchaseModal = ({
  open,
  title,
  point,
  pending,
  onClose,
  onConfirm,
}: TitlePurchaseModalProps) => {
  if (!open || !title) return null

  const insufficient = point < title.price
  const remainingAfter = point - title.price

  return (
    <ModalOverlay onClose={onClose}>
      <Modal>
        <ModalHeader>
          <ModalTitle>칭호를 구매할까요?</ModalTitle>
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#8E8E8E]">칭호</span>
              <span className="font-semibold text-[#1D1D1D]">
                {title.title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8E8E8E]">가격</span>
              <span className="font-semibold text-[#EB5E28]">
                {title.price.toLocaleString()}P
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8E8E8E]">보유 포인트</span>
              <span className="text-[#1D1D1D]">
                {point.toLocaleString()}P
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#F0F0F0]">
              <span className="text-[#8E8E8E]">구매 후 잔액</span>
              <span
                className={`font-semibold ${
                  insufficient ? 'text-[#EB5E28]' : 'text-[#4D7298]'
                }`}
              >
                {insufficient
                  ? '포인트 부족'
                  : `${remainingAfter.toLocaleString()}P`}
              </span>
            </div>
          </div>
          {insufficient && (
            <p className="mt-3 text-xs text-[#EB5E28]">
              잔액이 부족합니다. 활동으로 포인트를 모아주세요.
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onConfirm}
            disabled={pending || insufficient}
          >
            {pending ? '구매 중...' : '구매'}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            취소
          </Button>
        </ModalFooter>
      </Modal>
    </ModalOverlay>
  )
}

export default TitlePurchaseModal
