'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { createComment } from '@/api/comment/commentApi'

interface CommentInputProps {
  voteId: number | string
  parentId?: number | null
  onCommentCreated?: () => void
  placeholder?: string
}

export default function CommentInput({
  voteId,
  parentId,
  onCommentCreated,
  placeholder = '답글을 남겨보세요',
}: CommentInputProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      await createComment(voteId, content.trim(), parentId)
      setContent('')
      onCommentCreated?.()
    } catch (error) {
      console.error('댓글 작성 실패:', error)
      alert('댓글 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={`relative bg-white border-t border-gray-200 p-4`}>
      <div className="max-w-xl mx-auto flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className={`p-2 rounded-full ${
            content.trim() && !isSubmitting
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          } transition-colors`}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
