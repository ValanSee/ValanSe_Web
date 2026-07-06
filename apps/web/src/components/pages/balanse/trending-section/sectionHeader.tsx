import { Flame } from 'lucide-react'

export const SectionHeader = () => {
  return (
    <div className="mt-2 flex items-center gap-1">
      {/* TODO(design): orange 강조색은 브랜드 오렌지 팔레트 확정 후 치환 */}
      <Flame className="h-4 w-4 text-orange-500" />
      <span className="typo-title-03 text-foreground">인기 급상승 토픽</span>
    </div>
  )
}
