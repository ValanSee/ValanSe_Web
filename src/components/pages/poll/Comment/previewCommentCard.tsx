'use client'
import { useState } from 'react'
import CommentDetail from './commentDetail'

interface CommentCardProps {
  content: string
  commentsNumber: number
}
const PreviewCommentCard = ({ content, commentsNumber }: CommentCardProps) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      {' '}
      <div className="bg-box p-4 border-shadow rounded-xl">
        <div className="flex justify-between text-sm text-muted-foreground gap-2">
          <div className="flex column items-center">
            <span className="font-semibold text-black mr-2">댓글</span>

            <span>{commentsNumber}</span>
          </div>
          <button onClick={() => setOpen(!open)} className="transition">
            {open ? '접기' : '자세히 보기'}
          </button>
        </div>
        <p className="mt-1">{content}</p>
        <div className="flex gap-4 mt-2 text-sm text-muted-foreground"></div>
      </div>
      {open && <CommentDetail />}
    </>
  )
}
export default PreviewCommentCard
