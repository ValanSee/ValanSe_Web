import { authApi } from '../instance/authApi'
import { PointHistoryResponse } from '@/types/_shared/pointHistory'
import { MAX_PAGE_SIZE } from '@/utils/pagedResponse'

export const fetchPointHistory = async (): Promise<PointHistoryResponse> => {
  try {
    // 서버가 기본 size=10으로 잘라 보내므로 명시적으로 최대치를 요청한다.
    // (엔벨로프 키 `pointHistory`는 전환 전후 동일해 별도 정규화가 필요 없다.)
    const response = await authApi.get<PointHistoryResponse>(
      `/member/point-history?size=${MAX_PAGE_SIZE}`,
    )
    return response.data
  } catch (error) {
    throw error
  }
}
