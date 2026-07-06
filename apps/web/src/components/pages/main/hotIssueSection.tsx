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
    // TODO(design): 배경색 #839DB7은 브랜드 blue-gray 팔레트 확정 후 치환
    <div className="rounded-b-[2rem] bg-[#839DB7] px-6 pb-6">
      {/* 투표 정보 */}
      <div className="flex flex-col items-center pt-12 text-primary-foreground">
        <Image src="/fire.svg" alt="fire" width={40} height={40} />
        <div className="typo-heading-02 pt-4">오늘의 핫이슈</div>
        <div className="typo-body-c-02 pt-1">24시간 이후 투표 종료</div>
        <div className="typo-title-03 pt-4">1,234명 참여</div>
      </div>

      {/* 선택지 */}
      <div className="grid w-full max-w-md grid-cols-2 gap-2 pt-5">
        {options.map((label, i) => (
          <button
            key={label}
            className={`h-[9.5rem] w-45 rounded-lg border px-7 py-6 shadow-sm ${
              selectedOption === label
                ? 'bg-brand-black text-primary-foreground'
                : 'bg-card text-foreground'
            }`}
            onClick={() => setSelectedOption(label)}
          >
            <div className="typo-heading-04 mb-1">{label}</div>
            <div className="typo-body-c-02">{optionTexts[i]}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default HotIssueSection
