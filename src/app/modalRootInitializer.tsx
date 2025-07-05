'use client'

import { useEffect } from 'react'

export function ModalRootInitializer() {
  useEffect(() => {
    if (!document.getElementById('modal-root')) {
      const div = document.createElement('div')
      div.id = 'modal-root'
      document.body.appendChild(div)
    }
  }, [])

  return null
}
