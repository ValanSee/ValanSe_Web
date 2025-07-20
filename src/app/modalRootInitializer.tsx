'use client'

import { useEffect, useState } from 'react'

export function ModalRootInitializer() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!document.getElementById('modal-root')) {
      const div = document.createElement('div')
      div.id = 'modal-root'
      document.body.appendChild(div)
    }
  }, [])

  // 서버 사이드에서는 아무것도 렌더링하지 않음
  if (!isClient) {
    return null
  }

  return null
}
