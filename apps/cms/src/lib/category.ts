export const CATEGORY_LABEL: Record<string, string> = {
  FOOD: '음식',
  LOVE: '연애',
  ETC: '기타',
  ALL: '전체',
}

export const categoryLabel = (category: string) =>
  CATEGORY_LABEL[category] ?? category
