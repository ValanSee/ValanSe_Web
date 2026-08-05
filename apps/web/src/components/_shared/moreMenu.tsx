'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

export interface MoreMenuItem {
  label: string
  /** iconify 아이콘 이름 */
  icon?: string
  onSelect: () => void
  /** true 이면 destructive 색상 */
  destructive?: boolean
}

interface MoreMenuProps {
  items: MoreMenuItem[]
  /** aria-label — 스크린리더용 */
  label?: string
  className?: string
}

/**
 * 케밥(⋮) 버튼 + 드롭다운. 항목이 없으면 렌더하지 않는다.
 * 투표 상세 헤더·댓글/대댓글의 삭제·신고 진입점으로 사용.
 */
export default function MoreMenu({
  items,
  label = '더보기',
  className,
}: MoreMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  if (items.length === 0) return null

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 text-brand-gray-100"
      >
        <Icon icon="tabler:dots-vertical" width={18} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-8 z-20 min-w-[120px] overflow-hidden rounded-xl bg-card shadow-[0_0_8px_rgba(0,0,0,0.12)]"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                item.onSelect()
              }}
              className={cn(
                'typo-label-03 flex w-full items-center gap-2 px-4 py-2',
                item.destructive ? 'text-destructive' : 'text-brand-gray-200',
              )}
            >
              {item.icon && <Icon icon={item.icon} width={16} aria-hidden />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
