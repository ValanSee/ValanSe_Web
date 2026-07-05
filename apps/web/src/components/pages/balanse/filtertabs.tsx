import { VOTE_CATEGORIES, VOTE_CATEGORY_LABEL } from '@/types/_shared/vote'

export default function FilterTabs({
  selected,
  onChangeCategory,
}: {
  selected: string
  onChangeCategory: (category: string) => void
}) {
  return (
    <div className="flex gap-2 px-4 mt-4 overflow-x-auto">
      {VOTE_CATEGORIES.map((category) => (
        <button
          key={category}
          className={`rounded-full px-3 py-2 text-sm font-medium transition whitespace-nowrap
            ${
              selected === category
                ? 'bg-[#7A97B8] text-white'
                : 'bg-white text-[#8E8E8E] border border-[#C6C6C6]'
            }
          `}
          onClick={() => onChangeCategory(category)}
        >
          {VOTE_CATEGORY_LABEL[category]}
        </button>
      ))}
    </div>
  )
}
