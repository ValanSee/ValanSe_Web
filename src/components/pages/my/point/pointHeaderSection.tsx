'use client'

import { useRouter } from 'next/navigation'

interface PointHeaderSectionProps {
  point: number
}

const PointHeaderSection = ({ point }: PointHeaderSectionProps) => {
  const router = useRouter()

  return (
    <section className="px-4 pt-6 pb-5">
      <div className="text-sm text-[#8E8E8E]">현재 보유 포인트</div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-[32px] font-bold text-[#1D1D1D]">
          {point.toLocaleString()}
        </span>
        <span className="text-[20px] font-semibold text-[#1D1D1D]">P</span>
      </div>
      <button
        type="button"
        onClick={() => router.push('/my/titles')}
        className="mt-4 w-full h-12 rounded-lg bg-[#4D7298] text-white text-[15px] font-semibold transition-colors hover:bg-[#3f5f7e]"
      >
        칭호 상점 가기
      </button>
    </section>
  )
}

export default PointHeaderSection
