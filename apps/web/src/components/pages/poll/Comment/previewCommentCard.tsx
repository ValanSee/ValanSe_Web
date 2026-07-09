'use client'
import { Icon } from '@iconify/react'

interface CommentCardProps {
  content: string
  commentsNumber: number
}

const PreviewCommentCard = ({
  content,
  commentsNumber,
}: CommentCardProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-brand-violet-50 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 typo-title-03 text-primary">
          <Icon icon="tabler:crown" width={18} aria-hidden />
          베스트 댓글
        </div>
        <span className="typo-body-c-02 text-brand-gray-100">
          총 {commentsNumber}개
        </span>
      </div>
      <p className="typo-body-b-01 text-foreground">{content}</p>
    </div>
  )
}
export default PreviewCommentCard
