import { publicApi } from '../instance/publicApi'
import { authApi } from '../instance/authApi'
import { getAccessToken } from '@/utils/tokenUtils'

export interface BestComment {
  totalCommentCount: number
  content: string
}

export interface Comment {
  commentId: number
  nickname: string
  createdAt: string
  content: string
  likeCount: number
  replyCount: number
  deletedAt: string | null
  label: string
  deleted: boolean
  daysAgo: number
  hoursAgo: number
  /** 내가 좋아요했는지. 로그인해 조회했을 때만 의미 있음 (서버 미배포 시 없음) */
  liked?: boolean
}

export interface Reply {
  id: number
  nickname: string
  createdAt: string
  content: string
  likeCount: number
  deletedAt: string | null
  deleted: boolean
  daysAgo: number
  hoursAgo: number
  liked?: boolean
}

export interface CommentsResponse {
  comments: Comment[]
  page: number
  size: number
  hasNext: boolean
}

export interface RepliesResponse {
  replies: Reply[]
  page: number
  size: number
  hasNext: boolean
}

export interface LikeResponse {
  commentId: number
  likeCount: number
  /** 토글 이후 상태 (서버 미배포 시 없음) */
  liked?: boolean
  message: string
}

export async function fetchBestComment(
  voteId: number | string,
): Promise<BestComment> {
  const res = await publicApi.get<BestComment>(`/votes/${voteId}/comments/best`)
  return res.data
}

export async function fetchComments(
  voteId: number | string,
  params?: { sort?: string; page?: number; size?: number },
): Promise<CommentsResponse> {
  const path = `/votes/${voteId}/comments`
  // 로그인 상태면 토큰을 붙여 내 좋아요 여부(liked)까지 받는다
  if (getAccessToken()) {
    try {
      const res = await authApi.get<CommentsResponse>(path, { params })
      return res.data
    } catch {
      // 토큰 무효·재발급 실패여도 댓글은 비로그인 조회로 보여준다
    }
  }
  const res = await publicApi.get<CommentsResponse>(path, { params })
  return res.data
}

export async function fetchReplies(
  voteId: number | string,
  commentId: number | string,
  params?: { page?: number; size?: number },
): Promise<RepliesResponse> {
  const res = await authApi.get<RepliesResponse>(
    `/votes/${voteId}/comments/${commentId}/replies`,
    { params },
  )
  return res.data
}

export async function createComment(
  voteId: number | string,
  content: string,
  parentId?: number | null,
): Promise<{ commentId: number }> {
  const res = await authApi.post<{ commentId: number }>(
    `/votes/${voteId}/comments`,
    {
      content,
      parentId: parentId || null,
    },
  )
  return res.data
}

export async function toggleCommentLike(
  voteId: number | string,
  commentId: number | string,
): Promise<LikeResponse> {
  const res = await authApi.post<LikeResponse>(
    `/votes/${voteId}/comments/${commentId}/like`,
  )
  return res.data
}

export async function deleteComment(commentId: number | string): Promise<void> {
  await authApi.delete(`/comments/${commentId}`)
}
