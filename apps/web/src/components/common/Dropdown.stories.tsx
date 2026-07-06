import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { Dropdown, type DropdownOption } from './Dropdown'

const options: DropdownOption[] = [
  { label: 'option1', value: '1' },
  { label: 'option2', value: '2' },
  { label: 'option3', value: '3' },
  { label: 'option4', value: '4' },
]

const meta = {
  title: 'Common/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma `6280:9019` 기반. state: default / focus (자동 :hover:border) / active(open) / disabled / error. 커스텀 UI로 옵션 메뉴 렌더. outside click/Escape로 닫힘. 접근성: role=combobox, aria-expanded, aria-controls.',
      },
    },
  },
  args: {
    label: '필드레이블',
    placeholder: '텍스트',
    options,
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>()
    return <Dropdown {...args} value={value} onValueChange={setValue} />
  },
}

export const Filled: Story = {
  args: { options },
  render: (args) => <Dropdown {...args} value="2" onValueChange={() => {}} />,
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const ErrorState: Story = {
  args: {
    error: true,
    errorMessage: '선택이 필요합니다',
  },
}

/** 5 states 매트릭스 (open 상태는 Interactive에서 확인) */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <Dropdown
        label="default"
        placeholder="텍스트"
        options={options}
      />
      <Dropdown
        label="filled"
        options={options}
        value="1"
        onValueChange={() => {}}
      />
      <Dropdown
        label="disabled"
        placeholder="선택 불가"
        options={options}
        disabled
      />
      <Dropdown
        label="error"
        placeholder="텍스트"
        options={options}
        error
        errorMessage="선택이 필요합니다"
      />
    </div>
  ),
}
