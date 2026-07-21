export type VoteCategory =
  | 'ALL'
  | 'FOOD'
  | 'LOVE'
  | 'BUY'
  | 'SPORT'
  | 'WORRY'
  | 'ETC'

export const VOTE_CATEGORIES: VoteCategory[] = [
  'ALL',
  'FOOD',
  'LOVE',
  'BUY',
  'SPORT',
  'WORRY',
  'ETC',
]

export const VOTE_CATEGORY_LABEL: Record<VoteCategory, string> = {
  ALL: '전체',
  FOOD: '음식',
  LOVE: '연애',
  BUY: '살까말까',
  SPORT: '스포츠',
  WORRY: '고민',
  ETC: '기타',
}

// 글쓰기(create) 폼에는 '전체(ALL)' 선택지가 없음
export const CREATABLE_VOTE_CATEGORIES = VOTE_CATEGORIES.filter(
  (category) => category !== 'ALL',
)

// 홈 화면 카테고리 아이콘 그리드용 (ALL 제외)
export const VOTE_CATEGORY_ICON: Partial<Record<VoteCategory, string>> = {
  FOOD: '/category-food.svg',
  LOVE: '/category-love.svg',
  BUY: '/category-buy.svg',
  SPORT: '/category-sport.svg',
  WORRY: '/category-worry.svg',
  ETC: '/category-etc.svg',
}
