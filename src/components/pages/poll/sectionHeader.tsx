import { PinType } from '@/types/balanse/vote'
import { PinButton } from './pinButton'

type Props = {
  pinType: PinType
  handlePinButtonClick?: () => void
}

export const SectionHeader = ({ pinType, handlePinButtonClick }: Props) => {
  return (
    <header className="w-full mb-3 flex justify-end">
      <PinButton pinType={pinType} onClick={handlePinButtonClick} />
    </header>
  )
}
