import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { Popup } from './Popup'

const meta = {
  title: 'Common/Popup',
  component: Popup,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `6358:8151` "팝업" 기반. variant: confirm(투버튼) / alert(원버튼) / error(원버튼 · ghost purple). 컨테이너 radius 20 · bg white · Title-02 center · Body B-01 center.',
      },
    },
  },
  args: {
    open: true,
    title: '라벨텍스트',
    description: '서브 텍스트',
    onClose: () => {},
  },
  argTypes: {
    variant: { control: 'radio', options: ['confirm', 'alert', 'error'] },
  },
} satisfies Meta<typeof Popup>

export default meta
type Story = StoryObj<typeof meta>

export const Confirm: Story = {
  args: { variant: 'confirm', confirmLabel: '선택지 B', cancelLabel: '선택지 A' },
}

export const Alert: Story = {
  args: { variant: 'alert', confirmLabel: '확인' },
}

export const ErrorVariant: Story = {
  args: {
    variant: 'error',
    title: '오류가 발생했습니다',
    description: '잠시 후 다시 시도해주세요',
    confirmLabel: '확인',
  },
}

export const WithoutDescription: Story = {
  args: { description: undefined },
}

/** 실제 인터랙션 시연 (open/close) */
export const Interactive: Story = {
  args: undefined as never,
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="typo-label-03 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
        >
          팝업 열기
        </button>
        <Popup
          open={open}
          onClose={() => setOpen(false)}
          variant="confirm"
          title="정말 삭제하시겠어요?"
          description="이 작업은 되돌릴 수 없어요"
          confirmLabel="삭제"
          onConfirm={() => alert('삭제 실행')}
          cancelLabel="취소"
        />
      </>
    )
  },
}
