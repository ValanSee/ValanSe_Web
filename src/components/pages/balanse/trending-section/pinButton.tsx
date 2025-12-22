import { PinType } from '@/types/balanse/vote'

type Props = {
  pinType: PinType
}

export const PinButton = ({ pinType }: Props) => {
  return <button>{pinType === 'TRENDING' ? '고정됨' : '비었음'}</button>
}
