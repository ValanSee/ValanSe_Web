'use client'

import { useState } from 'react'
import Image from 'next/image'

// 테스트 데이터
const categories = [
  { label: '음식', icon: '🍽️' },
  { label: '연애', icon: '💖' },
  { label: '기타', icon: '⭐' },
]

const options = ['A', 'B']
const optionTexts = [
  '점심 회사 돈으로, 메뉴 못 정함',
  '점심 내 돈으로, 메뉴 마음대로',
]

const navItems = ['홈', '인기', '밸런스', '만들기', '내 정보']
const icons = [
  'home.svg',
  'hotissue.svg',
  'valanse.svg',
  'write.svg',
  'mypage.svg',
]

const MainPage = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F0F0F0] px-4 py-6">
      <div className="flex flex-col items-center bg-[#839db7] rounded-bl-2xl rounded-br-2xl w-screen px-4">
        {/* 상단 */}
        <div className="text-center mb-4 pt-20">
          <div className="text-2xl font-bold text-white">오늘의 핫이슈</div>
          <div className="text-sm text-white">24시간 이후 투표 종료</div>
          <div className="mt-1 text-white font-semibold">1,234명 참여</div>
        </div>

        {/* 선택지 */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-4">
          {options.map((label, i) => (
            <button
              key={label}
              className={`p-4 rounded-lg border shadow-sm text-left py-6 ${
                selectedOption === label
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-800'
              }`}
              onClick={() => setSelectedOption(label)}
            >
              <div className="font-bold text-lg mb-1">{label}</div>
              <div className="text-sm">{optionTexts[i]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 밸런스 게임 만들기 */}
      <button
        className="my-6 py-3 px-6 bg-white rounded-xl shadow-md font-semibold
        flex items-center gap-2 w-full mx-4 h-[120px]"
      >
        밸런스 게임 만들기 ✏️
      </button>

      {/* 카테고리 */}
      <div className="flex justify-around w-full max-w-md mb-6 gap-4">
        {categories.map((c) => (
          <div
            key={c.label}
            className={`p-4 rounded-lg border shadow-md text-left py-6 w-full ${
              selectedOption === c.label
                ? 'bg-black text-white'
                : 'bg-white text-gray-800'
            }`}
          >
            <div className="text-2xl">{c.icon}</div>
            <div className="text-sm mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        {navItems.map((label, i) => (
          <div
            key={i}
            className="text-center text-sm text-gray-700 flex flex-col items-center justify-around"
          >
            <div className="text-lg">
              <Image src={icons[i]} alt={label} width={24} height={24} />
            </div>
            {label}
          </div>
        ))}
      </nav>
    </div>
  )
}

export default MainPage
