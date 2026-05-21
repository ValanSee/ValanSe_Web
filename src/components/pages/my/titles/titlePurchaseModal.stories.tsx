import type { Meta, StoryObj } from '@storybook/nextjs'
import TitlePurchaseModal from './titlePurchaseModal'
import type { Title } from '@/types/_shared/title'

const sample: Title = {
  titleId: 3,
  title: '선택의 신',
  description: '포인트로 구매할 수 있는 프리미엄 칭호',
  tier: 'RARE',
  acquisitionType: 'POINT_PURCHASE',
  owned: false,
  equipped: false,
  locked: true,
  price: 300,
  requirementText: null,
  lockReason: '300P 필요',
}

const meta = {
  title: 'Pages/My/Titles/TitlePurchaseModal',
  component: TitlePurchaseModal,
  args: {
    open: true,
    title: sample,
    point: 500,
    pending: false,
    onClose: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof TitlePurchaseModal>

export default meta
type Story = StoryObj<typeof meta>

export const Affordable: Story = {}
export const Insufficient: Story = { args: { point: 120 } }
export const ExactBalance: Story = { args: { point: 300 } }
export const Pending: Story = { args: { pending: true } }
