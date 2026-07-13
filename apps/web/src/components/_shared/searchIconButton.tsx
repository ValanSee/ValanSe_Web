'use client'

import { IconButton } from '@/components/ui/iconButton'

/**
 * 헤더 우측 검색 아이콘. Figma 사양(홈/밸런스/상세/마이) 표시용.
 * 검색 페이지 미구현 상태이므로 클릭 시 아무 동작도 하지 않는다.
 */
export default function SearchIconButton() {
  return <IconButton icon="iconamoon:search" label="검색" />
}
