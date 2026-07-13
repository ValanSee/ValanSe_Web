'use client'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import {
  Comment,
  fetchComments,
  fetchReplies,
  Reply,
  toggleCommentLike,
  deleteComment,
} from '@/api/comment/commentApi'
import { Popup } from '@/components/ui/popup'
import { Profile } from '@/types/member'
import { cn } from '@/lib/utils'
import CommentInput from './commentInput'

interface CommentDetailProps {
  comments?: Comment[]
  voteId?: number | string
  onClose?: () => void
  profile: Profile | null
  postLoginReturnPath?: string
}

const CommentDetail = ({
  comments = [],
  voteId,
  onClose,
  profile,
  postLoginReturnPath,
}: CommentDetailProps) => {
  const [openReplies, setOpenReplies] = useState<Record<number, boolean>>({})
  const [currentSort, setCurrentSort] = useState<'popular' | 'latest'>('popular')
  const [localComments, setLocalComments] = useState<Comment[]>(comments)
  const [loading, setLoading] = useState(false)
  const [replies, setReplies] = useState<Record<number, Reply[]>>({})
  const [repliesLoading, setRepliesLoading] = useState<Record<number, boolean>>(
    {},
  )
  const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({})
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    commentId: number | null
  }>({ isOpen: false, commentId: null })

  useEffect(() => setLocalComments(comments), [comments])

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('.menu-container')) setOpenMenus({})
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const toggleReplies = async (commentId: number) => {
    if (openReplies[commentId]) {
      setOpenReplies((prev) => ({ ...prev, [commentId]: false }))
      return
    }
    setOpenReplies((prev) => ({ ...prev, [commentId]: true }))
    if (!replies[commentId] && voteId) {
      setRepliesLoading((prev) => ({ ...prev, [commentId]: true }))
      try {
        const response = await fetchReplies(voteId, commentId)
        const list = Array.isArray(response) ? response : response.replies || []
        setReplies((prev) => ({ ...prev, [commentId]: list }))
      } catch (e) {
        console.error('Failed to fetch replies:', e)
      } finally {
        setRepliesLoading((prev) => ({ ...prev, [commentId]: false }))
      }
    }
  }

  const handleSortChange = async (sort: 'popular' | 'latest') => {
    if (!voteId) return
    setCurrentSort(sort)
    setLoading(true)
    try {
      const r = await fetchComments(voteId, { sort })
      setLocalComments(r.comments)
    } catch (e) {
      console.error('댓글 정렬 실패:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleReplyCreated = async (commentId: number) => {
    if (!voteId) return
    try {
      const r = await fetchReplies(voteId, commentId)
      const list = Array.isArray(r) ? r : r.replies || []
      setReplies((prev) => ({ ...prev, [commentId]: list }))
      const cr = await fetchComments(voteId, { sort: currentSort })
      setLocalComments(cr.comments)
    } catch (e) {
      console.error('대댓글 새로고침 실패:', e)
    }
  }

  const handleLikeToggle = async (commentId: number) => {
    if (!voteId) return
    try {
      const r = await toggleCommentLike(voteId, commentId)
      setLocalComments((prev) =>
        prev.map((c) =>
          c.commentId === commentId ? { ...c, likeCount: r.likeCount } : c,
        ),
      )
    } catch (e) {
      console.error('좋아요 실패:', e)
      alert('좋아요 처리에 실패했습니다.')
    }
  }

  const handleReplyLikeToggle = async (commentId: number, replyId: number) => {
    if (!voteId) return
    try {
      const r = await toggleCommentLike(voteId, replyId)
      setReplies((prev) => ({
        ...prev,
        [commentId]:
          prev[commentId]?.map((reply) =>
            reply.id === replyId ? { ...reply, likeCount: r.likeCount } : reply,
          ) || [],
      }))
    } catch (e) {
      console.error('대댓글 좋아요 실패:', e)
      alert('좋아요 처리에 실패했습니다.')
    }
  }

  const confirmDelete = async () => {
    const { commentId } = deleteModal
    if (!commentId || !voteId) return
    try {
      await deleteComment(commentId)
      const r = await fetchComments(voteId, { sort: currentSort })
      setLocalComments(r.comments)
      setDeleteModal({ isOpen: false, commentId: null })
    } catch (e) {
      console.error('댓글 삭제 실패:', e)
      alert('댓글 삭제에 실패했습니다.')
    }
  }

  const formatTimeAgo = (daysAgo: number, hoursAgo: number) => {
    if (daysAgo > 0) return `${daysAgo}일 전`
    if (hoursAgo > 0) return `${hoursAgo}시간 전`
    return '방금 전'
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-[0_0_4px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between">
        <h3 className="typo-title-02 text-foreground">
          댓글{' '}
          <span className="text-brand-gray-100">{localComments.length}</span>
        </h3>
        <div className="flex gap-1">
          {(['popular', 'latest'] as const).map((s) => (
            <button
              key={s}
              type="button"
              disabled={loading}
              onClick={() => handleSortChange(s)}
              className={cn(
                'typo-label-03 rounded-full px-3 py-1 transition-colors',
                currentSort === s
                  ? 'bg-brand-violet-50 text-primary'
                  : 'text-brand-gray-200 hover:bg-brand-gray-50',
                loading && 'cursor-not-allowed opacity-50',
              )}
            >
              {s === 'popular' ? '인기순' : '최신순'}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <p className="typo-body-c-01 py-4 text-center text-brand-gray-100">
          댓글을 불러오는 중…
        </p>
      )}

      {!loading &&
        localComments.map((comment, idx) => {
          const key = `${comment.commentId}-${idx}`
          const commentReplies = replies[comment.commentId] || []
          const isRepliesLoading = repliesLoading[comment.commentId] || false
          const isMenuOpen = openMenus[comment.commentId]
          const canManage =
            profile?.role === 'ADMIN' ||
            (profile && comment.nickname === profile.nickname)

          return (
            <article key={key} className="flex flex-col gap-2 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gray-75 typo-label-03 text-primary-foreground">
                    {comment.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="typo-label-03 text-foreground">
                      {comment.nickname}
                    </span>
                    <span className="typo-body-c-02 text-brand-gray-100">
                      {formatTimeAgo(comment.daysAgo, comment.hoursAgo)}
                    </span>
                  </div>
                </div>
                {canManage && (
                  <div className="menu-container relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenus((prev) => ({
                          ...prev,
                          [comment.commentId]: !prev[comment.commentId],
                        }))
                      }
                      aria-label="댓글 메뉴"
                      className="p-1 text-brand-gray-100"
                    >
                      <Icon icon="tabler:dots-vertical" width={18} />
                    </button>
                    {isMenuOpen && (
                      <div className="absolute right-0 top-8 z-10 min-w-[120px] rounded-xl bg-card shadow-[0_0_8px_rgba(0,0,0,0.12)]">
                        <button
                          type="button"
                          className="typo-label-03 flex w-full items-center gap-2 px-4 py-2 text-destructive"
                          onClick={() => {
                            setDeleteModal({
                              isOpen: true,
                              commentId: comment.commentId,
                            })
                            setOpenMenus({})
                          }}
                        >
                          <Icon icon="tabler:trash" width={16} />
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="typo-body-b-01 whitespace-pre-wrap text-foreground">
                {comment.label && (
                  <span className="mr-1 text-primary">{comment.label}</span>
                )}
                {comment.content}
              </p>

              <div className="flex items-center gap-4 typo-body-c-02 text-brand-gray-100">
                <button
                  type="button"
                  onClick={() => handleLikeToggle(comment.commentId)}
                  className="flex items-center gap-1"
                >
                  <Icon icon="tabler:heart" width={16} />
                  <span>{comment.likeCount}</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleReplies(comment.commentId)}
                  className="flex items-center gap-1"
                >
                  <Icon icon="tabler:message" width={16} />
                  <span>{comment.replyCount}</span>
                  <Icon
                    icon={
                      openReplies[comment.commentId]
                        ? 'icon-park-outline:up'
                        : 'icon-park-outline:down'
                    }
                    width={14}
                  />
                </button>
              </div>

              {openReplies[comment.commentId] && (
                <div className="mt-2 flex flex-col gap-3 border-l-2 border-brand-gray-75 pl-4">
                  {isRepliesLoading && (
                    <p className="typo-body-c-02 text-brand-gray-100">
                      대댓글을 불러오는 중…
                    </p>
                  )}
                  {!isRepliesLoading && commentReplies.length === 0 && (
                    <p className="typo-body-c-02 text-brand-gray-100">
                      대댓글이 없어요
                    </p>
                  )}
                  {!isRepliesLoading &&
                    commentReplies.map((reply, ri) => (
                      <div
                        key={`${comment.commentId}-reply-${ri}`}
                        className="flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-2 typo-body-c-02 text-brand-gray-100">
                          <span className="typo-label-03 text-foreground">
                            {reply.nickname}
                          </span>
                          <span>
                            {formatTimeAgo(reply.daysAgo, reply.hoursAgo)}
                          </span>
                        </div>
                        <p className="typo-body-b-01 text-foreground">
                          {reply.content}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            handleReplyLikeToggle(comment.commentId, reply.id)
                          }
                          className="typo-body-c-02 flex items-center gap-1 text-brand-gray-100"
                        >
                          <Icon icon="tabler:heart" width={14} />
                          <span>{reply.likeCount}</span>
                        </button>
                      </div>
                    ))}
                  {voteId && (
                    <CommentInput
                      voteId={voteId}
                      parentId={comment.commentId}
                      onCommentCreated={() =>
                        handleReplyCreated(comment.commentId)
                      }
                      placeholder="대댓글을 남겨보세요"
                      postLoginReturnPath={postLoginReturnPath}
                    />
                  )}
                </div>
              )}
            </article>
          )
        })}

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="typo-label-03 mt-2 rounded-xl bg-brand-gray-50 py-3 text-brand-gray-200"
        >
          접기
        </button>
      )}

      <Popup
        open={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, commentId: null })}
        variant="confirm"
        title="댓글을 삭제할까요?"
        description="삭제한 댓글은 복구할 수 없어요"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default CommentDetail
