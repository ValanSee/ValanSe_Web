'use client'

import Link from 'next/link'
import Image from 'next/image'

const BackToMypage = () => {
  return (
    <Link href="/my">
      <Image
        src="/arrow-left-black.svg"
        alt="뒤로가기"
        width={40}
        height={40}
      />
    </Link>
  )
}

export default BackToMypage
