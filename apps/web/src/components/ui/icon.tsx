'use client'

import { Icon as IconifyIcon, type IconProps } from '@iconify/react'
// 아이콘 데이터 사전 등록 — 이 모듈을 쓰는 순간 함께 실행돼 렌더 전에 데이터가 준비된다
import '@/lib/iconify'

/**
 * 앱 공용 아이콘. `@iconify/react` 의 Icon 을 직접 쓰지 말고 이것을 쓴다.
 * - 미리 등록한 아이콘 데이터로 서버 렌더 HTML 에도 SVG 를 바로 그린다 (`ssr`)
 * - 브라우저에서 api.iconify.design 을 호출하지 않아 아이콘이 늦게 뜨거나 밀리지 않는다
 */
export function Icon(props: IconProps) {
  return <IconifyIcon ssr {...props} />
}
