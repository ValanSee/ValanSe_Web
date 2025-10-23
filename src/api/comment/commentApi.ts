import { publicApi } from '../instance/publicApi'
import { authApi } from '../instance/authApi'

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
  const res = await publicApi.get<CommentsResponse>(
    `/votes/${voteId}/comments`,
    { params },
  )
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
