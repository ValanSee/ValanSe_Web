import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { UserCircle, Share2, MessageCircle } from 'lucide-react'
import { Vote } from '@/types/balanse/vote'

export default function BalanceList({ data }: { data: Vote }) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center gap-2 pb-0">
        <UserCircle className="text-gray-400 w-5 h-5" />
        <span className="text-sm text-gray-600">
          {data.nickname} • {data.created_at}
        </span>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <p className="font-semibold mb-2">{data.title}</p>
        <div className="text-sm text-gray-700 space-y-1">
          {data.options.map((opt) => (
            <div key={opt.id}>{opt.content}</div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>전체 · {data.category}</span>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <Share2 className="w-4 h-4" />
              {data.total_vote_count}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {data.total_comment_count}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
