import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface Props {
  index: number
  content: string
  isSelected: boolean
  disabled?: boolean
  onClick: () => void
}

export default function VoteOptionPill({
  index,
  content,
  isSelected,
  disabled,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isSelected}
      className={cn(
        'typo-label-02 flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-[colors,transform] active:scale-[0.98] disabled:active:scale-100',
        isSelected
          ? 'bg-primary text-primary-foreground'
          : 'bg-brand-gray-50 text-primary',
        disabled && 'cursor-not-allowed opacity-70',
      )}
    >
      <span className="typo-heading-06">{String.fromCharCode(65 + index)}</span>
      <span className="flex-1 truncate">{content}</span>
      {isSelected && (
        <Icon
          icon="tabler:check"
          width={20}
          className="text-primary-foreground"
          aria-hidden
        />
      )}
    </button>
  )
}
