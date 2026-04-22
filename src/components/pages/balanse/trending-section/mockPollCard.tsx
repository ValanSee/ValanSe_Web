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
        className="block mx-auto p-4 mt-6 space-y-4 rounded-xl bg-[#F0F0F0] cursor-pointer"
        onClick={handleClick}
      >
        <div className="text-sm font-medium text-gray-700">
          {data.createdBy}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-base font-semibold">{data.title}</div>
        </div>

        <div className="space-y-2">
          {data.options.map((option, idx) => {
            return (
              <div
                className={`relative border rounded-md px-4 py-3 cursor-pointer transition-all ring-blue-500 bg-white`}
                key={option.optionId}
              >
                <div className="flex justify-between relative z-10 font-medium">
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
          <div className="text-xs text-gray-500 mb-2">
            {categoryMap[data.category] ?? data.category}
          </div>
          <div className="text-sm text-gray-400 text-right">
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
