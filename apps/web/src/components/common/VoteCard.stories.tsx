import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import {
  VoteCard,
  VoteCardAuthor,
  VoteCardAvatar,
  VoteCardHeader,
  VoteCardMeta,
  VoteCardOption,
  VoteCardOptions,
  VoteCardStats,
  VoteCardTitle,
  VoteCardVS,
} from './VoteCard'

const meta = {
  title: 'Common/VoteCard',
  component: VoteCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma `6315:7668` + `6328:8114` 기반. 조립식 primitives. 홈화면 variant는 chip+시간, 밸런스탭 variant는 아바타+닉네임+시간. 옵션은 A/VS/B 세로.',
      },
    },
  },
} satisfies Meta<typeof VoteCard>

export default meta
type Story = StoryObj<typeof meta>

/** 홈화면 variant — chip + 시간 헤더 */
export const HomeVariant: Story = {
  render: () => (
    <VoteCard>
      <VoteCardHeader>
        <span className="typo-body-c-03 rounded-xl border border-brand-violet-100 bg-card px-2 py-1 text-primary">
          🩷 연애
        </span>
        <VoteCardMeta>아니오챤 님이 8분 전에 올렸어요</VoteCardMeta>
      </VoteCardHeader>
      <VoteCardTitle>뭐가 더 사랑일까?</VoteCardTitle>
      <VoteCardOptions>
        <VoteCardOption>손 시려우니까 얼른 들어가라는 애인</VoteCardOption>
        <VoteCardOption>손 시려우니까 조금만 더 잡고 있자는 애인</VoteCardOption>
        <VoteCardVS />
      </VoteCardOptions>
      <VoteCardStats participants={30} commentCount={12} likeCount={12} />
    </VoteCard>
  ),
}

/** 밸런스탭 variant — 아바타 + 닉네임 헤더 */
export const BalanceVariant: Story = {
  render: () => (
    <VoteCard>
      <VoteCardHeader>
        <VoteCardAvatar />
        <div className="flex items-center gap-2">
          <VoteCardAuthor>닉네임최대16글자</VoteCardAuthor>
          <VoteCardMeta>n분 전</VoteCardMeta>
        </div>
      </VoteCardHeader>
      <VoteCardTitle>뭐가 더 사랑일까?</VoteCardTitle>
      <VoteCardOptions>
        <VoteCardOption>손 시려우니까 얼른 들어가라는 애인</VoteCardOption>
        <VoteCardOption>손 시려우니까 조금만 더 잡고 있자는 애인</VoteCardOption>
        <VoteCardVS />
      </VoteCardOptions>
      <VoteCardStats participants={30} commentCount={12} likeCount={12} />
    </VoteCard>
  ),
}

/** 투표 후: 선택 상태 강조 */
export const Voted: Story = {
  render: () => {
    const [selected, setSelected] = useState<'A' | 'B'>('A')
    return (
      <VoteCard>
        <VoteCardHeader>
          <VoteCardAvatar />
          <div className="flex items-center gap-2">
            <VoteCardAuthor>닉네임최대16글자</VoteCardAuthor>
            <VoteCardMeta>n분 전</VoteCardMeta>
          </div>
        </VoteCardHeader>
        <VoteCardTitle>뭐가 더 사랑일까?</VoteCardTitle>
        <VoteCardOptions>
          <VoteCardOption
            selected={selected === 'A'}
            onClick={() => setSelected('A')}
          >
            손 시려우니까 얼른 들어가라는 애인
          </VoteCardOption>
          <VoteCardOption
            selected={selected === 'B'}
            onClick={() => setSelected('B')}
          >
            손 시려우니까 조금만 더 잡고 있자는 애인
          </VoteCardOption>
          <VoteCardVS />
        </VoteCardOptions>
        <VoteCardStats participants={30} commentCount={12} likeCount={12} />
      </VoteCard>
    )
  },
}

/** 통계 없이 미리보기용 최소 카드 */
export const Minimal: Story = {
  render: () => (
    <VoteCard>
      <VoteCardTitle>뭐가 더 사랑일까?</VoteCardTitle>
      <VoteCardOptions>
        <VoteCardOption>선택지 A</VoteCardOption>
        <VoteCardOption>선택지 B</VoteCardOption>
        <VoteCardVS />
      </VoteCardOptions>
    </VoteCard>
  ),
}
