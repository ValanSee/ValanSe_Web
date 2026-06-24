'use client'

import Image from 'next/image'
import VoteOptionGrid from './voteOptionGrid'
import { BestVoteResponse, fetchBestVote } from '@/api/votes'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import InlineLoading from '@/components/_shared/inlineLoading'

function BestVoteArea() {
  const router = useRouter()
  const [voteData, setVoteData] = useState<BestVoteResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBestVote = async () => {
      try {
        // 최소 0.8초 로딩 시간 보장
        const startTime = Date.now()
        const response = await fetchBestVote()
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, 800 - elapsedTime)

        await new Promise((resolve) => setTimeout(resolve, remainingTime))
        setVoteData(response)
      } catch (error) {
        console.error('Failed to fetch best vote:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadBestVote()
  }, [])

  return (
    <div className="flex flex-col items-center bg-[#839db7] rounded-bl-2xl rounded-br-2xl w-screen px-6 pb-5 min-h-[500px]">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center w-full pt-[98px] flex-1">
          <InlineLoading />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center pt-[98px] leading-none min-h-[150px]">
            <Image src="/fire.svg" alt="fire" width={40} height={40} />
            <div className="pt-4 text-white text-3xl font-bold">
              오늘의 핫이슈
            </div>
            <div className="pt-1 text-white text-xs font-normal">
              24시간 이후 투표 종료
            </div>
            <div className="pt-4 text-white text-lg font-bold">
              {voteData?.totalParticipants.toLocaleString()}명 참여
            </div>
            <div className="pt-4 text-white text-lg font-bold line-clamp-2">
              [ {voteData?.title} ]
            </div>
          </div>

          {/* 선택지 */}
          <div
            onClick={() => {
              router.push('/poll/hot')
            }}
            className="w-full cursor-pointer"
          >
            <VoteOptionGrid options={voteData?.options || []} />
          </div>
        </>
      )}
    </div>
  )
}

export default BestVoteArea
