'use client'

import Link from 'next/link'

export default function MyActivitySection() {
  return (
    <section className="bg-white px-4 py-4 text-md">
      <h2 className="text-[#555555] h-10">내 활동</h2>
      <div className="flex flex-col gap-3">
        <Link href="/my/created" className="h-10 font-bold">
          내가 만든 밸런스 게임
        </Link>
        <Link href="/my/voted" className="h-10 font-bold">
          내가 투표한 밸런스 게임
        </Link>
        <Link href="/my/comment" className="h-10 font-bold">
          내가 작성한 댓글
        </Link>
      </div>
    </section>
  )
}
