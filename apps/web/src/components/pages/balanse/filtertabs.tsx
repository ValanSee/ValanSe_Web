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
    <div className="mt-4 flex gap-2 overflow-x-auto px-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          // TODO(design): 활성 상태 색 #7A97B8은 blue-gray 팔레트 미확정으로 TODO 유지.
          // 향후 Common/Chip primary variant로 교체 검토.
          className={`typo-label-03 whitespace-nowrap rounded-full px-3 py-2 transition
            ${
              selected === tabMap[tab]
                ? 'bg-[#7A97B8] text-primary-foreground'
                : 'border border-border bg-card text-brand-gray-100'
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
