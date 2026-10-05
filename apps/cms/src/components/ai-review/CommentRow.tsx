'use client'

import { useState } from 'react'
import { Bot, ThumbsUp, Trash2 } from 'lucide-react'
import { errorMessageOf } from '@/lib/api'
import { deleteComment } from '@/lib/comments'
import type { VoteComment } from '@/types/vote'

type Props = {
  comment: VoteComment
  /** 댓글이 달린 투표 제목 — AI 댓글 탭처럼 투표 맥락이 없는 곳에서만 넘긴다 */
  voteTitle?: string
  onDeleted: (commentId: number) => void
}

export function CommentRow({ comment, voteTitle, onDeleted }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDelete = async () => {
    if (busy) return
    if (!window.confirm('이 댓글을 삭제하시겠습니까?')) return
    setBusy(true)
    setError(null)
    try {
      await deleteComment(comment.commentId)
      onDeleted(comment.commentId)
    } catch (err) {
      setError(errorMessageOf(err, '삭제에 실패했습니다.'))
    } finally {
      setBusy(false)
    }
  }

  const meta = (
    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
      {comment.isBot && (
        <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 font-medium text-violet-700">
          <Bot className="h-3 w-3" />
          AI
        </span>
      )}
      <span>{comment.nickname}</span>
      {comment.voteOptionLabel && <span>· {comment.voteOptionLabel} 선택</span>}
      <span>· {comment.commentCreatedAt}</span>
      <span className="inline-flex items-center gap-1">
        · <ThumbsUp className="h-3 w-3" />
        {comment.likeCount}
      </span>
    </div>
  )

  const deleteButton = (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      aria-label="댓글 삭제"
      className="shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )

  return (
    <li className="flex items-start gap-2 py-2">
      <div className="min-w-0 flex-1">
        {voteTitle && (
          <p className="truncate text-xs text-gray-400">투표: {voteTitle}</p>
        )}
        {meta}
        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-gray-800">
          {comment.content}
        </p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      {deleteButton}
    </li>
  )
}
