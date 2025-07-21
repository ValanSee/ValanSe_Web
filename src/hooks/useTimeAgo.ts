// hooks/useTimeAgo.ts
import { useEffect, useState } from 'react'

const useTimeAgo = (timestamp: Date | string) => {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp

    const update = () => {
      const now = new Date()
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000) // 초 단위

      let result = ''
      if (diff < 60) {
        result = `${diff}초 전`
      } else if (diff < 3600) {
        result = `${Math.floor(diff / 60)}분 전`
      } else if (diff < 86400) {
        result = `${Math.floor(diff / 3600)}시간 전`
      } else if (diff < 2592000) {
        result = `${Math.floor(diff / 86400)}일 전`
      } else if (diff < 31536000) {
        result = `${Math.floor(diff / 2592000)}달 전`
      } else {
        result = `${Math.floor(diff / 31536000)}년 전`
      }

      setTimeAgo(result)
    }

    update()
    const interval = setInterval(update, 60000) // 1분마다 업데이트

    return () => clearInterval(interval)
  }, [timestamp])

  return timeAgo
}

export default useTimeAgo
