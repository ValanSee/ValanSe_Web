import { PinButton } from './pinButton'

export const SectionHeader = () => {
  return (
    <header className="w-full mb-3 flex justify-end">
      <PinButton pinType="TRENDING" />
    </header>
  )
}
