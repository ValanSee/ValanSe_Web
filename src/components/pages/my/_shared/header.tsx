'use client'

import BackToMypage from './backToMypage'

interface HeaderProps {
  title: string
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="flex items-center px-4 pt-6 gap-2">
      <BackToMypage />
      <div className="text-[20px] font-[700] leading-none">{title}</div>
    </div>
  )
}

export default Header
