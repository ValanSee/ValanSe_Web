'use client'

import { Popup } from '@/components/ui/popup'
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

  const description = (
    <div className="flex flex-col gap-2 text-left typo-body-b-01">
      <div className="flex justify-between">
        <span className="text-brand-gray-100">칭호</span>
        <span className="text-foreground">{title.title}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-brand-gray-100">가격</span>
        <span className="text-destructive">
          {title.price.toLocaleString()}P
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-brand-gray-100">보유</span>
        <span className="text-foreground">{point.toLocaleString()}P</span>
      </div>
      <div className="mt-1 flex justify-between border-t border-brand-gray-75 pt-2">
        <span className="text-brand-gray-100">구매 후 잔액</span>
        <span
          className={
            insufficient ? 'text-destructive' : 'text-primary'
          }
        >
          {insufficient
            ? '포인트 부족'
            : `${remainingAfter.toLocaleString()}P`}
        </span>
      </div>
      {insufficient && (
        <p className="typo-body-c-02 mt-1 text-destructive">
          잔액이 부족해요. 활동으로 포인트를 모아주세요.
        </p>
      )}
    </div>
  )

  return (
    <Popup
      open={open}
      onClose={pending ? () => {} : onClose}
      variant="confirm"
      title="칭호를 구매할까요?"
      description={description}
      confirmLabel={pending ? '구매 중…' : '구매'}
      cancelLabel="취소"
      onConfirm={() => {
        if (!insufficient) onConfirm()
      }}
    />
  )
}

export default TitlePurchaseModal
