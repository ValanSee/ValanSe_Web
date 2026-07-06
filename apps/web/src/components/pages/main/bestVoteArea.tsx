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
    // TODO(design): 배경색 #839db7은 브랜드 blue-gray 팔레트 확정 후 치환
    <div className="flex min-h-[500px] w-screen flex-col items-center rounded-b-2xl bg-[#839db7] px-6 pb-5">
      {isLoading ? (
        <div className="flex w-full flex-1 flex-col items-center justify-center pt-[98px]">
          <InlineLoading />
        </div>
      ) : (
        <>
          <div className="flex min-h-[150px] flex-col items-center pt-[98px] leading-none">
            <Image src="/fire.svg" alt="fire" width={40} height={40} />
            <div className="typo-heading-01 pt-4 text-primary-foreground">
              오늘의 핫이슈
            </div>
            <div className="typo-body-c-03 pt-1 text-primary-foreground">
              24시간 이후 투표 종료
            </div>
            <div className="typo-heading-04 pt-4 text-primary-foreground">
              {voteData?.totalParticipants.toLocaleString()}명 참여
            </div>
            <div className="typo-heading-04 line-clamp-2 pt-4 text-primary-foreground">
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
