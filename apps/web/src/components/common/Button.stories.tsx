import type { Meta, StoryObj } from '@storybook/nextjs'
import { Button } from './Button'

const meta = {
  title: 'Common/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma `6273:8262` 기반. size(xl/l/m/s/ss) × variant(primary/secondary/ghost_purple/ghost_black/outline/gray) 매트릭스. `common/`은 페이지의 import 진입점.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'ghost_purple',
        'ghost_black',
        'outline',
        'gray',
      ],
    },
    size: {
      control: 'radio',
      options: ['xl', 'l', 'm', 's', 'ss'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    children: '버튼',
    variant: 'primary',
    size: 'l',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** 대표 스토리: 기본 크기(L) × 기본 variant(primary) */
export const Default: Story = {}

/** Variant 매트릭스 (size L 고정) */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3 p-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost_purple">Ghost Purple</Button>
      <Button variant="ghost_black">Ghost Black</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="gray">Gray</Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  ),
}

/** Size 매트릭스 (variant primary 고정) */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3 p-4">
      <Button size="xl">XL · 56px</Button>
      <Button size="l">L · 48px</Button>
      <Button size="m">M · 40px</Button>
      <Button size="s">S · 32px</Button>
      <Button size="ss">SS · hug</Button>
    </div>
  ),
}

/** Variant × Size 전체 매트릭스 */
export const Matrix: Story = {
  render: () => {
    const variants = [
      'primary',
      'secondary',
      'ghost_purple',
      'ghost_black',
      'outline',
      'gray',
    ] as const
    const sizes = ['xl', 'l', 'm', 's', 'ss'] as const
    return (
      <div className="p-4">
        <table className="border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="typo-label-01 text-brand-gray-200">variant \ size</th>
              {sizes.map((s) => (
                <th key={s} className="typo-label-01 text-brand-gray-200">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v}>
                <td className="typo-label-01 text-brand-gray-200 pr-2">{v}</td>
                {sizes.map((s) => (
                  <td key={s}>
                    <Button variant={v} size={s}>
                      Btn
                    </Button>
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

/** Disabled 상태 */
export const Disabled: Story = {
  args: { disabled: true, variant: 'primary', children: 'Disabled' },
}
