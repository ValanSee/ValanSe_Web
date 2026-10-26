import { Redis } from '@upstash/redis'
import type { EventParticipant, EventRoom } from './types'

/** 방 보관 기간. 행사 뒤 결과를 다시 볼 수 있게 7일 */
export const ROOM_TTL_SECONDS = 60 * 60 * 24 * 7

/**
 * 방 상태 저장소 인터페이스.
 * - 프로덕션: Upstash Redis (Vercel 연동 KV_REST_API_URL · KV_REST_API_TOKEN, 또는 UPSTASH_REDIS_REST_URL · TOKEN)
 * - 로컬: 환경변수가 없으면 프로세스 메모리 (next dev 한 프로세스 안에서만 공유)
 */
export interface EventStore {
  getRoom(code: string): Promise<EventRoom | null>
  saveRoom(room: EventRoom): Promise<void>
  addParticipant(code: string, p: EventParticipant): Promise<void>
  getParticipants(code: string): Promise<EventParticipant[]>
  setVote(
    code: string,
    questionIndex: number,
    participantId: string,
    label: string,
  ): Promise<void>
  /** participantId → label */
  getVotes(code: string, questionIndex: number): Promise<Record<string, string>>
}

const roomKey = (code: string) => `event:room:${code}`
const participantsKey = (code: string) => `event:room:${code}:participants`
const votesKey = (code: string, q: number) => `event:room:${code}:votes:${q}`

class UpstashStore implements EventStore {
  constructor(private redis: Redis) {}

  async getRoom(code: string) {
    return (await this.redis.get<EventRoom>(roomKey(code))) ?? null
  }

  async saveRoom(room: EventRoom) {
    const ttl = Math.max(60, Math.floor((room.expiresAt - Date.now()) / 1000))
    await this.redis.set(roomKey(room.code), room, { ex: ttl })
  }

  async addParticipant(code: string, p: EventParticipant) {
    await this.redis.hset(participantsKey(code), { [p.id]: p })
    await this.redis.expire(participantsKey(code), ROOM_TTL_SECONDS)
  }

  async getParticipants(code: string) {
    const all = await this.redis.hgetall<Record<string, EventParticipant>>(
      participantsKey(code),
    )
    return all ? Object.values(all) : []
  }

  async setVote(code: string, q: number, pid: string, label: string) {
    await this.redis.hset(votesKey(code, q), { [pid]: label })
    await this.redis.expire(votesKey(code, q), ROOM_TTL_SECONDS)
  }

  async getVotes(code: string, q: number) {
    return (
      (await this.redis.hgetall<Record<string, string>>(votesKey(code, q))) ??
      {}
    )
  }
}

interface MemoryData {
  rooms: Map<string, EventRoom>
  participants: Map<string, Map<string, EventParticipant>>
  votes: Map<string, Map<string, string>>
}

class MemoryStore implements EventStore {
  private data: MemoryData

  constructor() {
    // next dev 의 HMR 로 모듈이 다시 로드돼도 상태가 남도록 globalThis 에 둔다
    const g = globalThis as typeof globalThis & { __eventStore?: MemoryData }
    g.__eventStore ??= {
      rooms: new Map(),
      participants: new Map(),
      votes: new Map(),
    }
    this.data = g.__eventStore
  }

  async getRoom(code: string) {
    const room = this.data.rooms.get(code) ?? null
    if (room && room.expiresAt < Date.now()) {
      this.data.rooms.delete(code)
      return null
    }
    return room
  }

  async saveRoom(room: EventRoom) {
    this.data.rooms.set(room.code, room)
  }

  async addParticipant(code: string, p: EventParticipant) {
    const map = this.data.participants.get(code) ?? new Map()
    map.set(p.id, p)
    this.data.participants.set(code, map)
  }

  async getParticipants(code: string) {
    return [...(this.data.participants.get(code)?.values() ?? [])]
  }

  async setVote(code: string, q: number, pid: string, label: string) {
    const key = votesKey(code, q)
    const map = this.data.votes.get(key) ?? new Map()
    map.set(pid, label)
    this.data.votes.set(key, map)
  }

  async getVotes(code: string, q: number) {
    return Object.fromEntries(this.data.votes.get(votesKey(code, q)) ?? [])
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
