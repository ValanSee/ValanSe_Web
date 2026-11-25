'use client'

import { useState } from 'react'
import { getSlideDirection, slideInClass } from '@/lib/slideTransition'

/**
 * 화면 안 탭(카테고리 · 기록 · 칭호 등)의 선택 인덱스가 바뀌면 탭 순서 방향 슬라이드 클래스를 돌려준다.
 * 첫 렌더는 '' (애니메이션 없음). 바뀐 뒤엔 다음 변경까지 같은 클래스를 유지해
 * 다른 이유로 다시 렌더돼도 재생 중인 애니메이션이 끊기지 않는다.
 * 내용 래퍼에 `key={선택 탭}` 을 함께 줘야 바뀔 때마다 다시 재생된다.
 */
export function useSlideDirection(index: number): string {
  const [state, setState] = useState({ index, className: '' })

  // 렌더 중 이전 값과 비교해 갱신 (StrictMode 이중 렌더에도 안전한 React 권장 패턴)
  if (state.index !== index) {
    const next = {
      index,
      className: slideInClass(getSlideDirection(state.index, index)),
    }
    setState(next)
    return next.className
  }
  return state.className
}
