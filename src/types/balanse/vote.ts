export interface VoteOption {
  id: number
  content: string
}

export interface Vote {
  id: number
  title: string
  category: string
  member_id: number
  nickname: string
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
