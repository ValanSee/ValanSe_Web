'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface PointHeaderSectionProps {
  point: number
}

const PointHeaderSection = ({ point }: PointHeaderSectionProps) => {
  const router = useRouter()

  return (
    <section className="flex flex-col gap-4 bg-card px-5 pb-6 pt-4">
      <div className="flex flex-col gap-1">
        <span className="typo-body-c-01 text-brand-gray-100">
          현재 보유 포인트
        </span>
        <div className="flex items-baseline gap-1">
          <span className="typo-heading-01 text-foreground">
            {point.toLocaleString()}
          </span>
          <span className="typo-title-02 text-foreground">P</span>
        </div>
      </div>
      <Button
        variant="primary"
        size="l"
        fullWidth
        onClick={() => router.push('/my/titles')}
      >
        칭호 상점 가기
      </Button>
    </section>
  )
}

export default PointHeaderSection
