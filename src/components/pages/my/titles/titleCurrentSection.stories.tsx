import type { Meta, StoryObj } from '@storybook/nextjs'
import TitleCurrentSection from './titleCurrentSection'
import type { Title } from '@/types/_shared/title'

const equippedSample: Title = {
  titleId: 2,
  title: '싸움 구경꾼',
  description: '투표에 10회 이상 참여한 유저',
  tier: 'TIER_1',
  acquisitionType: 'ACHIEVEMENT',
  owned: true,
  equipped: true,
  locked: false,
  price: 0,
  requirementText: '투표 10회 참여',
  lockReason: null,
}

const meta = {
  title: 'Pages/My/Titles/TitleCurrentSection',
  component: TitleCurrentSection,
  args: { equipped: equippedSample, point: 146 },
} satisfies Meta<typeof TitleCurrentSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NoneEquipped: Story = { args: { equipped: null, point: 0 } }
export const Large: Story = { args: { point: 12500 } }
