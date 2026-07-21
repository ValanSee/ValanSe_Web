'use client'

import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

/**
 * Global Error Boundary. Figma 노드 6397:27123 참조.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  const goHome = () => {
    reset()
    router.push('/main')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-card px-6 py-10 text-center">
      <div className="flex flex-col items-center gap-4">
        <Icon
          icon="material-symbols:error-outline-rounded"
          className="text-destructive"
          width={80}
          aria-hidden
        />
        <div className="flex flex-col gap-2">
          <h1 className="typo-heading-04 text-foreground">
            서버 오류가 발생했습니다
          </h1>
          <p className="typo-body-b-01 text-brand-gray-100">
            잠시 후 다시 시도해주세요
          </p>
        </div>
      </div>
      <Button variant="primary" size="l" fullWidth onClick={goHome}>
        홈으로 이동
      </Button>
    </div>
  )
}
