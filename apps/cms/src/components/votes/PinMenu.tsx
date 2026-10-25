'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Flame, PinOff, Trash2 } from 'lucide-react'
import { pinVote, deleteVote } from '@/lib/votes'
import type { PinType } from '@/types/vote'

type Props = {
  voteId: number
  onChange?: () => void
}

export function PinMenu({ voteId, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const onSelect = async (type: PinType) => {
    if (busy) return
    try {
      setBusy(true)
      await pinVote(voteId, type)
      setOpen(false)
      onChange?.()
    } catch (err) {
      console.error('pinVote failed:', err)
      alert('처리 중 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const onDelete = async () => {
    if (busy) return
    if (!window.confirm('이 투표를 삭제하시겠습니까?')) return
    try {
      setBusy(true)
      await deleteVote(voteId)
      setOpen(false)
      onChange?.()
    } catch (err) {
      console.error('deleteVote failed:', err)
      alert('삭제 중 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="고정 메뉴"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      {open && (
        <ul className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <li>
            <button
              type="button"
              disabled={busy}
              onClick={() => onSelect('TRENDING')}
              className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Flame className="mr-3 h-4 w-4 text-orange-500" />
              핫이슈 고정
            </button>
          </li>
          <li className="border-t border-gray-100">
            <button
              type="button"
              disabled={busy}
              onClick={() => onSelect('NONE')}
              className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <PinOff className="mr-3 h-4 w-4 text-gray-500" />
              고정 해제
            </button>
          </li>
          <li className="border-t border-gray-100">
            <button
              type="button"
              disabled={busy}
              onClick={onDelete}
              className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="mr-3 h-4 w-4" />
              투표 삭제
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
