'use client'
import { Dispatch, SetStateAction } from 'react'
import { Icon } from '@iconify/react'

interface CommentCardProps {
  content: string
  commentsNumber: number
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const PreviewCommentCard = ({
  content,
  commentsNumber,
  open,
  setOpen,
}: CommentCardProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-[0_0_4px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 typo-title-03 text-foreground">
          <Icon
            icon="tabler:message"
            className="text-brand-gray-100"
            width={18}
            aria-hidden
          />
          댓글
          <span className="typo-body-c-01 text-brand-gray-100">
            {commentsNumber}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="typo-label-03 text-primary"
        >
          {open ? '접기' : '자세히 보기'}
        </button>
      </div>
      <p className="typo-body-b-01 text-brand-gray-200">{content}</p>
    </div>
  )
}
export default PreviewCommentCard
