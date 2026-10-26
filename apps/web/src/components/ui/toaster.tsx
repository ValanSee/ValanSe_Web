'use client'

import { Toaster as SonnerToaster } from 'sonner'

export { toast } from 'sonner'

/** 전역 토스트 컨테이너. 루트 Providers 에 한 번만 둔다 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      duration={2000}
      // safe-area(노치) 아래로 내려 헤더와 겹쳐도 가려지지 않게
      offset={{ top: 'calc(env(safe-area-inset-top) + 16px)' }}
      mobileOffset={{ top: 'calc(env(safe-area-inset-top) + 16px)' }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'typo-label-02 flex w-full items-center justify-center gap-ds-2 rounded-xl bg-brand-black/90 px-ds-4 py-ds-3 text-white shadow-lg',
          error: 'bg-destructive',
        },
      }}
    />
  )
}
