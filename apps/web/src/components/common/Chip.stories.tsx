import type { Meta, StoryObj } from '@storybook/nextjs'
import { Chip } from './Chip'

const meta = {
  title: 'Common/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma `6288:5807` 기반. size(s/l) × status(primary/secondary/outline/ghost/disabled/unselected). icon 슬롯.',
      },
    },
  },
  args: { children: 'label' },
  argTypes: {
    size: { control: 'radio', options: ['s', 'l'] },
    status: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'disabled', 'unselected'],
    },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithIcon: Story = {
  args: { icon: '🩷', children: 'label' },
}

/** 모든 status × size 매트릭스 */
export const Matrix: Story = {
  render: () => {
    const statuses = [
      'primary',
      'secondary',
      'outline',
      'ghost',
      'disabled',
      'unselected',
    ] as const
    return (
      <div className="p-4">
        <table className="border-separate border-spacing-3">
          <thead>
            <tr>
              <th className="typo-label-01 text-brand-gray-200">status \ size</th>
              <th className="typo-label-01 text-brand-gray-200">S</th>
              <th className="typo-label-01 text-brand-gray-200">L</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map((status) => (
              <tr key={status}>
                <td className="typo-label-01 text-brand-gray-200 pr-2">
                  {status}
                </td>
                <td>
                  <Chip size="s" status={status}>
                    label
                  </Chip>
                </td>
                <td>
                  <Chip size="l" status={status}>
                    label
                  </Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
}

export const CategoryFilter: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      <Chip size="l" status="primary">
        전체
      </Chip>
      <Chip size="l" status="ghost">
        음식
      </Chip>
      <Chip size="l" status="ghost">
        연애
      </Chip>
      <Chip size="l" status="ghost">
        기타
      </Chip>
    </div>
  ),
}
