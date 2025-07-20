import { authApi } from '../instance/authApi'

// 연령별 투표 결과
export interface AgeGroup {
  content: string
  voteCount: number
  ratio: number
}
export interface AgeRatio {
  totalCount: number
  ageGroups: Record<string, AgeGroup>
}
export interface AgeStatisticsResponse {
  voteId: number
  ageRatios: Record<string, AgeRatio>
}

export async function fetchAgeStatistics(
  voteId: number | string,
): Promise<AgeStatisticsResponse> {
  const res = await authApi.get<AgeStatisticsResponse>(`/votes/${voteId}/age`)
  return res.data
}

// MBTI별 투표 결과
export interface MBTIRatio {
  content: string
  vote_count: number
  ratio: number
}
export interface MBTIStatisticsResponse {
  vote_id: number
  mbti_type: string
  total_count: number
  mbti_ratios: Record<string, MBTIRatio[]>
}

export async function fetchMBTIStatistics(
  voteId: number | string,
  mbtiType: string,
): Promise<MBTIStatisticsResponse> {
  const res = await authApi.get<MBTIStatisticsResponse>(
    `/votes/votes/${voteId}/mbti`,
    { params: { mbti_type: mbtiType } },
  )
  return res.data
}
