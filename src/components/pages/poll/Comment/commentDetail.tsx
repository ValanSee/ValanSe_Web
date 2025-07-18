'use client'

interface Comment {
  voteId: number
  nickname: string
  createdAt: string
  content: string
  likeCount: number
  replyCount: number
  deletedAt: string | null
  label: string
}

const CommentDetail = ({ comments = [] }: { comments?: Comment[] }) => {
  return (
    <div className="mt-4 rounded-lg bg-gray-50 space-y-6">
      {comments.map((comment, index) => (
        <div
          key={comment.voteId + '-' + index}
          className="border-b pb-4 last:border-none last:pb-0 space-y-2"
        >
          <div className="flex justify-between text-sm font-semibold text-black">
            <span>{comment.nickname}</span>
            <span className="text-xs text-gray-500">
              좋아요 {comment.likeCount}
            </span>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  )
}

export default CommentDetail
