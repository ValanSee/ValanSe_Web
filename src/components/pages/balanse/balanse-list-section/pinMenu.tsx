import { useState, useEffect, useRef } from 'react'
import { MoreVertical, Flame, TrendingUp, PinOff } from 'lucide-react'
import { pinVote } from '@/api/votes'
import { PinType } from '@/types/balanse/vote'

type Props = {
  onPinChange?: () => void
  voteId: number
}

export const PinMenu = ({ onPinChange, voteId }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 메뉴 바깥 클릭 시 닫기 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // 메뉴 열기/닫기 토글 (이벤트 전파 방지 필수)
  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleItemClick = async (e: React.MouseEvent, type: PinType) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await pinVote(voteId, type)
    } catch (error) {
      console.error('Failed to pin vote:', error)
    }

    if (onPinChange) onPinChange()
    setIsOpen(false) // 선택 후 닫기
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* 트리거 버튼 */}
      <button
        onClick={toggleMenu}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
        aria-label="메뉴 열기"
      >
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </button>

      {/* 드롭다운 메뉴 본체 */}
      {isOpen && (
        <ul
          className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] py-1 overflow-hidden"
          onClick={(e) => e.stopPropagation()} // 메뉴 내부 클릭 시 부모 Link 작동 방지
        >
          <li>
            <button
              onClick={(e) => handleItemClick(e, 'HOT')}
              className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Flame className="w-4 h-4 mr-3 text-orange-500" />
              핫이슈 고정
            </button>
          </li>
          <li>
            <button
              onClick={(e) => handleItemClick(e, 'TRENDING')}
              className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="w-4 h-4 mr-3 text-blue-500" />
              인기 급상승 고정
            </button>
          </li>
          <li className="border-t border-gray-100 mt-1">
            <button
              onClick={(e) => handleItemClick(e, 'NONE')}
              className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <PinOff className="w-4 h-4 mr-3" />
              고정 해제
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
