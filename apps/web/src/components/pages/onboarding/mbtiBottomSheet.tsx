'use client'

import { ModalOverlay } from '@/components/ui/modal'
import { useState } from 'react'
import { MBTI } from '@/types/member'

interface MBTIBottomSheetProps {
  onClose: () => void
  setMbti: (mbti: MBTI) => void
}

const chipClass = (selected: boolean) =>
  `w-20 h-10 flex items-center justify-center rounded-full border text-lg ${
    selected
      ? 'border-[#4D7298] text-[#4D7298]'
      : 'border-gray-300 text-[#8E8E8E]'
  }`

const MBTIBottomSheet = ({ onClose, setMbti }: MBTIBottomSheetProps) => {
  const [selectedEI, setSelectedEI] = useState('')
  const [selectedNS, setSelectedNS] = useState('')
  const [selectedTF, setSelectedTF] = useState('')
  const [selectedPJ, setSelectedPJ] = useState('')

  const isComplete =
    Boolean(selectedEI) &&
    Boolean(selectedNS) &&
    Boolean(selectedTF) &&
    Boolean(selectedPJ)

  const handleSelectMBTI = () => {
    if (!isComplete) {
      return
    }
    onClose()
    setMbti(`${selectedEI}${selectedNS}${selectedTF}${selectedPJ}` as MBTI)
  }

  return (
    <ModalOverlay onClose={onClose} className="items-end z-[100]">
      <div className="flex flex-col w-full pt-5 px-4 pb-20 bg-white rounded-t-xl border-t-2">
        <div className="text-xl font-bold">MBTI를 알려주세요</div>

        <div className="grid grid-cols-2 pt-7">
          <div className="flex items-center justify-between pr-3 pb-4 border-r border-b">
            <button
              type="button"
              onClick={() => setSelectedEI('E')}
              className={chipClass(selectedEI === 'E')}
            >
              E
            </button>
            <button
              type="button"
              onClick={() => setSelectedEI('I')}
              className={chipClass(selectedEI === 'I')}
            >
              I
            </button>
          </div>
          <div className="flex items-center justify-between pl-3 pb-4 border-l border-b">
            <button
              type="button"
              onClick={() => setSelectedNS('N')}
              className={chipClass(selectedNS === 'N')}
            >
              N
            </button>
            <button
              type="button"
              onClick={() => setSelectedNS('S')}
              className={chipClass(selectedNS === 'S')}
            >
              S
            </button>
          </div>
          <div className="flex items-center justify-between pr-3 pt-4 border-r border-t">
            <button
              type="button"
              onClick={() => setSelectedTF('T')}
              className={chipClass(selectedTF === 'T')}
            >
              T
            </button>
            <button
              type="button"
              onClick={() => setSelectedTF('F')}
              className={chipClass(selectedTF === 'F')}
            >
              F
            </button>
          </div>
          <div className="flex items-center justify-between pl-3 pt-4 border-l border-t">
            <button
              type="button"
              onClick={() => setSelectedPJ('P')}
              className={chipClass(selectedPJ === 'P')}
            >
              P
            </button>
            <button
              type="button"
              onClick={() => setSelectedPJ('J')}
              className={chipClass(selectedPJ === 'J')}
            >
              J
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center pt-10">
          <button
            type="button"
            className="w-full h-16 rounded-md bg-[#839DB7] text-white disabled:opacity-40"
            onClick={handleSelectMBTI}
            disabled={!isComplete}
          >
            선택 완료
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

export default MBTIBottomSheet
