'use client'

import { PointHistoryItem } from '@/types/_shared/pointHistory'

interface PointHistoryListProps {
  items: PointHistoryItem[]
}

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
      <section className="flex flex-1 flex-col items-center justify-center py-20">
        <p className="typo-body-b-01 text-brand-gray-100">
          아직 받은 포인트가 없어요
        </p>
      </section>
    )
  }

  return (
    <section className="px-4 pb-20 pt-5">
      <h2 className="typo-title-02 mb-3 text-foreground">포인트 내역</h2>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between border-b border-brand-gray-75 py-3 last:border-b-0"
          >
            <div className="flex flex-col gap-1">
              <span className="typo-label-02 text-foreground">
                {item.typeDescription}
              </span>
              <span className="typo-body-c-02 text-brand-gray-100">
                {formatCreatedAt(item.createdAt)}
              </span>
            </div>
            <span
              className={`typo-title-03 ${
                item.amount >= 0 ? 'text-primary' : 'text-brand-gray-100'
              }`}
            >
              {item.amount > 0 ? `+${item.amount}` : item.amount}P
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PointHistoryList
