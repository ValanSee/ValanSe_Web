import type { Meta, StoryObj } from '@storybook/nextjs'
import BottomNavBar from './bottomNavBar'

const meta = {
  title: 'Shared/BottomNavBar',
  component: BottomNavBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma 신규 디자인 반영 바텀탭. 4탭(홈/밸런스/만들기/내정보), currentColor 인라인 SVG, safe-area 대응.',
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/main' },
    },
  },
} satisfies Meta<typeof BottomNavBar>

export default meta
type Story = StoryObj<typeof meta>

export const HomeActive: Story = {}

export const BalanseActive: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: '/balanse' } },
  },
}

export const CreateActive: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: '/create' } },
  },
}

export const MyActive: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: '/my' } },
  },
}
