'use client'

import BottomNavBar from '@/components/_shared/bottomNavBar'
import Image from 'next/image'

// 테스트 데이터
const categories = [
  { label: '음식', icon: '/category-food.svg' },
  { label: '연애', icon: '/category-love.svg' },
  { label: '기타', icon: '/category-etc.svg' },
]

const options = ['A', 'B']
const optionTexts = [
  '점심 회사 돈으로, 메뉴 못 정함',
  '점심 내 돈으로, 메뉴 마음대로',
]

const MainPage = () => {
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
          <div className="pt-4 text-white text-lg font-bold">1,234명 참여</div>
        </div>

        {/* 선택지 */}
        <div className="grid grid-cols-2 gap-2 w-full pt-4 h-[164px]">
          {options.map((label, index) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-5 w-full h-full p-4 py-6 rounded-lg bg-white border ${index % 2 === 0 ? 'border-[#5F81A3]' : 'border-[#F27F34]'}`}
            >
              <div
                className={`font-bold text-2xl ${index % 2 === 0 ? 'text-[#5F81A3]' : 'text-[#F27F34]'}`}
              >
                {label}
              </div>
              <div className="text-sm text-center">{optionTexts[index]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center w-full gap-10 pt-8">
        {/* 밸런스 게임 만들기 */}
        <button className="flex items-center justify-between w-full h-[120px] pl-5 pr-4 py-3 bg-white rounded-lg text-2xl font-bold">
          밸런스 게임 만들기
          <Image
            src="/create-game.svg"
            alt="create-game"
            width={44}
            height={44}
          />
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
