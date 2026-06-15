import { TitleTier } from '@/types/_shared/title'

// 임시 팔레트. TODO: 디자인 시안 확정 시 교체.
export const TIER_LABEL: Record<TitleTier, string> = {
  BASIC: '기본',
  TIER_1: '티어 1',
  TIER_2: '티어 2',
  TIER_3: '티어 3',
  SEASON: '시즌',
  RARE: '레어',
}

export const TIER_BADGE_CLASS: Record<TitleTier, string> = {
  BASIC: 'bg-[#F0F0F0] text-[#8E8E8E]',
  TIER_1: 'bg-[#E6EEF5] text-[#4D7298]',
  TIER_2: 'bg-[#EDE4FB] text-[#7E5BEF]',
  TIER_3: 'bg-[#FFF4D6] text-[#B88600]',
  SEASON: 'bg-[#FCE4F0] text-[#EC4899]',
  RARE: 'bg-[#FFE3D9] text-[#EB5E28]',
}
