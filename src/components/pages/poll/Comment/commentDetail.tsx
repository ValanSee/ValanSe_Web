'use client'
import { useState, useEffect } from 'react'
import {
  Comment,
  fetchComments,
  fetchReplies,
  Reply,
  toggleCommentLike,
  deleteComment,
} from '@/api/comment/commentApi'
import CommentInput from './commentInput'
import {
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  MessageCircle,
  MoreVertical,
  Trash2,
} from 'lucide-react'

interface CommentDetailProps {
  comments?: Comment[]
  voteId?: number | string
  onClose?: () => void
}

const CommentDetail = ({
  comments = [],
  voteId,
  onClose,
}: CommentDetailProps) => {
  const [openReplies, setOpenReplies] = useState<Record<number, boolean>>({})
  const [currentSort, setCurrentSort] = useState<'popular' | 'latest'>(
    'popular',
  )
  const [localComments, setLocalComments] = useState<Comment[]>(comments)
  const [loading, setLoading] = useState(false)
  const [replies, setReplies] = useState<Record<number, Reply[]>>({})
  const [repliesLoading, setRepliesLoading] = useState<Record<number, boolean>>(
    {},
  )
  const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({})

  // 초기 댓글 설정
  useEffect(() => {
    setLocalComments(comments)
  }, [comments])

  // 메뉴 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.menu-container')) {
        setOpenMenus({})
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleReplies = async (commentId: number) => {
    // 이미 열려있으면 닫기
    if (openReplies[commentId]) {
      setOpenReplies((prev) => ({
        ...prev,
        [commentId]: false,
      }))
      return
    }

    // 닫혀있으면 열고 대댓글 불러오기
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: true,
    }))

    // 대댓글이 이미 로드되어 있지 않으면 불러오기
    if (!replies[commentId] && voteId) {
      setRepliesLoading((prev) => ({ ...prev, [commentId]: true }))
      try {
        const response = await fetchReplies(voteId, commentId)
        const replyList = Array.isArray(response)
          ? response
          : response.replies || []
        setReplies((prev) => ({ ...prev, [commentId]: replyList }))
      } catch (error) {
        console.error('Failed to fetch replies:', error)
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
      const response = await fetchComments(voteId, { sort })
      setLocalComments(response.comments)
    } catch (error) {
      console.error('댓글 정렬 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentCreated = async () => {
    if (!voteId) return

    try {
      const response = await fetchComments(voteId, { sort: currentSort })
      setLocalComments(response.comments)
    } catch (error) {
      console.error('댓글 새로고침 실패:', error)
    }
  }

  const handleReplyCreated = async (commentId: number) => {
    if (!voteId) return

    try {
      // 대댓글 목록 새로고침
      const response = await fetchReplies(voteId, commentId)
      const replyList = Array.isArray(response)
        ? response
        : response.replies || []
      setReplies((prev) => ({ ...prev, [commentId]: replyList }))

      // 댓글 목록도 새로고침 (replyCount 업데이트를 위해)
      const commentResponse = await fetchComments(voteId, { sort: currentSort })
      setLocalComments(commentResponse.comments)
    } catch (error) {
      console.error('대댓글 새로고침 실패:', error)
    }
  }

  const handleLikeToggle = async (commentId: number) => {
    if (!voteId) return

    try {
      const response = await toggleCommentLike(voteId, commentId)

      // 댓글 목록에서 해당 댓글의 likeCount 업데이트
      setLocalComments((prev) =>
        prev.map((comment) =>
          comment.commentId === commentId
            ? { ...comment, likeCount: response.likeCount }
            : comment,
        ),
      )
    } catch (error) {
      console.error('좋아요 토글 실패:', error)
      alert('좋아요 처리에 실패했습니다.')
    }
  }

  const handleReplyLikeToggle = async (commentId: number, replyId: number) => {
    if (!voteId) return

    try {
      const response = await toggleCommentLike(voteId, replyId)

      // 대댓글 목록에서 해당 대댓글의 likeCount 업데이트
      setReplies((prev) => ({
        ...prev,
        [commentId]:
          prev[commentId]?.map((reply) =>
            reply.id === replyId
              ? { ...reply, likeCount: response.likeCount }
              : reply,
          ) || [],
      }))
    } catch (error) {
      console.error('대댓글 좋아요 토글 실패:', error)
      alert('좋아요 처리에 실패했습니다.')
    }
  }

  const handleCommentDelete = async (commentId: number) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return

    try {
      await deleteComment(commentId)
      setLocalComments((prev) =>
        prev.filter((comment) => comment.commentId !== commentId),
      )
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
      alert('댓글 삭제에 실패했습니다.')
    }
  }

  const toggleMenu = (commentId: number) => {
    setOpenMenus((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    )

    if (diffInHours < 1) return '방금 전'
    if (diffInHours < 24) return `${diffInHours}시간 전`
    return `${Math.floor(diffInHours / 24)}일 전`
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">댓글 {localComments.length}</h3>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              currentSort === 'popular'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-white text-gray-600'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleSortChange('popular')}
            disabled={loading}
          >
            인기순
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              currentSort === 'latest'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-white text-gray-600'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleSortChange('latest')}
            disabled={loading}
          >
            최신순
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">댓글을 불러오는 중...</p>
        </div>
      )}

      {!loading &&
        localComments.map((comment, index) => {
          const commentKey = `${comment.commentId}-${index}`
          const commentReplies = replies[comment.commentId] || []
          const isRepliesLoading = repliesLoading[comment.commentId] || false

          return (
            <div key={commentKey} className="pb-4 last:pb-0 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600">
                      {comment.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {comment.nickname}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTimeAgo(comment.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="relative menu-container">
                  <button
                    className="text-gray-400 hover:text-gray-600 p-1"
                    onClick={() => toggleMenu(comment.commentId)}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {openMenus[comment.commentId] && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                      <button
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => {
                          handleCommentDelete(comment.commentId)
                          toggleMenu(comment.commentId)
                        }}
                      >
                        <Trash2 size={14} />
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {comment.label} {comment.content}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <button
                  className="flex items-center gap-1 hover:text-blue-600"
                  onClick={() => handleLikeToggle(comment.commentId)}
                >
                  <ThumbsUp size={14} />
                  <span>{comment.likeCount}</span>
                </button>
                <button
                  className="flex items-center gap-1 hover:text-blue-600"
                  onClick={() => toggleReplies(comment.commentId)}
                >
                  <MessageCircle size={14} />
                  <span>{comment.replyCount}</span>
                </button>
              </div>

              <button
                onClick={() => toggleReplies(comment.commentId)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                {comment.replyCount > 0 ? '답글 더보기' : '답글 남기기'}
                {openReplies[comment.commentId] ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>

              {/* 대댓글 섹션 - 토글 상태에 따라 표시 */}
              {openReplies[comment.commentId] && (
                <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
                  {/* 대댓글 로딩 */}
                  {isRepliesLoading && (
                    <div className="text-sm text-gray-500">
                      대댓글을 불러오는 중...
                    </div>
                  )}

                  {/* 기존 대댓글 목록 */}
                  {!isRepliesLoading && commentReplies.length === 0 && (
                    <div className="text-sm text-gray-500">
                      대댓글이 없습니다.
                    </div>
                  )}

                  {!isRepliesLoading && commentReplies.length > 0 && (
                    <div className="space-y-3">
                      {commentReplies.map((reply, replyIndex) => (
                        <div
                          key={`${comment.commentId}-reply-${replyIndex}`}
                          className="space-y-1"
                        >
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="font-medium">
                              {reply.nickname}
                            </span>
                            <span>
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800">
                            {reply.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <button
                              className="flex items-center gap-1 hover:text-blue-600"
                              onClick={() =>
                                handleReplyLikeToggle(
                                  comment.commentId,
                                  reply.id,
                                )
                              }
                            >
                              <ThumbsUp size={12} />
                              <span>좋아요 {reply.likeCount}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 대댓글 입력 필드 */}
                  {voteId && (
                    <CommentInput
                      voteId={voteId}
                      parentId={comment.commentId}
                      onCommentCreated={() =>
                        handleReplyCreated(comment.commentId)
                      }
                      placeholder="대댓글을 남겨주세요"
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      {/* 최상위 댓글 입력창 - 접기 버튼 바로 위 */}
      <div className="mt-4">
        <CommentInput
          voteId={voteId as number}
          onCommentCreated={handleCommentCreated}
        />
      </div>
      {onClose && (
        <button
          className="w-full py-2 mt-4 rounded bg-gray-100 text-gray-600 text-sm"
          onClick={onClose}
        >
          접기
        </button>
      )}
    </div>
  )
}

export default CommentDetail
