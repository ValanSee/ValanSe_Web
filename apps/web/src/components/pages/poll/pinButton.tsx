import { PinType } from '@/types/balanse/vote'

type Props = {
  pinType: PinType
  onClick?: () => void
}

const PIN_LABELS: Record<PinType, string> = {
  HOT: '고정됨',
  TRENDING: '비었음',
  NONE: '비었음',
}

export const PinButton = ({ pinType, onClick }: Props) => {
  if (!pinType) return null

  const isPinned = pinType === 'HOT'

  return (
    <button
      className={`flex items-center gap-1 border border-2 border-black rounded-full px-3 py-1 text-black text-sm font-semibold
        ${isPinned ? 'bg-blue-300' : 'bg-gray-200'}`}
      disabled={!isPinned}
      onClick={onClick}
    >
      <img
        src={isPinned ? '/check-circle.svg' : '/letter-x-circle.svg'}
        alt="pin"
        width={20}
        height={20}
      />
      <span>{PIN_LABELS[pinType]}</span>
    </button>
  )
}
