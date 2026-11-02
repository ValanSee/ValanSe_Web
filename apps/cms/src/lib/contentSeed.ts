import axios from 'axios'
import { api } from './api'

export type ContentSeedRunResult = 'started' | 'already-running'

/**
 * 자동 스케줄(매주 월 04:00)·전체 실행·댓글 전용 실행이 같은 락을 써서
 * 이미 실행 중이면 서버가 409 를 준다.
 */
async function postSeed(path: string): Promise<ContentSeedRunResult> {
  try {
    await api.post(path)
    return 'started'
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      return 'already-running'
    }
    throw err
  }
}

/** AI 콘텐츠 시드(투표 생성 + 투표·댓글)를 즉시 비동기로 실행한다. */
export function runContentSeed(): Promise<ContentSeedRunResult> {
  return postSeed('/admin/content-seed/run')
}

/** 새 투표는 만들지 않고, 기존 투표에 AI 투표·댓글만 즉시 비동기로 생성한다. */
export function runCommentSeed(): Promise<ContentSeedRunResult> {
  return postSeed('/admin/content-seed/comments/run')
}
