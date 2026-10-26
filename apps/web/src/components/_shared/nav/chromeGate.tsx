'use client'

import { usePathname } from 'next/navigation'

/** 프로젝터 화면처럼 GNB·푸터 없이 꽉 채워야 하는 경로 */
const FULLSCREEN_PATTERNS = [/^\/event\/[^/]+\/screen$/]

export function isFullscreenPath(pathname: string) {
  return FULLSCREEN_PATTERNS.some((re) => re.test(pathname))
}

/** 전체 화면 경로에서는 감싼 요소(GNB·푸터)를 렌더하지 않는다 */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (isFullscreenPath(pathname)) return null
  return children
}
