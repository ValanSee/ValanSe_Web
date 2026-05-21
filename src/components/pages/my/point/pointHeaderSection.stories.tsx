import type { Meta, StoryObj } from '@storybook/nextjs'
import PointHeaderSection from './pointHeaderSection'

const meta = {
  title: 'Pages/My/Point/PointHeaderSection',
  component: PointHeaderSection,
  args: { point: 146 },
} satisfies Meta<typeof PointHeaderSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Zero: Story = { args: { point: 0 } }
export const Large: Story = { args: { point: 12500 } }
