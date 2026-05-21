'use client'

export type TitleTabKey = 'owned' | 'locked'

interface TitleTabsProps {
  active: TitleTabKey
  onChange: (key: TitleTabKey) => void
  ownedCount: number
  lockedCount: number
}

const TitleTabs = ({
  active,
  onChange,
  ownedCount,
  lockedCount,
}: TitleTabsProps) => {
  const tabs: { key: TitleTabKey; label: string; count: number }[] = [
    { key: 'owned', label: '보유', count: ownedCount },
    { key: 'locked', label: '잠금', count: lockedCount },
  ]

  return (
    <div className="flex border-b border-[#F0F0F0]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`flex-1 h-12 text-[15px] font-semibold transition-colors ${
            active === tab.key
              ? 'text-[#1D1D1D] border-b-2 border-[#1D1D1D]'
              : 'text-[#8E8E8E]'
          }`}
        >
          {tab.label} {tab.count}
        </button>
      ))}
    </div>
  )
}

export default TitleTabs
