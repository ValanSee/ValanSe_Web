'use client'

import { Title } from '@/types/_shared/title'
import { TIER_BADGE_CLASS, TIER_LABEL } from './tierStyle'

interface TitleCurrentSectionProps {
  equipped: Title | null
  point: number
}

const TitleCurrentSection = ({
  equipped,
  point,
}: TitleCurrentSectionProps) => {
  return (
    <section className="px-4 pt-6 pb-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[#8E8E8E]">현재 장착 칭호</div>
        <div className="text-sm">
          <span className="text-[#8E8E8E]">보유 </span>
          <span className="text-[#4D7298] font-semibold">
            {point.toLocaleString()}P
          </span>
        </div>
      </div>
      {equipped ? (
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${TIER_BADGE_CLASS[equipped.tier]}`}
          >
            {TIER_LABEL[equipped.tier]}
          </span>
          <span className="text-[18px] font-bold text-[#1D1D1D]">
            {equipped.title}
          </span>
        </div>
      ) : (
        <div className="mt-2 text-[15px] text-[#8E8E8E]">
          장착된 칭호가 없습니다
        </div>
      )}
    </section>
  )
}

export default TitleCurrentSection
