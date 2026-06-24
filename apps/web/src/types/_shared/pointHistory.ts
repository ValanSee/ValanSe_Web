// 백엔드 명세서: id는 String으로 적혀있으나 mock data에서는 number → mock 기준 number로 정의
export type PointType =
  | 'SIGN_UP'
  | 'COMMENT_CREATE'
  | 'VOTE_CREATE'
  | 'LIKE_RECEIVED'
  | 'HOT_ISSUE'
  | 'TITLE_PURCHASE'
  // forward-compat: 새 type이 추가되어도 컴파일 에러가 나지 않도록 string fallback
  | (string & {})

export type PointHistoryItem = {
  id: number
  amount: number // 적립은 양수, 사용은 음수
  remainingPoint: number // 해당 거래 시점의 잔액
  type: PointType
  typeDescription: string
  createdAt: string // 'YYYY-MM-DD HH:mm:ss'
}

export type PointHistoryResponse = {
  pointHistory: PointHistoryItem[]
}
