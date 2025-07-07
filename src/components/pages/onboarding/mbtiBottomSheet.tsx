'use client'

import Modal from '@/components/_shared/modal'
import { useState } from 'react'

interface MBTIBottomSheetProps {
  onClose: () => void
  setMbti: (mbti: string) => void
}

const MBTIBottomSheet = ({ onClose, setMbti }: MBTIBottomSheetProps) => {
  const [selectedEI, setSelectedEI] = useState('')
  const [selectedNS, setSelectedNS] = useState('')
  const [selectedTF, setSelectedTF] = useState('')
  const [selectedPJ, setSelectedPJ] = useState('')

  const handleSelectMBTI = () => {
    onClose()
    setMbti(`${selectedEI}${selectedNS}${selectedTF}${selectedPJ}`)
  }

  return (
    <Modal zIndex={100}>
      <div className="flex flex-col w-full mt-auto pt-5 px-4 pb-20 bg-white rounded-t-xl border-t-2">
        <div className="text-xl font-bold">MBTI를 알려주세요</div>

        <div className="grid grid-cols-2 pt-7">
          <div className="flex items-center justify-between pr-3 pb-4 border-r border-b">
            <div
              onClick={() => setSelectedEI('E')}
              className={`w-20 h-10 flex items-center justify-center rounded-full border text-lg ${selectedEI === 'E' ? 'border-[#4D7298] text-[#4D7298]' : 'border-gray-300 text-gray-300'}`}
            >
              E
            </div>
            <div
              onClick={() => setSelectedEI('I')}
              className={`w-20 h-10 flex items-center justify-center rounded-full border text-lg ${selectedEI === 'I' ? 'border-[#4D7298] text-[#4D7298]' : 'border-gray-300 text-gray-300'}`}
            >
              I
            </div>
          </div>
          <div className="flex items-center justify-between pl-3 pb-4 border-l border-b">
            <div
              onClick={() => setSelectedNS('N')}
              className={`w-20 h-10 flex items-center justify-center rounded-full border text-lg ${selectedNS === 'N' ? 'border-[#4D7298] text-[#4D7298]' : 'border-gray-300 text-gray-300'}`}
            >
              N
            </div>
            <div
              onClick={() => setSelectedNS('S')}
              className={`w-20 h-10 flex items-center justify-center rounded-full border text-lg ${selectedNS === 'S' ? 'border-[#4D7298] text-[#4D7298]' : 'border-gray-300 text-gray-300'}`}
            >
              S
            </div>
          </div>
          <div className="flex items-center justify-between pr-3 pt-4 border-r border-t">
            <div
              onClick={() => setSelectedTF('T')}
              className={`w-20 h-10 flex items-center justify-center rounded-full border text-lg ${selectedTF === 'T' ? 'border-[#4D7298] text-[#4D7298]' : 'border-gray-300 text-gray-300'}`}
            >
              T
            </div>
            <div
              onClick={() => setSelectedTF('F')}
              className={`w-20 h-10 flex items-center justify-center rounded-full border text-lg ${selectedTF === 'F' ? 'border-[#4D7298] text-[#4D7298]' : 'border-gray-300 text-gray-300'}`}
            >
              F
            </div>
          </div>
          <div className="flex items-center justify-between pl-3 pt-4 border-l border-t">
            <div
              onClick={() => setSelectedPJ('P')}
              className={`w-20 h-10 flex items-center justify-center rounded-full border text-lg ${selectedPJ === 'P' ? 'border-[#4D7298] text-[#4D7298]' : 'border-gray-300 text-gray-300'}`}
            >
              P
            </div>
            <div
              onClick={() => setSelectedPJ('J')}
              className={`w-20 h-10 flex items-center justify-center rounded-full border text-lg ${selectedPJ === 'J' ? 'border-[#4D7298] text-[#4D7298]' : 'border-gray-300 text-gray-300'}`}
            >
              J
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center pt-10">
          <button
            className="w-full h-16 rounded-md bg-[#839DB7] text-white"
            onClick={handleSelectMBTI}
          >
            선택 완료
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default MBTIBottomSheet
