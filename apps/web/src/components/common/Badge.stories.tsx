import type { Meta, StoryObj } from '@storybook/nextjs'
import { Badge } from './Badge'

const meta = {
  title: 'Common/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma `6339:8861` 기반. size(s/l) × status(filled/outlined/weak/ghost) × color(purple/yellow/gray). Chip과 동일 구조이나 인터랙션 없음.',
      },
    },
  },
  args: { children: 'label' },
  argTypes: {
    size: { control: 'radio', options: ['s', 'l'] },
    status: { control: 'select', options: ['filled', 'outlined', 'weak', 'ghost'] },
    color: { control: 'radio', options: ['purple', 'yellow', 'gray'] },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithIcon: Story = {
  args: { icon: '🩷', children: 'HOT' },
}

/** 색상별 매트릭스 */
export const Matrix: Story = {
  render: () => {
    const colors = ['purple', 'yellow', 'gray'] as const
    const statuses = ['filled', 'outlined', 'weak', 'ghost'] as const
    return (
      <div className="p-4">
        <table className="border-separate border-spacing-3">
          <thead>
            <tr>
              <th className="typo-label-01 text-brand-gray-200">color \ status</th>
              {statuses.map((s) => (
                <th key={s} className="typo-label-01 text-brand-gray-200">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <tr key={color}>
                <td className="typo-label-01 text-brand-gray-200 pr-2">{color}</td>
                {statuses.map((status) => (
                  <td key={status}>
                    <Badge size="l" color={color} status={status}>
                      label
                    </Badge>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
}

export const HotIndicator: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      <Badge size="s" color="purple" status="filled">
        HOT
      </Badge>
      <Badge size="s" color="yellow" status="filled">
        NEW
      </Badge>
      <Badge size="s" color="gray" status="weak">
        완료
      </Badge>
    </div>
  ),
}
