import { authApi } from '@/api/instance/authApi'
import { MyCommentsResponse } from '@/types/api/myComments'
import { MAX_PAGE_SIZE, unwrapList } from '@/utils/pagedResponse'

export const fetchMyComments = async (sort: string = 'latest') => {
  try {
    // 페이지네이션 UI가 없으므로 한 번에 최대치까지 받아 기존 동작을 유지한다.
    const res = await authApi.get(
      `/comments/mine?sort=${sort}&size=${MAX_PAGE_SIZE}`,
    )
    return unwrapList<MyCommentsResponse>(res.data, 'comments')
  } catch (error) {
    throw error
  }
}

export const deleteMyComments = async (commentId: number) => {
  try {
    await authApi.delete(`/comments/${commentId}`)
  } catch (error) {
    throw error
  }
}
