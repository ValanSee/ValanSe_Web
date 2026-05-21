import { authApi } from '../instance/authApi'
import { PointHistoryResponse } from '@/types/_shared/pointHistory'

export const fetchPointHistory = async (): Promise<PointHistoryResponse> => {
  try {
    const response =
      await authApi.get<PointHistoryResponse>('/member/point-history')
    return response.data
  } catch (error) {
    throw error
  }
}
