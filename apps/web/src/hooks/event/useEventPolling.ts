'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { EventApiError } from '@/api/event/eventRoomApi'

export const EVENT_POLL_INTERVAL_MS = 2000

/**
 * 행사 방 상태 폴링. 2초마다 fetcher 를 부르고, 탭이 숨겨지면 멈춘다.
 * 웹소켓이 없는 레포라 폴링으로 충분한 규모(수십 명)만 가정.
 */
export function useEventPolling<T>(
  fetcher: (() => Promise<T>) | null,
  intervalMs = EVENT_POLL_INTERVAL_MS,
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<EventApiError | null>(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refresh = useCallback(async () => {
    const fn = fetcherRef.current
    if (!fn) return
    try {
      setData(await fn())
      setError(null)
    } catch (e) {
      setError(
        e instanceof EventApiError ? e : new EventApiError(0, '연결이 끊겼어요'),
      )
    }
  }, [])

  // fetcher 의 내용 변경은 ref 로 반영하고, 폴링 시작·중지는 null 여부로만 결정
  const active = fetcher !== null
  useEffect(() => {
    if (!active) return
    let timer: ReturnType<typeof setInterval> | null = null
    const start = () => {
      if (timer) return
      void refresh()
      timer = setInterval(() => void refresh(), intervalMs)
    }
    const stop = () => {
      if (timer) clearInterval(timer)
      timer = null
    }
    const onVisibility = () =>
      document.visibilityState === 'visible' ? start() : stop()
    start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [active, intervalMs, refresh])

  return { data, error, refresh, setData }
}
