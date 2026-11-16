'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/_shared/header'
import { Button } from '@/components/ui/button'
import { Popup } from '@/components/ui/popup'
import {
  type BlockedMember,
  fetchBlockedMembers,
  unblockMember,
} from '@/api/member/block'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_COLUMN } from '@/constants/layout'

/** 마이 > 차단한 사용자. 차단 해제하면 그 사용자의 글이 다시 목록에 보인다 */
const BlocksPage = () => {
  const [blocks, setBlocks] = useState<BlockedMember[] | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setBlocks(await fetchBlockedMembers())
      } catch (e) {
        console.error('차단 목록 조회 실패', e)
        setBlocks([])
        setError('차단 목록을 불러오지 못했어요')
      }
    })()
  }, [])

  const handleUnblock = async (memberId: number) => {
    if (pendingId) return
    try {
      setPendingId(memberId)
      await unblockMember(memberId)
      setBlocks((prev) => prev?.filter((b) => b.memberId !== memberId) ?? [])
    } catch (e) {
      console.error('차단 해제 실패', e)
      setError('차단 해제에 실패했어요')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div
      className={cn('flex min-h-screen flex-col bg-card', DESKTOP_PAGE_COLUMN)}
    >
      <Header title="차단한 사용자" showBackButton />

      <p className="typo-body-c-02 px-5 pb-2 pt-4 text-brand-gray-200">
        차단한 사용자의 밸런스 게임과 댓글은 보이지 않아요
      </p>

      {blocks === null ? null : blocks.length === 0 ? (
        <p className="typo-body-b-01 px-5 py-16 text-center text-brand-gray-100">
          차단한 사용자가 없어요
        </p>
      ) : (
        <ul className="flex flex-col px-5">
          {blocks.map((b) => (
            <li
              key={b.memberId}
              className="flex items-center justify-between border-b border-brand-gray-75 py-4"
            >
              <span className="typo-label-01 text-foreground">
                {b.nickname ?? '알 수 없는 사용자'}
              </span>
              <Button
                size="s"
                variant="secondary"
                disabled={pendingId === b.memberId}
                onClick={() => handleUnblock(b.memberId)}
              >
                차단 해제
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Popup
        open={!!error}
        onClose={() => setError(null)}
        variant="error"
        title={error ?? ''}
        description="잠시 후 다시 시도해 주세요"
      />
    </div>
  )
}

export default BlocksPage
