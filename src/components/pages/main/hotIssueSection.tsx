'use client'

import Image from 'next/image'
import { useState } from 'react'

function HotIssueSection() {
  const options = ['A', 'B']
  const optionTexts = [
    '점심 회사 돈으로, 메뉴 못 정함',
    '점심 내 돈으로, 메뉴 마음대로',
  ]

  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  return (
    <div className="bg-[#839DB7] px-6 pb-6 rounded-b-[2rem]">
      {/* 투표 정보 */}
      <div className="flex flex-col items-center pt-12">
        <Image src="/fire.svg" alt="fire" width={40} height={40} />
        <div className="text-2xl font-bold pt-4">오늘의 핫이슈</div>
        <div className="text-sm pt-1">24시간 이후 투표 종료</div>
        <div className="text-md font-semibold pt-4">1,234명 참여</div>
      </div>

      {/* 선택지 */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-md pt-5">
        {options.map((label, i) => (
          <button
            key={label}
            className={`w-45 h-[9.5rem] rounded-lg border shadow-sm px-7 py-6 ${
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
  )
}

export default HotIssueSection
