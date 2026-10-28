import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PhoneFrameProps {
  src: string
  alt: string
  className?: string
}

/**
 * 앱 캡처를 iPhone 모양으로 감싸는 목업 (베젤 · 측면 버튼 · 다이나믹 아일랜드 · 상태바 · 홈 인디케이터).
 * 캡처에는 상태바가 없어서 위에 SVG 상태바를 붙인다. SVG 라 프레임 크기에 맞춰 글자도 같이 줄어든다.
 */
export default function PhoneFrame({ src, alt, className }: PhoneFrameProps) {
  return (
    <div className={cn('relative', className)}>
      {/* 측면 버튼: 왼쪽 무음 · 볼륨 2개, 오른쪽 전원 */}
      <span className="absolute -left-0.5 top-[16%] h-[4%] w-1 rounded-l bg-brand-black" />
      <span className="absolute -left-0.5 top-[23%] h-[7%] w-1 rounded-l bg-brand-black" />
      <span className="absolute -left-0.5 top-[32%] h-[7%] w-1 rounded-l bg-brand-black" />
      <span className="absolute -right-0.5 top-[26%] h-[11%] w-1 rounded-r bg-brand-black" />

      <div className="relative rounded-[2.75rem] bg-brand-black p-2 shadow-2xl ring-1 ring-white/10">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-card">
          <div className="absolute left-1/2 top-2 z-10 h-[3.2%] w-[32%] -translate-x-1/2 rounded-full bg-brand-black" />

          <svg
            viewBox="0 0 393 54"
            className="block w-full text-foreground"
            aria-hidden
          >
            <text
              x="52"
              y="36"
              fontSize="17"
              fontWeight="600"
              textAnchor="middle"
              fill="currentColor"
            >
              9:41
            </text>
            {/* 셀룰러 신호 */}
            <g fill="currentColor">
              <rect x="300" y="29" width="3.5" height="5" rx="1" />
              <rect x="305.5" y="26.5" width="3.5" height="7.5" rx="1" />
              <rect x="311" y="24" width="3.5" height="10" rx="1" />
              <rect x="316.5" y="21.5" width="3.5" height="12.5" rx="1" />
            </g>
            {/* 와이파이 */}
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M326 26.5a11 11 0 0 1 15 0" />
              <path d="M329 29.5a6.5 6.5 0 0 1 9 0" />
            </g>
            <circle cx="333.5" cy="33" r="1.8" fill="currentColor" />
            {/* 배터리 */}
            <rect
              x="347"
              y="22"
              width="25"
              height="12.5"
              rx="3.5"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.4"
            />
            <rect
              x="349"
              y="24"
              width="21"
              height="8.5"
              rx="2"
              fill="currentColor"
            />
            <path
              d="M373.5 26.5v3.5a1.9 1.9 0 0 0 0-3.5z"
              fill="currentColor"
              fillOpacity="0.4"
            />
          </svg>

          <Image
            src={src}
            alt={alt}
            width={660}
            height={1434}
            sizes="(min-width: 1024px) 256px, 224px"
            className="block h-auto w-full"
          />

          <div className="absolute bottom-1.5 left-1/2 h-1 w-[36%] -translate-x-1/2 rounded-full bg-brand-black/80" />
        </div>
      </div>
    </div>
  )
}
