const tabMap: Record<string, string> = {
  전체: 'ALL',
  음식: 'FOOD',
  연애: 'LOVE',
  기타: 'ETC',
}

export default function FilterTabs({
  selected,
  onChangeCategory,
}: {
  selected: string
  onChangeCategory: (category: string) => void
}) {
  const tabs = ['전체', '음식', '연애', '기타']

  return (
    <div className="flex gap-2 px-4 mt-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`rounded-full px-5 py-2 text-sm font-medium transition
            ${
              selected === tabMap[tab]
                ? 'bg-[#7A97B8] text-white'
                : 'bg-white text-[#8E8E8E] border border-[#C6C6C6]'
            }
          `}
          onClick={() => onChangeCategory(tabMap[tab])}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
