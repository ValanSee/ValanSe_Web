import { CreateVoteData, MineVotesResponse } from '@/types/api/votes'
import { authApi } from './instance/authApi'

export interface VoteOption {
  optionId: number
  content: string
  vote_count: number
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

// 선택지 이미지 파트 이름 규칙(백엔드 imageKey와 매칭): option-a-image, option-b-image ...
const optionImageKey = (index: number) =>
  `option-${String.fromCharCode(97 + index)}-image`

export const createVote = async (voteData: CreateVoteData) => {
  try {
    // 선택지별로 이미지 유무에 따라 imageKey를 부여하고, 같은 이름의 파일 파트를 첨부한다.
    const options = voteData.options.map((option, index) => ({
      option,
      imageKey: option.imageFile ? optionImageKey(index) : undefined,
    }))

    const requestPayload = {
      title: voteData.title,
      ...(voteData.content ? { content: voteData.content } : {}),
      category: voteData.category,
      options: options.map(({ option, imageKey }) => ({
        content: option.content,
        ...(imageKey ? { imageKey } : {}),
      })),
    }

    const formData = new FormData()
    formData.append('request', JSON.stringify(requestPayload))
    options.forEach(({ option, imageKey }) => {
      if (imageKey && option.imageFile) {
        formData.append(imageKey, option.imageFile)
      }
    })

    const response = await authApi.post('/votes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
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
