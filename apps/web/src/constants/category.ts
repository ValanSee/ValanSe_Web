export type CategoryParam =
  | 'LOVE'
  | 'FOOD'
  | 'BUY'
  | 'SPORT'
  | 'WORRY'
  | 'ETC'

export interface CategoryMeta {
  param: CategoryParam
  label: string
  icon: string
}

export const CATEGORY_META: Record<CategoryParam, CategoryMeta> = {
  LOVE: { param: 'LOVE', label: '연애', icon: 'noto:sparkling-heart' },
  FOOD: { param: 'FOOD', label: '음식', icon: 'noto:fork-and-knife-with-plate' },
  BUY: { param: 'BUY', label: '살까말까', icon: 'noto:shopping-bags' },
  SPORT: { param: 'SPORT', label: '스포츠', icon: 'noto:soccer-ball' },
  WORRY: { param: 'WORRY', label: '고민', icon: 'noto:thinking-face' },
  ETC: { param: 'ETC', label: '기타', icon: 'noto:speech-balloon' },
}

export const CATEGORIES: readonly CategoryMeta[] = Object.values(CATEGORY_META)

export function getCategoryMeta(param: string): CategoryMeta | undefined {
  return CATEGORY_META[param as CategoryParam]
}
