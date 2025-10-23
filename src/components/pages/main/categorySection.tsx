// 테스트 데이터
const categories = [
  { label: '음식', icon: '🍽️' },
  { label: '연애', icon: '💖' },
  { label: '기타', icon: '⭐' },
]

function CategorySection() {
  return (
    <div className="flex justify-around w-full max-w-md pt-10 gap-4">
      {categories.map((c) => (
        <div
          key={c.label}
          className="p-4 flex flex-col items-center justify-center rounded-lg border shadow-md py-6 w-full bg-white"
        >
          <div className="text-2xl">{c.icon}</div>
          <div className="text-sm mt-1">{c.label}</div>
        </div>
      ))}
    </div>
  )
}

export default CategorySection
