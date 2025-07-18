import { publicApi } from '../instance/publicApi'

export interface BestComment {
  totalCommentCount: number
  content: string
}

export interface Comment {
  voteId: number
  nickname: string
  createdAt: string
  content: string
  likeCount: number
  replyCount: number
  deletedAt: string | null
  label: string
}

export interface CommentsResponse {
  comments: Comment[]
  page: number
  size: number
  hasNext: boolean
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
