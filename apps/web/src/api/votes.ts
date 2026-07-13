import { CreateVoteData, MineVotesResponse } from '@/types/api/votes'
import type { PinType } from '@/types/balanse/vote'
import { authApi } from './instance/authApi'
import { VoteCategory } from '@/types/_shared/vote'
import { isAxiosError } from 'axios'

export const fetchBestVote = async () => {
  try {
    const response = await authApi.get<BestVoteResponse>('/votes/best')
    return response.data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export interface VoteOption {
  optionId: number
  content: string
  imageUrl: string | null
  vote_count: number
}

export interface BestVoteResponse {
  voteId: number
  title: string
  content: string | null
  category: VoteCategory
  totalParticipants: number
  createdBy: string
  creatorTitle: string | null
  createdAt: string
  options: VoteOption[]
  pinType: PinType
}

// 투표 API 응답 타입
export interface VoteResponse {
  totalVoteCount: number
  voteOptionId: number
  voteOptionCount: number
  voted: boolean
}

// 투표/취소/재투표 API
export const voteOption = async (
  voteId: number | string,
  voteOptionId: number,
): Promise<VoteResponse> => {
  try {
    const response = await authApi.post<VoteResponse>(
      `/votes/${voteId}/vote-options/${voteOptionId}`,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

// 옵션 인덱스와 이미지 파일 파트를 잇는 imageKey. 백엔드는 imageKey와
// 같은 이름의 파일 파트를 찾아 해당 옵션의 이미지로 업로드한다.
const optionImageKey = (index: number) => `option-${index}-image`

export const createVote = async (voteData: CreateVoteData) => {
  const request = {
    title: voteData.title,
    category: voteData.category,
    ...(voteData.content ? { content: voteData.content } : {}),
    options: voteData.options.map((option, index) => ({
      content: option.content,
      ...(option.imageFile ? { imageKey: optionImageKey(index) } : {}),
    })),
  }

  const formData = new FormData()
  formData.append('request', JSON.stringify(request))
  voteData.options.forEach((option, index) => {
    if (option.imageFile) {
      formData.append(optionImageKey(index), option.imageFile)
    }
  })

  try {
    const response = await authApi.post('/votes', formData)
    return response.data.voteId
  } catch (error) {
    throw error
  }
}

export const fetchMineVotesCreated = async (
  category?: string,
  sort: string = 'latest',
) => {
  try {
    const params = new URLSearchParams()

    if (category) {
      params.append('category', category)
    }
    params.append('sort', sort)

    const response = await authApi.get<MineVotesResponse>(
      `/votes/mine/created?${params.toString()}`,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const fetchMineVotesVoted = async (
  category?: string,
  sort: string = 'latest',
) => {
  try {
    const params = new URLSearchParams()

    if (category) {
      params.append('category', category)
    }
    params.append('sort', sort)

    const response = await authApi.get<MineVotesResponse>(
      `/votes/mine/voted?${params.toString()}`,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

// 투표 삭제 API
export const deleteVote = async (voteId: number) => {
  try {
    await authApi.delete(`/votes/${voteId}`)
  } catch (error) {
    throw error
  }
}
