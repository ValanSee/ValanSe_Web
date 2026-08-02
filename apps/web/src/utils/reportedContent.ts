import type { ReportType } from '@/api/report'

/**
 * 내가 신고한 대상을 기억해 두기 위한 로컬 저장소.
 *
 * 서버에 "내가 이 대상을 신고했는지" 알려주는 필드·API 가 없어서,
 * 관리자 처리 전까지 신고자에게만 가려 보여주는 용도로 브라우저에 저장한다.
 * 서버가 reportedByMe 같은 값을 내려주면 이 모듈만 걷어내면 된다.
 *
 * 한계: 기기·브라우저 단위라 다른 기기에서는 다시 보이고, 저장소를 비우면 풀린다.
 */
const STORAGE_KEY = 'valanse:reported-content'

export interface ReportedSnapshot {
  VOTE: ReadonlySet<number>
  COMMENT: ReadonlySet<number>
}

const EMPTY_SNAPSHOT: ReportedSnapshot = {
  VOTE: new Set<number>(),
  COMMENT: new Set<number>(),
}

// useSyncExternalStore 는 변경 전까지 동일한 참조를 돌려받아야 하므로 캐싱한다
let cache: ReportedSnapshot | null = null
const listeners = new Set<() => void>()

const parse = (raw: string | null): ReportedSnapshot => {
  if (!raw) return EMPTY_SNAPSHOT
  try {
    const parsed = JSON.parse(raw) as Partial<Record<ReportType, number[]>>
    return {
      VOTE: new Set(parsed.VOTE ?? []),
      COMMENT: new Set(parsed.COMMENT ?? []),
    }
  } catch {
    // 저장 형식이 깨졌으면 비어 있는 것으로 취급한다
    return EMPTY_SNAPSHOT
  }
}

export const getReportedSnapshot = (): ReportedSnapshot => {
  if (typeof window === 'undefined') return EMPTY_SNAPSHOT
  if (!cache) cache = parse(window.localStorage.getItem(STORAGE_KEY))
  return cache
}

// SSR 결과와 첫 렌더를 맞춰 hydration 불일치를 막는다
export const getReportedServerSnapshot = (): ReportedSnapshot => EMPTY_SNAPSHOT

export const subscribeReported = (listener: () => void) => {
  listeners.add(listener)

  // 다른 탭에서 신고한 경우에도 반영
  const handleStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return
    cache = null
    listeners.forEach((l) => l())
  }
  window.addEventListener('storage', handleStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', handleStorage)
  }
}

export const markReported = (type: ReportType, id: number) => {
  if (typeof window === 'undefined') return

  const current = getReportedSnapshot()
  if (current[type].has(id)) return

  const next: ReportedSnapshot = {
    VOTE: type === 'VOTE' ? new Set(current.VOTE).add(id) : current.VOTE,
    COMMENT:
      type === 'COMMENT' ? new Set(current.COMMENT).add(id) : current.COMMENT,
  }
  cache = next

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ VOTE: [...next.VOTE], COMMENT: [...next.COMMENT] }),
    )
  } catch (e) {
    // 저장 실패(용량 초과·프라이빗 모드)해도 현재 화면의 블라인드는 유지한다
    console.error('신고 기록 저장 실패:', e)
  }

  listeners.forEach((l) => l())
}
