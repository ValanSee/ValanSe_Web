'use client'
import { Dispatch, SetStateAction } from 'react'

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
    <>
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
      </div>
    </>
  )
}
export default PreviewCommentCard
