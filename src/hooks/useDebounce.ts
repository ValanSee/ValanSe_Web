import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // delay 이후에 debouncedValue 갱신
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // value가 바뀌면 기존 타이머 제거
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
