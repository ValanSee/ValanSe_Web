export type PinType = 'HOT' | 'NONE'

export interface VoteOption {
  id: number
  content: string
}

export interface Vote {
  id: number
  title: string
  content: string | null
  category: string
  member_id: number
  nickname: string
  /** AI 프로필(콘텐츠 시드)이 작성한 투표 */
  isBot: boolean
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

export interface PinnedVote {
  voteId: number
  title: string
  content: string | null
  category: string
  totalParticipants: number
  createdBy: string
  creatorTitle: string | null
  createdAt: string
  pinType: PinType
}

export interface VoteComment {
  commentId: number
  voteId: number
  nickname: string
  /** AI 프로필(콘텐츠 시드)이 작성한 댓글 */
  isBot: boolean
  commentCreatedAt: string
  content: string
  likeCount: number
  replyCount: number
  deletedAt: string | null
  voteOptionLabel: string | null
}

export interface PagedCommentResponse {
  comments: VoteComment[]
  page: number
  size: number
  hasNext: boolean
}
