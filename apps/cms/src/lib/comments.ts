import { api, publicApi } from './api'
import type { PagedCommentResponse } from '@/types/vote'

// 서버 MyCommentController 의 삭제 엔드포인트는 관리자도 허용한다
export async function deleteComment(commentId: number) {
  await api.delete(`/comments/${commentId}`)
}

// 댓글 조회는 비로그인도 허용돼서 토큰 없이 보낸다.
// Authorization 헤더가 없으면 CORS preflight 가 생략돼 요청 수가 절반이 된다.
export async function fetchComments(
  voteId: number,
  params: { page?: number; size?: number } = {},
): Promise<PagedCommentResponse> {
  const res = await publicApi.get<PagedCommentResponse>(`/votes/${voteId}/comments`, {
    params: { sort: 'latest', page: params.page ?? 0, size: params.size ?? 50 },
  })
  return res.data
}
