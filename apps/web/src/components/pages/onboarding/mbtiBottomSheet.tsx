'use client'

import { ModalOverlay } from '@/components/ui/modal'
import { useState } from 'react'
import { MBTI } from '@/types/member'

interface MBTIBottomSheetProps {
  onClose: () => void
  setMbti: (mbti: MBTI) => void
}

// MBTI 각 속성별 라디오 한 칸. 같은 name으로 묶여 네이티브 단일 선택/방향키 이동을 제공한다.
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
    <span className="w-20 h-10 flex items-center justify-center rounded-full border text-lg border-gray-300 text-[#8E8E8E] peer-checked:border-[#4D7298] peer-checked:text-[#4D7298] peer-focus-visible:ring-2 peer-focus-visible:ring-[#4D7298]">
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
            <MBTIOption
              name="mbti-ei"
              value="E"
              checked={selectedEI === 'E'}
              onChange={() => setSelectedEI('E')}
            />
            <MBTIOption
              name="mbti-ei"
              value="I"
              checked={selectedEI === 'I'}
              onChange={() => setSelectedEI('I')}
            />
          </div>
          <div className="flex items-center justify-between pl-3 pb-4 border-l border-b">
            <MBTIOption
              name="mbti-ns"
              value="N"
              checked={selectedNS === 'N'}
              onChange={() => setSelectedNS('N')}
            />
            <MBTIOption
              name="mbti-ns"
              value="S"
              checked={selectedNS === 'S'}
              onChange={() => setSelectedNS('S')}
            />
          </div>
          <div className="flex items-center justify-between pr-3 pt-4 border-r border-t">
            <MBTIOption
              name="mbti-tf"
              value="T"
              checked={selectedTF === 'T'}
              onChange={() => setSelectedTF('T')}
            />
            <MBTIOption
              name="mbti-tf"
              value="F"
              checked={selectedTF === 'F'}
              onChange={() => setSelectedTF('F')}
            />
          </div>
          <div className="flex items-center justify-between pl-3 pt-4 border-l border-t">
            <MBTIOption
              name="mbti-pj"
              value="P"
              checked={selectedPJ === 'P'}
              onChange={() => setSelectedPJ('P')}
            />
            <MBTIOption
              name="mbti-pj"
              value="J"
              checked={selectedPJ === 'J'}
              onChange={() => setSelectedPJ('J')}
            />
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
