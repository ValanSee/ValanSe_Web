'use client'
import { useState } from 'react'

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
            onClick={onDelete}
            className="typo-label-02 block w-full px-4 py-3 text-destructive hover:bg-destructive/10"
          >
            게시글 삭제
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-lg text-background shadow-xl"
      >
        ⚙️
      </button>
    </div>
  )
}
