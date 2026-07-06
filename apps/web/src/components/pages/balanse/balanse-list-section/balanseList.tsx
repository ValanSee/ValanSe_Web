import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { UserCircle, ThumbsUp, MessageCircle } from 'lucide-react'
import { Vote } from '@/types/balanse/vote'
import Link from 'next/link'

const categoryMap: Record<string, string> = {
  FOOD: '음식',
  LOVE: '연애',
  ETC: '기타',
  ALL: '전체',
}

type Props = {
  data: Vote
}

export default function BalanceList({ data }: Props) {
  return (
    <Link href={`/poll/${data.id}?source=balance`} passHref legacyBehavior>
      <a className="block">
        <Card className="cursor-pointer rounded-xl">
          <CardHeader className="flex flex-row items-center gap-2 pb-0">
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-brand-gray-100" />
              {data.member_title && (
                // TODO(design): 칭호 배경 #4D7298은 blue-gray 팔레트 미확정으로 TODO 유지
                <span className="typo-body-c-03 inline-flex items-center rounded-full bg-[#4D7298] px-2 py-0.5 text-primary-foreground">
                  {data.member_title}
                </span>
              )}
              <span className="typo-body-c-02 text-brand-gray-100">
                {data.nickname} • {data.created_at}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pb-4 pt-2">
            <p className="typo-title-02 mb-2 text-foreground">{data.title}</p>
            {data.content && (
              <p className="typo-body-c-02 mb-3 whitespace-pre-wrap leading-relaxed text-brand-gray-100">
                {data.content}
              </p>
            )}
            <div className="typo-body-c-02 space-y-1 text-brand-gray-200">
              {data.options.map((opt) => (
                <div key={opt.id} className="bg-card">
                  {opt.content}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between typo-body-c-03 text-brand-gray-100">
              <span>{categoryMap[data.category] ?? data.category}</span>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {data.total_vote_count}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {data.total_comment_count}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  )
}
