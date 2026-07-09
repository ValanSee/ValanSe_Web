import { TitleTier } from '@/types/_shared/title'

export const TIER_LABEL: Record<TitleTier, string> = {
  BASIC: '기본',
  TIER_1: '티어 1',
  TIER_2: '티어 2',
  TIER_3: '티어 3',
  SEASON: '시즌',
  RARE: '레어',
}

// 칭호 티어별 뱃지 스타일. 팔레트는 globals.css --tier-*-{bg,fg} 에 등록됨.
export const TIER_BADGE_CLASS: Record<TitleTier, string> = {
  BASIC: 'bg-tier-basic text-tier-basic-foreground',
  TIER_1: 'bg-tier-1 text-tier-1-foreground',
  TIER_2: 'bg-tier-2 text-tier-2-foreground',
  TIER_3: 'bg-tier-3 text-tier-3-foreground',
  SEASON: 'bg-tier-season text-tier-season-foreground',
  RARE: 'bg-tier-rare text-tier-rare-foreground',
}
