'use client'

const mockComments: CommentDetailProps[] = [
  {
    username: 'dinopark47',
    content:
      '솔직히 요즘 점심에 돈 쓰기 아까움 회사 돈으로 점심먹으면 개꿀이지',
    commentsNumber: 123,
  },
  {
    username: 'foodlover22',
    content: '근처에 맛집이 많아서 너무 좋음. 회사 복지 최고!',
    commentsNumber: 45,
  },
  {
    username: 'nooncho12',
    content: '점심시간에 줄 서는 거 너무 싫은데 사내식당 생겼으면 좋겠다',
    commentsNumber: 78,
  },
]

interface CommentDetailProps {
  username: string
  content: string
  commentsNumber: number
}

const CommentDetail = () => {
  return (
    <div className="mt-4 rounded-lg bg-gray-50 p-4 space-y-6">
      todo:index 대신 id 사용
      {mockComments.map(({ username, content, commentsNumber }, index) => (
        <div
          key={index}
          className="border-b pb-4 last:border-none last:pb-0 space-y-2"
        >
          <div className="flex justify-between text-sm font-semibold text-black">
            <span>{username}</span>
            <span className="text-xs text-gray-500">댓글 {commentsNumber}</span>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {content}
          </p>
        </div>
      ))}
    </div>
  )
}

export default CommentDetail
