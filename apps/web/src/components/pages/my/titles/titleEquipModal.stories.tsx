import type { Meta, StoryObj } from '@storybook/nextjs'
import TitleEquipModal from './titleEquipModal'
import type { Title } from '@/types/_shared/title'

const sample: Title = {
  titleId: 5,
  title: '댓글 장인',
  description: '댓글로 밸런스 토론을 이끄는 유저',
  tier: 'TIER_2',
  acquisitionType: 'ACHIEVEMENT',
  owned: true,
  equipped: false,
  locked: false,
  price: 0,
  requirementText: '댓글 30개 작성',
  lockReason: null,
}

const meta = {
  title: 'Pages/My/Titles/TitleEquipModal',
  component: TitleEquipModal,
  args: {
    open: true,
    title: sample,
    pending: false,
    onClose: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof TitleEquipModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Pending: Story = { args: { pending: true } }
