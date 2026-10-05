import axios from 'axios'
import { api } from './api'

export type ContentSeedRunResult = 'started' | 'already-running'

/**
 * AI 콘텐츠 시드를 즉시 비동기로 실행한다.
 * 자동 스케줄(매주 월 04:00)과 같은 락을 써서 이미 실행 중이면 서버가 409 를 준다.
 */
export async function runContentSeed(): Promise<ContentSeedRunResult> {
  try {
    await api.post('/admin/content-seed/run')
    return 'started'
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      return 'already-running'
    }
    throw err
  }
}
