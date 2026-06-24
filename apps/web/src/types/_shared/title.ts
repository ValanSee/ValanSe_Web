export type TitleTier =
  | 'BASIC'
  | 'TIER_1'
  | 'TIER_2'
  | 'TIER_3'
  | 'SEASON'
  | 'RARE'

export type TitleAcquisitionType =
  | 'DEFAULT'
  | 'POINT_PURCHASE'
  | 'ACHIEVEMENT'
  | 'SEASON'
  | 'EVENT'

export type Title = {
  titleId: number
  title: string
  description: string
  tier: TitleTier
  acquisitionType: TitleAcquisitionType
  owned: boolean
  equipped: boolean
  locked: boolean
  price: number // 구매형이 아니면 0
  requirementText: string | null
  lockReason: string | null
}

export type TitlesResponse = {
  defaultTitles: Title[]
  ownedTitles: Title[]
  lockedTitles: Title[]
}

export type EquipTitleResponse = {
  titleId: number
  title: string
  equipped: boolean
}

export type PurchaseTitleResponse = {
  titleId: number
  title: string
  owned: boolean
  remainingPoint: number
}
