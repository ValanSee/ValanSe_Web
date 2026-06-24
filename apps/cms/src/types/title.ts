export type TitleTier =
  | 'BASIC'
  | 'TIER_1'
  | 'TIER_2'
  | 'TIER_3'
  | 'SEASON'
  | 'RARE'

export const TITLE_TIERS: TitleTier[] = [
  'BASIC',
  'TIER_1',
  'TIER_2',
  'TIER_3',
  'SEASON',
  'RARE',
]

export type TitleAcquisitionType =
  | 'DEFAULT'
  | 'POINT_PURCHASE'
  | 'ACHIEVEMENT'
  | 'SEASON'
  | 'EVENT'

export const TITLE_ACQUISITION_TYPES: TitleAcquisitionType[] = [
  'DEFAULT',
  'POINT_PURCHASE',
  'ACHIEVEMENT',
  'SEASON',
  'EVENT',
]

export interface AdminTitleListItem {
  titleId: number
  code: string
  titleName: string
  description: string
  price: number
  tier: TitleTier
  acquisitionType: TitleAcquisitionType
  requirementText: string
  displayOrder: number
}

export interface AdminTitleDetail {
  titleId: number
  code: string
  title: string
  description: string
  price: number
  tier: TitleTier
  acquisitionType: TitleAcquisitionType
  requirementText: string
  active: boolean
  displayOrder: number
}

export interface TitleFormPayload {
  code: string
  title: string
  description: string
  price: number
  tier: TitleTier
  acquisitionType: TitleAcquisitionType
  requirementText: string
  active: boolean
  displayOrder: number
}

export interface DeleteTitleResponse {
  deletedTitleId: number
  deletedTitle: string
  fallbackTitleId: number
  fallbackTitle: string
  reassignedCount: number
  active: boolean
}
