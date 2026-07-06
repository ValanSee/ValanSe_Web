import type { Meta, StoryObj } from '@storybook/nextjs'
import { Header, HeaderBackButton, HeaderMoreButton } from './Header'

const meta = {
  title: 'Common/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `6315:6803` 기반. size(xl/s) × leading(back/none) × trailing(more/none) 조합. xl은 Heading-04, s는 Heading-06.',
      },
    },
  },
  args: {
    title: '밸런스게임',
  },
  argTypes: {
    size: { control: 'radio', options: ['xl', 's'] },
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const XL: Story = { args: { size: 'xl' } }

export const Small: Story = { args: { size: 's' } }

export const WithBack: Story = {
  args: {
    size: 'xl',
    leading: <HeaderBackButton />,
  },
}

export const WithBackAndMore: Story = {
  args: {
    size: 'xl',
    leading: <HeaderBackButton />,
    trailing: <HeaderMoreButton />,
  },
}

export const SmallWithMore: Story = {
  args: {
    size: 's',
    trailing: <HeaderMoreButton />,
  },
}

/** 모든 조합 매트릭스 */
export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <Header size="xl" title="XL · 기본" />
      <Header size="xl" title="XL · 뒤로가기" leading={<HeaderBackButton />} />
      <Header
        size="xl"
        title="XL · 뒤로 + 더보기"
        leading={<HeaderBackButton />}
        trailing={<HeaderMoreButton />}
      />
      <Header size="s" title="S · 기본" />
      <Header size="s" title="S · 뒤로가기" leading={<HeaderBackButton />} />
      <Header
        size="s"
        title="S · 뒤로 + 더보기"
        leading={<HeaderBackButton />}
        trailing={<HeaderMoreButton />}
      />
    </div>
  ),
}
