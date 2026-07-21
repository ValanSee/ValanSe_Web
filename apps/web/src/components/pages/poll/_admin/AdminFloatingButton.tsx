'use client'

import { useState } from 'react'
import { IconButton } from '@/components/ui/iconButton'

interface Props {
  onDelete: () => void
}

export default function AdminFloatingButton({ onDelete }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 overflow-hidden rounded-xl border border-brand-gray-75 bg-card shadow-lg">
          <button
            type="button"
            onClick={onDelete}
            className="typo-label-02 block w-full px-4 py-3 text-destructive hover:bg-destructive/10"
          >
            게시글 삭제
          </button>
        </div>
      )}

      <IconButton
        icon="mdi:cog"
        label="관리자 메뉴"
        variant="primary"
        size="lg"
        shape="circle"
        className="shadow-xl"
        onClick={() => setOpen((prev) => !prev)}
      />
    </div>
  )
}
