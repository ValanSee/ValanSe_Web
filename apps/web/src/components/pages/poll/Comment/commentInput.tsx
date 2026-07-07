'use client'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { createComment } from '@/api/comment/commentApi'
import { getAccessToken } from '@/utils/tokenUtils'
import { entryHrefWithRedirect } from '@/utils/authRedirect'
import { cn } from '@/lib/utils'

interface CommentInputProps {
  voteId: number | string
  parentId?: number | null
  onCommentCreated?: () => void
  placeholder?: string
  postLoginReturnPath?: string
}

export default function CommentInput({
  voteId,
  parentId,
  onCommentCreated,
  placeholder = '댓글을 남겨보세요',
  postLoginReturnPath,
}: CommentInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = content.trim() && !isSubmitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    if (!getAccessToken()) {
      router.replace(entryHrefWithRedirect(postLoginReturnPath ?? pathname))
      return
    }
    try {
      setIsSubmitting(true)
      await createComment(voteId, content.trim(), parentId)
      setContent('')
      onCommentCreated?.()
    } catch (e) {
      console.error('댓글 작성 실패:', e)
      alert('댓글 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-brand-gray-75 bg-card px-4 py-3">
      <div className="mx-auto flex max-w-xl items-center gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          disabled={isSubmitting}
          className="typo-label-02 flex-1 rounded-xl bg-brand-gray-50 px-4 py-3 text-foreground outline-none placeholder:text-brand-gray-100 focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-label="댓글 전송"
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
            canSubmit
              ? 'bg-primary text-primary-foreground hover:bg-brand-violet-400'
              : 'bg-brand-gray-50 text-brand-gray-75 cursor-not-allowed',
          )}
        >
          <Icon icon="wpf:sent" width={20} aria-hidden />
        </button>
      </div>
    </div>
  )
}
