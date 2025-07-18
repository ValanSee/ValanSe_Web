export default function FilterTabs() {
  const tabs = ['전체', '음식', '연애', '기타']

  return (
    <div className="flex gap-2 px-4 mt-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button key={tab} className="rounded-full px-4 py-1 text-sm">
          {tab}
        </button>
      ))}
    </div>
  )
}
