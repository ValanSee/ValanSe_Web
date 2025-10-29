'use client'

import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Image from 'next/image'
import Link from 'next/link'
import BestVoteArea from './bestVoteArea'

// 테스트 데이터
const categories = [
  { label: '음식', icon: '/category-food.svg', param: 'FOOD' },
  { label: '연애', icon: '/category-love.svg', param: 'LOVE' },
  { label: '기타', icon: '/category-etc.svg', param: 'ETC' },
]

const MainPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F0F0F0] px-4 pb-24">
      <BestVoteArea />

      <div className="flex flex-col items-center w-full gap-10 pt-8">
        {/* 밸런스 게임 만들기 */}
        <Link
          href="/create"
          className="flex items-center justify-between w-full h-[120px] pl-5 pr-4 py-3 bg-white rounded-lg text-2xl font-bold"
        >
          밸런스 게임 만들기
          <Image src="/create.svg" alt="create" width={28} height={28} />
        </Link>

        {/* 카테고리 */}
        <div className="flex justify-around w-full gap-2">
          {categories.map((c) => (
            <Link
              href={`/balanse?category=${c.param}`}
              key={c.label}
              className="flex flex-col items-center w-full p-4 pt-7 pb-5 rounded-lg bg-white"
            >
              <Image src={c.icon} alt={c.label} width={48} height={48} />
              <div className="text-md mt-1 font-semibold">{c.label}</div>
            </Link>
          ))}
        </div>

        <Link
          href="/balanse"
          className="flex items-center  w-full h-[120px] bg-white rounded-lg font-bold pl-4 text-2xl text-[#f27f23]"
        >
          New 전체보기
        </Link>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavBar />
    </div>
  )
}

export default MainPage
