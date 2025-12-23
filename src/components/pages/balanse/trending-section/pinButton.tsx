import { PinType } from '@/types/balanse/vote'

type Props = {
  pinType: PinType
  onClick?: () => void
}

const PIN_LABELS: Record<PinType, string> = {
  HOT: '비었음',
  TRENDING: '고정됨',
  NONE: '비었음',
}

export const PinButton = ({ pinType, onClick }: Props) => {
  if (!pinType) return null

  const isPinned = pinType === 'TRENDING'

  return (
    <button
      className={`flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 text-sm text-gray-600 
        ${isPinned ? 'bg-blue-100 border-blue-400 text-blue-600' : 'bg-white'}`}
      disabled={!isPinned}
      onClick={onClick}
    >
      {isPinned && (
        <img src="/check-circle.svg" alt="pin" width={16} height={16} />
      )}
      <span>{PIN_LABELS[pinType]}</span>
    </button>
  )
}
