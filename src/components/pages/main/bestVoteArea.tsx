'use client'

import Image from 'next/image'
import VoteOptionGrid from './voteOptionGrid'
import { BestVoteResponse, fetchBestVote } from '@/api/votes'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function BestVoteArea() {
  const router = useRouter()
  const [voteData, setVoteData] = useState<BestVoteResponse | null>(null)

  useEffect(() => {
    const loadBestVote = async () => {
      try {
        const response = await fetchBestVote()
        setVoteData(response)
      } catch (error) {
        console.error('Failed to fetch best vote:', error)
      }
    }
    loadBestVote()
  }, [])

  return (
    <div className="flex flex-col items-center bg-[#839db7] rounded-bl-2xl rounded-br-2xl w-screen px-6 pb-5">
      {voteData === null ? (
        <div className="flex flex-col items-center justify-center min-h-[438px] text-white text-2xl font-bold">
          로딩중...
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center pt-[98px] leading-none">
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
            <div className="pt-4 text-white text-lg font-bold">
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
