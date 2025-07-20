import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { UserCircle } from 'lucide-react'
import { MyVoteHistoryItem } from '@/types/my/history'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import Image from 'next/image'
import { numberToAlphabet } from '@/utils/map'

export default function BalanceHistoryCard({
  data,
}: {
  data: MyVoteHistoryItem
}) {
  const nickname = useAppSelector((state) => state.member.profile?.nickname)

  return (
    <Card className="rounded-xl cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-2 pb-0">
        <UserCircle className="text-gray-400 w-5 h-5" />
        <span className="text-sm text-gray-600">
          {nickname} • {data.createdAt}
        </span>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <p className="font-semibold mb-2">{data.title}</p>
        <div className="text-sm text-gray-700 space-y-1">
          {data.options.map((opt, index) => (
            <div key={index} className="text-[16px] font-[400] text-[#555555]">
              {numberToAlphabet(index)} {opt}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>전체 · {data.category}</span>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <Image
                src="/vote-count.svg"
                alt="vote-count"
                width={18}
                height={18}
              />
              {data.totalVoteCount}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
