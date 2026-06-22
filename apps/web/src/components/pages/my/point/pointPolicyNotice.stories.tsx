import type { Meta, StoryObj } from '@storybook/nextjs'
import PointPolicyNotice from './pointPolicyNotice'

const meta = {
  title: 'Pages/My/Point/PointPolicyNotice',
  component: PointPolicyNotice,
} satisfies Meta<typeof PointPolicyNotice>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
