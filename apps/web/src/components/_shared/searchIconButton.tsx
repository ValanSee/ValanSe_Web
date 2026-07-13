'use client'

import { Icon } from '@iconify/react'

/**
 * 헤더 우측 검색 아이콘. Figma 사양(홈/밸런스/상세/마이) 표시용.
 * 검색 페이지 미구현 상태이므로 클릭 시 아무 동작도 하지 않는다.
 */
export default function SearchIconButton() {
  return (
    <button
      type="button"
      aria-label="검색"
      className="flex h-6 w-6 items-center justify-center text-foreground"
    >
      <Icon icon="iconamoon:search" width={24} aria-hidden />
    </button>
  )
}
