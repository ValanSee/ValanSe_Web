'use client'
import { useState, useEffect } from 'react'
import { fetchReplies, Reply } from '@/api/comment/commentApi'
import CommentInput from './commentInput'

interface ReplyListProps {
  voteId: number | string
  commentId: number
  replyCount: number
  isOpen: boolean
  onReplyCreated?: () => void
}

const ReplyList = ({
  voteId,
  commentId,
  replyCount,
  isOpen,
  onReplyCreated,
}: ReplyListProps) => {
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadReplies = async () => {
    try {
      setLoading(true)
      const response = await fetchReplies(voteId, commentId)
      console.log('Replies response:', response)
      setReplies(Array.isArray(response) ? response : response.replies || [])
    } catch (error) {
      console.error('Failed to fetch replies:', error)
      setError('대댓글을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && replyCount > 0) {
      loadReplies()
    }
  }, [voteId, commentId, replyCount, isOpen])

  const handleReplyCreated = async () => {
    await loadReplies()
    onReplyCreated?.()
  }

  if (!isOpen) {
    return <div className="mt-3 pl-4 border-l-2 border-gray-200"></div>
  }

  if (loading) {
    return (
      <div className="mt-3 pl-4 border-l-2 border-gray-200">
        <div className="text-sm text-gray-500">대댓글을 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-3 pl-4 border-l-2 border-gray-200">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
      {!replies || replies.length === 0 ? (
        <div className="text-sm text-gray-500">대댓글이 없습니다.</div>
      ) : (
        replies.map((reply, index) => (
          <div key={`${commentId}-reply-${index}`} className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="font-medium">{reply.nickname}</span>
              <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-gray-800">{reply.content}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>좋아요 {reply.likeCount}</span>
            </div>
          </div>
        ))
      )}

      {/* 대댓글 입력 - 항상 표시 */}
      <CommentInput
        voteId={voteId}
        parentId={commentId}
        onCommentCreated={handleReplyCreated}
        placeholder="대댓글을 남겨주세요"
      />
    </div>
  )
}

export default ReplyList
