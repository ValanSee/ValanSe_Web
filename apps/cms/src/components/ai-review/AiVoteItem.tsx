'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageCircle,
  ThumbsUp,
  Trash2,
} from 'lucide-react'
import { errorMessageOf } from '@/lib/api'
import { categoryLabel } from '@/lib/category'
import { fetchComments } from '@/lib/comments'
import { deleteVote } from '@/lib/votes'
import type { Vote, VoteComment } from '@/types/vote'
import { CommentRow } from './CommentRow'

const WEB_ORIGIN = process.env.NEXT_PUBLIC_WEB_ORIGIN

type Props = {
  vote: Vote
  onDeleted: (voteId: number) => void
}

export function AiVoteItem({ vote, onDeleted }: Props) {
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState<VoteComment[] | null>(null)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadComments = async () => {
    setCommentsLoading(true)
    setError(null)
    try {
      const data = await fetchComments(vote.id)
      setComments(data.comments.filter((c) => !c.deletedAt))
    } catch (err) {
      setError(errorMessageOf(err, '댓글을 불러오지 못했습니다.'))
    } finally {
      setCommentsLoading(false)
    }
  }

  const onToggle = () => {
    const next = !open
    setOpen(next)
    if (next && comments === null) loadComments()
  }

  const onDelete = async () => {
    if (busy) return
    if (!window.confirm(`"${vote.title}" 투표를 삭제하시겠습니까?`)) return
    setBusy(true)
    setError(null)
    try {
      await deleteVote(vote.id)
      onDeleted(vote.id)
    } catch (err) {
      setError(errorMessageOf(err, '삭제에 실패했습니다.'))
      setBusy(false)
    }
  }

  const onCommentDeleted = (commentId: number) => {
    setComments((prev) => prev?.filter((c) => c.commentId !== commentId) ?? null)
  }

  const summary = (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
          {categoryLabel(vote.category)}
        </span>
        <span className="truncate text-xs text-gray-500">
          {vote.nickname} · {vote.created_at}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-gray-900">{vote.title}</p>
      {vote.content && (
        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-gray-600">
          {vote.content}
        </p>
      )}
      <ol className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
        {vote.options.map((o, i) => (
          <li
            key={o.id}
            className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700"
          >
            {String.fromCharCode(65 + i)}. {o.content}
          </li>
        ))}
      </ol>
      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1">
          <ThumbsUp className="h-3.5 w-3.5" />
          {vote.total_vote_count}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" />
          {vote.total_comment_count}
        </span>
      </div>
    </div>
  )

  const actions = (
    <div className="flex shrink-0 items-center gap-1">
      {WEB_ORIGIN && (
        <a
          href={`${WEB_ORIGIN}/poll/${vote.id}`}
          target="_blank"
          rel="noreferrer"
          aria-label="웹에서 보기"
          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        aria-label="투표 삭제"
        className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )

  const commentToggle = (
    <button
      type="button"
      onClick={onToggle}
      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900"
    >
      {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      댓글 {open ? '접기' : '보기'}
    </button>
  )

  const commentSection = open && (
    <div className="mt-2 rounded-md border border-gray-100 bg-gray-50 px-3">
      {commentsLoading ? (
        <p className="py-3 text-xs text-gray-500">불러오는 중...</p>
      ) : comments && comments.length === 0 ? (
        <p className="py-3 text-xs text-gray-500">댓글이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {comments?.map((c) => (
            <CommentRow key={c.commentId} comment={c} onDeleted={onCommentDeleted} />
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <li className="px-4 py-3">
      <div className="flex items-start gap-3">
        {summary}
        {actions}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {commentToggle}
      {commentSection}
    </li>
  )
}
