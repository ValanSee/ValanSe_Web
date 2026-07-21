'use client'

import { ModalOverlay } from '@/components/ui/modal'
import { useState } from 'react'
import { MBTI } from '@/types/member'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MBTIBottomSheetProps {
  onClose: () => void
  setMbti: (mbti: MBTI) => void
}

const MBTIOption = ({
  name,
  value,
  checked,
  onChange,
}: {
  name: string
  value: string
  checked: boolean
  onChange: () => void
}) => (
  <label className="cursor-pointer">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="peer sr-only"
    />
    <span
      className={cn(
        'flex h-11 w-20 items-center justify-center rounded-full border transition-colors',
        'typo-heading-06',
        checked
          ? 'border-primary bg-brand-violet-50 text-primary'
          : 'border-brand-gray-75 bg-card text-brand-gray-100',
      )}
    >
      {value}
    </span>
  </label>
)

const MBTIBottomSheet = ({ onClose, setMbti }: MBTIBottomSheetProps) => {
  const [selectedEI, setSelectedEI] = useState('')
  const [selectedNS, setSelectedNS] = useState('')
  const [selectedTF, setSelectedTF] = useState('')
  const [selectedPJ, setSelectedPJ] = useState('')

  const isComplete =
    !!selectedEI && !!selectedNS && !!selectedTF && !!selectedPJ

  const handleConfirm = () => {
    if (!isComplete) return
    onClose()
    setMbti(`${selectedEI}${selectedNS}${selectedTF}${selectedPJ}` as MBTI)
  }

  return (
    <ModalOverlay onClose={onClose} className="z-[100] items-end">
      <div className="flex w-full flex-col gap-8 rounded-t-[20px] bg-card px-5 pb-10 pt-6">
        <h2 className="typo-heading-05 text-foreground">MBTI를 알려주세요</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          {[
            {
              name: 'mbti-ei',
              options: ['E', 'I'] as const,
              value: selectedEI,
              set: setSelectedEI,
            },
            {
              name: 'mbti-ns',
              options: ['N', 'S'] as const,
              value: selectedNS,
              set: setSelectedNS,
            },
            {
              name: 'mbti-tf',
              options: ['T', 'F'] as const,
              value: selectedTF,
              set: setSelectedTF,
            },
            {
              name: 'mbti-pj',
              options: ['P', 'J'] as const,
              value: selectedPJ,
              set: setSelectedPJ,
            },
          ].map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-around border-b border-brand-gray-75 pb-4 last:border-b-0"
            >
              {row.options.map((v) => (
                <MBTIOption
                  key={v}
                  name={row.name}
                  value={v}
                  checked={row.value === v}
                  onChange={() => row.set(v)}
                />
              ))}
            </div>
          ))}
        </div>
        <Button
          variant="primary"
          size="xl"
          fullWidth
          onClick={handleConfirm}
          disabled={!isComplete}
        >
          선택 완료
        </Button>
      </div>
    </ModalOverlay>
  )
}

export default MBTIBottomSheet
