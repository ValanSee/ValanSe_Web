import { authApi } from '@/api/instance/authApi'
import { MyCommentsResponse } from '@/types/api/myComments'

export const fetchMyComments = async (sort: string = 'latest') => {
  try {
    const res = await authApi.get<MyCommentsResponse[]>(
      `/comments/mine?sort=${sort}`,
    )
    return res.data
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
