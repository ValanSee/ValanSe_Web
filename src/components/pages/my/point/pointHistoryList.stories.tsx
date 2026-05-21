import type { Meta, StoryObj } from '@storybook/nextjs'
import PointHistoryList from './pointHistoryList'
import type { PointHistoryItem } from '@/types/_shared/pointHistory'

const meta = {
  title: 'Pages/My/Point/PointHistoryList',
  component: PointHistoryList,
} satisfies Meta<typeof PointHistoryList>

export default meta
type Story = StoryObj<typeof meta>

const sampleMixed: PointHistoryItem[] = [
  {
    id: 6,
    amount: -300,
    remainingPoint: 146,
    type: 'TITLE_PURCHASE',
    typeDescription: '칭호 구매',
    createdAt: '2026-05-19 16:40:12',
  },
  {
    id: 5,
    amount: 50,
    remainingPoint: 446,
    type: 'HOT_ISSUE',
    typeDescription: '핫이슈',
    createdAt: '2026-05-18 21:15:03',
  },
  {
    id: 4,
    amount: 1,
    remainingPoint: 396,
    type: 'COMMENT_CREATE',
    typeDescription: '댓글 작성',
    createdAt: '2026-05-17 10:02:00',
  },
  {
    id: 3,
    amount: 40,
    remainingPoint: 395,
    type: 'SIGN_UP',
    typeDescription: '회원가입',
    createdAt: '2026-05-15 09:00:00',
  },
]

export const Default: Story = {
  args: { items: sampleMixed },
}

export const Empty: Story = {
  args: { items: [] },
}

export const OnlyEarning: Story = {
  args: { items: sampleMixed.filter((i) => i.amount > 0) },
}

export const OnlySpending: Story = {
  args: { items: sampleMixed.filter((i) => i.amount < 0) },
}
