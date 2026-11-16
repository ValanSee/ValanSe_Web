import { authApi } from '../instance/authApi'

export interface BlockedMember {
  memberId: number
  nickname: string | null
  blockedAt: string
}

/** 사용자 차단. 차단한 사용자의 투표·댓글은 목록에서 빠진다 (중복 호출 안전) */
export const blockMember = async (memberId: number) => {
  await authApi.post(`/member/blocks/${memberId}`)
}

/** 차단 해제 (중복 호출 안전) */
export const unblockMember = async (memberId: number) => {
  await authApi.delete(`/member/blocks/${memberId}`)
}

/** 내가 차단한 사용자 목록 (최근 차단 순) */
export const fetchBlockedMembers = async (): Promise<BlockedMember[]> => {
  const res = await authApi.get<{ blocks: BlockedMember[] }>('/member/blocks')
  return res.data.blocks ?? []
}
