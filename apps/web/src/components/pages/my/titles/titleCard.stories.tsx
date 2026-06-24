import type { Meta, StoryObj } from '@storybook/nextjs'
import TitleCard from './titleCard'
import type { Title } from '@/types/_shared/title'

const base: Title = {
  titleId: 1,
  title: '밸런스 새싹',
  description: '밸런스 게임에 첫발을 내디딘 유저',
  tier: 'BASIC',
  acquisitionType: 'DEFAULT',
  owned: true,
  equipped: false,
  locked: false,
  price: 0,
  requirementText: null,
  lockReason: null,
}

const meta = {
  title: 'Pages/My/Titles/TitleCard',
  component: TitleCard,
  args: { onAction: () => {} },
} satisfies Meta<typeof TitleCard>

export default meta
type Story = StoryObj<typeof meta>

export const OwnedDefault: Story = { args: { title: base } }

export const Equipped: Story = {
  args: { title: { ...base, tier: 'TIER_2', title: '댓글 장인', equipped: true } },
}

export const LockedAchievement: Story = {
  args: {
    title: {
      ...base,
      titleId: 2,
      title: '선택의 신',
      description: '투표 100회 참여한 유저',
      tier: 'TIER_3',
      acquisitionType: 'ACHIEVEMENT',
      owned: false,
      locked: true,
      requirementText: '투표 100회 참여',
      lockReason: '투표 100회 필요',
    },
  },
}

export const LockedPurchase: Story = {
  args: {
    title: {
      ...base,
      titleId: 3,
      title: '논쟁 폭격기',
      description: '포인트로 구매할 수 있는 프리미엄 칭호',
      tier: 'RARE',
      acquisitionType: 'POINT_PURCHASE',
      owned: false,
      locked: true,
      price: 300,
      lockReason: '300P 필요',
    },
  },
}

export const Season: Story = {
  args: {
    title: {
      ...base,
      titleId: 4,
      title: '2026 봄 논쟁왕',
      description: '2026 봄 시즌 한정 칭호',
      tier: 'SEASON',
      acquisitionType: 'SEASON',
      owned: false,
      locked: true,
      requirementText: '시즌한정',
      lockReason: '시즌한정',
    },
  },
}
