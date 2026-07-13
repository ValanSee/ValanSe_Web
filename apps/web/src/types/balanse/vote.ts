export interface VoteOption {
  id: number
  content: string
  imageUrl: string | null
}

export interface Vote {
  id: number
  title: string
  content: string | null
  category: string
  member_id: number
  nickname: string
  member_title: string | null
  created_at: string
  total_vote_count: number
  total_comment_count: number
  options: VoteOption[]
}

export interface VoteListResponse {
  votes: Vote[]
  has_next_page: boolean
  next_cursor: string
}

export type PinType = 'HOT' | 'TRENDING' | 'NONE'
