import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { TextField } from './TextField'

const meta = {
  title: 'Common/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma `6280:8355` 기반. state: default / focus (자동, `:focus-within`) / filled (자동, 값 존재) / disabled / error. label · supportText · counter · trailing 슬롯.',
      },
    },
  },
  args: {
    label: '필드레이블',
    placeholder: '텍스트 입력',
    supportText: '서포트 텍스트를 입력합니다',
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Focused: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`:focus-within` 스타일로 자동 처리. 스토리에서 input을 클릭하면 border가 V200으로 변경.',
      },
    },
  },
}

export const Filled: Story = {
  args: { defaultValue: '입력된 텍스트' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '입력 불가' },
}

export const ErrorState: Story = {
  args: {
    error: true,
    defaultValue: '잘못된 값',
    supportText: '올바른 형식이 아닙니다',
  },
}

export const WithCounter: Story = {
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <TextField
        {...args}
        value={value}
        onValueChange={setValue}
        showCounter
        maxLength={16}
      />
    )
  },
}

export const WithoutLabel: Story = {
  args: { label: undefined },
}

export const WithoutSupport: Story = {
  args: { supportText: undefined },
}

/** 5 상태 매트릭스 */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <TextField
        label="default"
        placeholder="텍스트 입력"
        supportText="서포트 텍스트"
      />
      <TextField
        label="filled"
        defaultValue="입력된 텍스트"
        supportText="서포트 텍스트"
      />
      <TextField
        label="disabled"
        defaultValue="입력 불가"
        disabled
        supportText="서포트 텍스트"
      />
      <TextField
        label="error"
        defaultValue="잘못된 값"
        error
        supportText="올바른 형식이 아닙니다"
      />
      <TextField
        label="counter (16)"
        placeholder="텍스트 입력"
        supportText="최대 16자"
        showCounter
        maxLength={16}
      />
    </div>
  ),
}
