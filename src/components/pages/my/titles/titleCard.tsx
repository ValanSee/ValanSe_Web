'use client'

import { Title } from '@/types/_shared/title'
import { TIER_BADGE_CLASS, TIER_LABEL } from './tierStyle'

interface TitleCardProps {
  title: Title
  onAction: (title: Title) => void
}

const TitleCard = ({ title, onAction }: TitleCardProps) => {
  const buttonLabel = title.equipped
    ? '장착중'
    : title.locked
      ? title.acquisitionType === 'POINT_PURCHASE'
        ? `${title.price}P 구매`
        : '잠금'
      : '장착'

  const buttonDisabled =
    title.equipped ||
    (title.locked && title.acquisitionType !== 'POINT_PURCHASE')

  return (
    <li className="flex items-start justify-between gap-3 py-4 border-b border-[#F0F0F0] last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${TIER_BADGE_CLASS[title.tier]}`}
          >
            {TIER_LABEL[title.tier]}
          </span>
          <span className="text-[15px] font-semibold text-[#1D1D1D] truncate">
            {title.title}
          </span>
        </div>
        <p className="text-xs text-[#8E8E8E] mt-1">{title.description}</p>
        {title.locked && title.lockReason && (
          <p className="text-xs text-[#EB5E28] mt-1">{title.lockReason}</p>
        )}
        {!title.locked && title.requirementText && (
          <p className="text-xs text-[#8E8E8E] mt-1">
            획득 조건: {title.requirementText}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onAction(title)}
        disabled={buttonDisabled}
        className={`shrink-0 h-9 px-3 rounded-md text-[13px] font-semibold transition-colors ${
          title.equipped
            ? 'bg-[#F0F0F0] text-[#8E8E8E]'
            : buttonDisabled
              ? 'bg-[#F0F0F0] text-[#C6C6C6]'
              : title.locked
                ? 'bg-[#EB5E28] text-white hover:bg-[#c94e21]'
                : 'bg-[#4D7298] text-white hover:bg-[#3f5f7e]'
        }`}
      >
        {buttonLabel}
      </button>
    </li>
  )
}

export default TitleCard
