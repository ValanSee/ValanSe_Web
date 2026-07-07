'use client'

import { Icon } from '@iconify/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * 404 페이지. Figma 오류 페이지(6397:27123) 사양 재활용.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-card px-6 py-10 text-center">
      <div className="flex flex-col items-center gap-4">
        <Icon
          icon="material-symbols:error-outline-rounded"
          className="text-brand-gray-100"
          width={80}
          aria-hidden
        />
        <div className="flex flex-col gap-2">
          <h1 className="typo-heading-04 text-foreground">
            페이지를 찾을 수 없어요
          </h1>
          <p className="typo-body-b-01 text-brand-gray-100">
            주소를 다시 확인해주세요
          </p>
        </div>
      </div>
      <Link href="/main" className="w-full">
        <Button variant="primary" size="l" fullWidth>
          홈으로 이동
        </Button>
      </Link>
    </div>
  )
}
