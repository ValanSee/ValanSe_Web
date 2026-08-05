import { api } from './api'

// 서버 MyCommentController 의 삭제 엔드포인트는 관리자도 허용한다
export async function deleteComment(commentId: number) {
  await api.delete(`/comments/${commentId}`)
}
