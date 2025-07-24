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
      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <div className="flex justify-between text-sm text-gray-500 gap-2">
          <div className="flex items-center">
            <span className="font-semibold text-black mr-2">댓글</span>
            <span>{commentsNumber}</span>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="transition text-blue-600 font-medium"
          >
            {open ? '접기' : '자세히 보기'}
          </button>
        </div>
        <p className="mt-2 text-gray-800 text-sm">{content}</p>
      </div>
    </>
  )
}
export default PreviewCommentCard
