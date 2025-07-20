'use client'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <h1 className="text-xl font-bold text-black">{title}</h1>
    </div>
  )
}
