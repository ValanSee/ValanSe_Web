import { Flame } from 'lucide-react'

export const SectionHeader = () => {
  return (
    <div className="flex items-center gap-1 mt-2">
      <Flame className="w-4 h-4 text-orange-500" />
      <span className="text-md font-semibold">인기 급상승 토픽</span>
    </div>
  )
}
