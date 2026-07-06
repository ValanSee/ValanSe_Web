'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type TrendingVoteResponse } from '@/api/pages/valanse/trendingVoteApi'
import { getAccessToken } from '@/utils/tokenUtils'
import { entryHrefWithRedirect } from '@/utils/authRedirect'
import LoginRequiredModal from '@/components/ui/modal/loginRequiredModal'

const categoryMap: Record<string, string> = {
  ETC: '기타',
  FOOD: '음식',
  LOVE: '연애',
  ALL: '전체',
}

type Props = {
  data: TrendingVoteResponse
}

function MockPollCard({ data }: Props) {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (!data) return null

  const handleClick = () => {
    if (!getAccessToken()) {
      setShowLoginModal(true)
      return
    }
    router.push(`/poll/${data.voteId}`)
  }

  return (
    <>
      <div
        className="mx-auto mt-6 block cursor-pointer space-y-4 rounded-xl bg-background p-4"
        onClick={handleClick}
      >
        <div className="flex items-center gap-2">
          {data.creatorTitle && (
            // TODO(design): 칭호 배경 #4D7298은 blue-gray 팔레트 미확정으로 TODO 유지
            <span className="typo-body-c-03 inline-flex items-center rounded-full bg-[#4D7298] px-2 py-0.5 text-primary-foreground">
              {data.creatorTitle}
            </span>
          )}
          <span className="typo-label-03 text-brand-gray-200">
            {data.createdBy}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="typo-title-02 text-foreground">{data.title}</div>
        </div>

        <div className="space-y-2">
          {data.options.map((option, idx) => {
            return (
              <div
                className="relative cursor-pointer rounded-md border border-border bg-card px-4 py-3 transition-all"
                key={option.optionId}
              >
                <div className="typo-label-03 relative z-10 flex justify-between text-foreground">
                  <span>
                    <strong>{String.fromCharCode(65 + idx)}</strong>{' '}
                    {option.content}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between">
          <div className="typo-body-c-03 mb-2 text-brand-gray-100">
            {categoryMap[data.category] ?? data.category}
          </div>
          <div className="typo-body-c-02 text-right text-brand-gray-100">
            총 {data.totalParticipants}명 투표
          </div>
        </div>
      </div>

      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => {
          setShowLoginModal(false)
          router.push(entryHrefWithRedirect(`/poll/${data.voteId}`))
        }}
      />
    </>
  )
}
export default MockPollCard
