'use client'

import { useRouter } from 'next/navigation'

interface HeaderProps {
  title: string
  showBackButton?: boolean
  bgGray?: boolean
}

export default function Header({ title, showBackButton, bgGray }: HeaderProps) {
  const router = useRouter()
  return (
    <div
      className={`border-b border-gray-200 px-4 py-3 flex items-center ${bgGray ? 'bg-background' : 'bg-white'}`}
    >
      {showBackButton && (
        <button
          className="mr-2 p-2"
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M15 19l-7-7 7-7"
              stroke="#222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <h1 className="text-xl font-bold text-black">{title}</h1>
    </div>
  )
}
