import { Flame } from 'lucide-react'

export default function Header() {
  return (
    <div className="px-4 pt-6 pb-2">
      <h1 className="text-xl font-bold">밸런스 게임</h1>
      <div className="flex items-center gap-1 mt-2">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-md font-semibold">인기 급상승 토픽</span>
      </div>
    </div>
  )
}
