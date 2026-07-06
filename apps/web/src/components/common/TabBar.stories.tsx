import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { TabBar, TabItem } from './TabBar'

const meta = {
  title: 'Common/TabBar',
  component: TabBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `6321:7510` 기반. selected/false 두 상태. active는 V300 밑줄+텍스트, inactive는 G75. 접근성: role=tablist / tab, aria-selected.',
      },
    },
  },
} satisfies Meta<typeof TabBar>

export default meta
type Story = StoryObj<typeof meta>

const TABS = ['전체', '음식', '연애', '기타'] as const

export const Default: Story = {
  render: () => (
    <TabBar>
      {TABS.map((label, i) => (
        <TabItem key={label} label={label} selected={i === 0} />
      ))}
    </TabBar>
  ),
}

/** 클릭으로 상태 전환 확인용 인터랙티브 스토리 */
export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState(0)
    return (
      <TabBar>
        {TABS.map((label, i) => (
          <TabItem
            key={label}
            label={label}
            selected={active === i}
            onClick={() => setActive(i)}
          />
        ))}
      </TabBar>
    )
  },
}

/** 각 탭이 선택됐을 때 시각 확인용 매트릭스 */
export const AllSelectedStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {TABS.map((selectedLabel, sel) => (
        <TabBar key={selectedLabel}>
          {TABS.map((label, i) => (
            <TabItem key={label} label={label} selected={i === sel} />
          ))}
        </TabBar>
      ))}
    </div>
  ),
}
