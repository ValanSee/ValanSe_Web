'use client'
import { useState } from 'react'

interface Props {
  onDelete: () => void
}

export default function AdminFloatingButton({ onDelete }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-end fixed bottom-4 right-4 z-50">
      {/* 액션 메뉴 */}
      {open && (
        <div className="mb-3 rounded-xl bg-white shadow-lg border overflow-hidden">
          <button
            onClick={onDelete}
            className="block w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            게시글 삭제
          </button>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center text-xl"
      >
        ⚙️
      </button>
    </div>
  )
}
