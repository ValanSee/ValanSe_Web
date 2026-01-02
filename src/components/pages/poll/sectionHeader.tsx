import { PinType } from '@/types/balanse/vote'
import { PinButton } from './pinButton'

type Props = {
  pinType: PinType
}

export const SectionHeader = ({ pinType }: Props) => {
  return (
    <header className="w-full mb-3 flex justify-end">
      <PinButton pinType={pinType} />
    </header>
  )
}
