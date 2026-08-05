// 서버 ReportType enum 과 1:1 대응
export type ReportType = 'VOTE' | 'COMMENT'

// 서버 ReportReason enum 과 1:1 대응
export type ReportReason =
  | 'SPAM'
  | 'COMMERCIAL_OR_PROMOTIONAL'
  | 'FLOODING_POLITICS_OR_OTHER'
  | 'SEXUAL_CONTENT'
  | 'HATE_OR_HARASSMENT'
  | 'VIOLENCE_OR_THREAT'
  | 'ILLEGAL_OR_HARMFUL'
  | 'PERSONAL_INFORMATION'
  | 'ETC'

/**
 * 라벨 원본은 서버 ReportReason enum 의 description 이다.
 * 워크스페이스가 apps/* 뿐이라 공유 패키지가 없어
 * apps/web/src/api/report.ts 의 REPORT_REASONS 와 값이 중복된다.
 */
export const REPORT_REASON_LABEL: Record<ReportReason, string> = {
  SPAM: '스팸',
  COMMERCIAL_OR_PROMOTIONAL: '영리목적/홍보성',
  FLOODING_POLITICS_OR_OTHER: '도배/정치',
  SEXUAL_CONTENT: '성적 콘텐츠',
  HATE_OR_HARASSMENT: '혐오 또는 괴롭힘',
  VIOLENCE_OR_THREAT: '폭력 또는 위협',
  ILLEGAL_OR_HARMFUL: '불법 또는 유해 콘텐츠',
  PERSONAL_INFORMATION: '개인정보 노출',
  ETC: '기타',
}

export interface ReportedVote {
  voteId: number
  title: string
  content: string | null
  category: string
  totalVoteCount: number
  createdAt: string
}

export interface ReportedComment {
  commentId: number
  voteId: number
  nickname: string
  content: string
  likeCount: number
  replyCount: number
}

export interface ReportedTargetItem {
  targetId: number
  reportCount: number
  targetType: ReportType
  vote: ReportedVote | null
  comment: ReportedComment | null
}

export interface ReportListResult {
  reports: ReportedTargetItem[]
  hasNext: boolean
}

export interface ReportDetailItem {
  reportId: number
  reporterId: number
  reporterNickname: string
  reason: ReportReason
  reasonDescription: string
  content: string | null
  reportedAt: string
}

export interface ReportDetail {
  targetId: number
  targetType: ReportType
  reportCount: number
  vote: ReportedVote | null
  comment: ReportedComment | null
  reports: ReportDetailItem[]
}
