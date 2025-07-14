'use client'

import BottomNavBar from '@/components/_shared/bottomNavBar'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { BestVoteResponse, fetchBestVote } from '@/api/votes'
import VoteOptionGrid from './voteOptionGrid'

// 테스트 데이터
const categories = [
  { label: '음식', icon: '/category-food.svg' },
  { label: '연애', icon: '/category-love.svg' },
  { label: '기타', icon: '/category-etc.svg' },
]

const MainPage = () => {
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

  if (!voteData) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F0F0F0] px-4 pt-6">
      <div className="flex flex-col items-center bg-[#839db7] rounded-bl-2xl rounded-br-2xl w-screen px-6 pb-5">
        {/* 상단 */}
        <div className="flex flex-col items-center pt-[98px] leading-none">
          <Image src="/fire.svg" alt="fire" width={40} height={40} />
          <div className="pt-4 text-white text-3xl font-bold">
            오늘의 핫이슈
          </div>
          <div className="pt-1 text-white text-xs font-normal">
            24시간 이후 투표 종료
          </div>
          <div className="pt-4 text-white text-lg font-bold">
            {voteData.totalParticipants.toLocaleString()}명 참여
          </div>
        </div>

        {/* 선택지 */}
        <VoteOptionGrid options={voteData.options} />
      </div>

      <div className="flex flex-col items-center w-full gap-10 pt-8">
        {/* 밸런스 게임 만들기 */}
        <button className="flex items-center justify-between w-full h-[120px] pl-5 pr-4 py-3 bg-white rounded-lg text-2xl font-bold">
          밸런스 게임 만들기
          <Image src="/create.svg" alt="create" width={28} height={28} />
        </button>

        {/* 카테고리 */}
        <div className="flex justify-around w-full gap-2">
          {categories.map((c) => (
            <div
              key={c.label}
              className="flex flex-col items-center w-full p-4 pt-7 pb-5 rounded-lg bg-white"
            >
              <Image src={c.icon} alt={c.label} width={48} height={48} />
              <div className="text-md mt-1 font-semibold">{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavBar />
    </div>
  )
}

export default MainPage
