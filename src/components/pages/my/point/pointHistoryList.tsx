'use client'

import { PointHistoryItem } from '@/types/_shared/pointHistory'

interface PointHistoryListProps {
  items: PointHistoryItem[]
}

// 'YYYY-MM-DD HH:mm:ss' → 'YYYY.MM.DD HH:mm'
const formatCreatedAt = (raw: string) => {
  if (!raw) return ''
  const [date, time] = raw.split(' ')
  const dateOut = date?.replaceAll('-', '.') ?? ''
  const timeOut = time?.slice(0, 5) ?? ''
  return `${dateOut} ${timeOut}`.trim()
}

const PointHistoryList = ({ items }: PointHistoryListProps) => {
  if (items.length === 0) {
    return (
      <section className="flex-1 flex flex-col items-center justify-center py-20">
        <div className="text-sm text-[#8E8E8E]">아직 받은 포인트가 없어요</div>
      </section>
    )
  }

  return (
    <section className="px-4 pt-5 pb-20">
      <h2 className="text-[16px] font-bold mb-3 text-[#1D1D1D]">
        포인트 내역
      </h2>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-[#F0F0F0] last:border-b-0"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-medium text-[#1D1D1D]">
                {item.typeDescription}
              </span>
              <span className="text-xs text-[#8E8E8E]">
                {formatCreatedAt(item.createdAt)}
              </span>
            </div>
            <span
              className={`text-[15px] font-semibold ${
                item.amount >= 0 ? 'text-[#4D7298]' : 'text-[#8E8E8E]'
              }`}
            >
              {item.amount > 0 ? `+${item.amount}` : `${item.amount}`}P
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PointHistoryList
