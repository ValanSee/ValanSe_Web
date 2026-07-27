import { authApi } from './instance/authApi'

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

// 라벨은 서버 ReportReason 의 description 과 동일하게 유지
export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'SPAM', label: '스팸' },
  { value: 'COMMERCIAL_OR_PROMOTIONAL', label: '영리목적/홍보성' },
  { value: 'FLOODING_POLITICS_OR_OTHER', label: '도배/정치' },
  { value: 'SEXUAL_CONTENT', label: '성적 콘텐츠' },
  { value: 'HATE_OR_HARASSMENT', label: '혐오 또는 괴롭힘' },
  { value: 'VIOLENCE_OR_THREAT', label: '폭력 또는 위협' },
  { value: 'ILLEGAL_OR_HARMFUL', label: '불법 또는 유해 콘텐츠' },
  { value: 'PERSONAL_INFORMATION', label: '개인정보 노출' },
  { value: 'ETC', label: '기타' },
]

// 서버 ReportRequest 의 @Size(max = 1000) 과 동일
export const REPORT_CONTENT_MAX_LENGTH = 1000

export interface ReportRequest {
  reportType: ReportType
  reason: ReportReason
  content?: string
}

// 신고 생성. targetId 는 reportType 에 따라 투표 id 또는 댓글 id
export const createReport = async (
  targetId: number | string,
  payload: ReportRequest,
): Promise<void> => {
  await authApi.post(`/report/${targetId}`, payload)
}
