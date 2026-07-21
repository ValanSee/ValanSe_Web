import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface Props {
  text: string
  /** iconify 아이콘 이름. 지정하면 상단에 노출 */
  icon?: string
  /** 폭·정렬 커스터마이즈 */
  className?: string
}

/**
 * 빈 상태 안내. 리스트/섹션이 비었을 때 사용.
 */
export default function EmptyState({ text, icon, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-8 text-center',
        className,
      )}
    >
      {icon && (
        <Icon
          icon={icon}
          width={40}
          className="text-brand-gray-75"
          aria-hidden
        />
      )}
      <p className="typo-body-b-01 text-brand-gray-100">{text}</p>
    </div>
  )
}
