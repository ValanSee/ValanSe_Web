import { Redis } from '@upstash/redis'
import type { EventParticipant, EventRoom } from './types'

/** 방 보관 기간. 행사 뒤 결과를 다시 볼 수 있게 7일 */
export const ROOM_TTL_SECONDS = 60 * 60 * 24 * 7

/** participantId → label, 질문 인덱스별 */
export type VotesByQuestion = Record<number, Record<string, string>>

export interface RoomSnapshot {
  room: EventRoom
  participants: EventParticipant[]
  votes: VotesByQuestion
}

/**
 * 방 상태 저장소 인터페이스.
 * 방 하나를 Redis 해시 **하나**에 담아 폴링 1회가 커맨드 1개(HGETALL)가 되게 한다.
 * 필드: `meta` = EventRoom JSON, `p:{pid}` = 참가자 JSON, `v:{질문}:{pid}` = 선택 label
 * - 프로덕션: Upstash Redis (Vercel 연동 KV_REST_API_URL · KV_REST_API_TOKEN, 또는 UPSTASH_REDIS_REST_URL · TOKEN)
 * - 로컬: 환경변수가 없으면 프로세스 메모리 (next dev 한 프로세스 안에서만 공유)
 */
export interface EventStore {
  /** 방·참가자·표를 한 번에. 없으면 null */
  getSnapshot(code: string): Promise<RoomSnapshot | null>
  saveRoom(room: EventRoom): Promise<void>
  addParticipant(code: string, p: EventParticipant): Promise<void>
  setVote(
    code: string,
    questionIndex: number,
    participantId: string,
    label: string,
  ): Promise<void>
}

const roomKey = (code: string) => `event:room:${code}`
const META = 'meta'
const participantField = (pid: string) => `p:${pid}`
const voteField = (q: number, pid: string) => `v:${q}:${pid}`

/** HGETALL 결과(필드 → 값)를 스냅샷으로 조립. 만료된 방은 null */
function assemble(
  fields: Record<string, unknown> | null,
  now = Date.now(),
): RoomSnapshot | null {
  if (!fields || !fields[META]) return null
  const room = (
    typeof fields[META] === 'string'
      ? JSON.parse(fields[META] as string)
      : fields[META]
  ) as EventRoom
  if (room.expiresAt < now) return null
  const participants: EventParticipant[] = []
  const votes: VotesByQuestion = {}
  for (const [field, value] of Object.entries(fields)) {
    if (field.startsWith('p:')) {
      participants.push(
        (typeof value === 'string' ? JSON.parse(value) : value) as EventParticipant,
      )
    } else if (field.startsWith('v:')) {
      const [, q, ...rest] = field.split(':')
      const pid = rest.join(':')
      const idx = Number(q)
      ;(votes[idx] ??= {})[pid] = String(value)
    }
  }
  participants.sort((a, b) => a.joinedAt - b.joinedAt)
  return { room, participants, votes }
}

class UpstashStore implements EventStore {
  constructor(private redis: Redis) {}

  async getSnapshot(code: string) {
    const fields = await this.redis.hgetall<Record<string, unknown>>(roomKey(code))
    return assemble(fields)
  }

  async saveRoom(room: EventRoom) {
    const key = roomKey(room.code)
    const ttl = Math.max(60, Math.floor((room.expiresAt - Date.now()) / 1000))
    // 해시 하나에 TTL 을 걸어 참가자·표 필드까지 함께 만료
    await this.redis.hset(key, { [META]: room })
    await this.redis.expire(key, ttl)
  }

  async addParticipant(code: string, p: EventParticipant) {
    await this.redis.hset(roomKey(code), { [participantField(p.id)]: p })
  }

  async setVote(code: string, q: number, pid: string, label: string) {
    await this.redis.hset(roomKey(code), { [voteField(q, pid)]: label })
  }
}

class MemoryStore implements EventStore {
  private rooms: Map<string, Record<string, unknown>>

  constructor() {
    // next dev 의 HMR 로 모듈이 다시 로드돼도 상태가 남도록 globalThis 에 둔다
    const g = globalThis as typeof globalThis & {
      __eventRooms?: Map<string, Record<string, unknown>>
    }
    g.__eventRooms ??= new Map()
    this.rooms = g.__eventRooms
  }

  private fields(code: string) {
    const existing = this.rooms.get(code)
    if (existing) return existing
    const fresh: Record<string, unknown> = {}
    this.rooms.set(code, fresh)
    return fresh
  }

  async getSnapshot(code: string) {
    const snapshot = assemble(this.rooms.get(code) ?? null)
    if (!snapshot) this.rooms.delete(code)
    return snapshot
  }

  async saveRoom(room: EventRoom) {
    this.fields(room.code)[META] = { ...room }
  }

  async addParticipant(code: string, p: EventParticipant) {
    this.fields(code)[participantField(p.id)] = { ...p }
  }

  async setVote(code: string, q: number, pid: string, label: string) {
    this.fields(code)[voteField(q, pid)] = label
  }
}

let store: EventStore | null = null

export function getEventStore(): EventStore {
  if (store) return store
  // Vercel 마켓플레이스 Upstash 연동은 KV_ 접두사로 주입하고, Upstash 콘솔 직접 발급은 UPSTASH_ 접두사
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    store = new UpstashStore(new Redis({ url, token }))
  } else {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[event] KV_REST_API_URL/TOKEN(또는 UPSTASH_REDIS_REST_*) 이 없어 메모리 저장소를 씁니다. 서버리스에선 요청마다 상태가 사라집니다.',
      )
    }
    store = new MemoryStore()
  }
  return store
}
