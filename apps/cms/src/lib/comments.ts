import { api } from './api'
import type { PagedCommentResponse } from '@/types/vote'

// 서버 MyCommentController 의 삭제 엔드포인트는 관리자도 허용한다
export async function deleteComment(commentId: number) {
  await api.delete(`/comments/${commentId}`)
}

export async function fetchComments(
  voteId: number,
  params: { page?: number; size?: number } = {},
): Promise<PagedCommentResponse> {
  const res = await api.get<PagedCommentResponse>(`/votes/${voteId}/comments`, {
    params: { sort: 'latest', page: params.page ?? 0, size: params.size ?? 50 },
  })
  return res.data
}
