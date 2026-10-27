import { randomBytes } from 'crypto'
import { getEventStore, ROOM_TTL_SECONDS, type RoomSnapshot } from './store'
import type {
  EventHostAction,
  EventHostState,
  EventPublicState,
  EventQuestion,
  EventRoom,
} from './types'

/** 0·O·1·I 처럼 헷갈리는 글자를 뺀 참가 코드 알파벳 */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 6
const MAX_QUESTIONS = 50
const OPTION_LABELS = ['A', 'B', 'C', 'D']
const NICKNAME_MAX = 12

export class EventError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

function randomCode(): string {
  const bytes = randomBytes(CODE_LENGTH)
  return [...bytes].map((b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase()
}

/** 관리자 입력(JSON)을 검증해 질문 목록으로 정리 */
export function parseQuestions(input: unknown): EventQuestion[] {
  if (!Array.isArray(input) || input.length === 0) {
    throw new EventError(400, '질문이 비어 있습니다')
  }
  if (input.length > MAX_QUESTIONS) {
    throw new EventError(400, `질문은 최대 ${MAX_QUESTIONS}개입니다`)
  }
  return input.map((q, i) => {
    const title = typeof q?.title === 'string' ? q.title.trim() : ''
    if (!title) throw new EventError(400, `${i + 1}번 질문 제목이 없습니다`)
    const rawOptions = Array.isArray(q.options) ? q.options : []
    if (rawOptions.length < 2 || rawOptions.length > OPTION_LABELS.length) {
      throw new EventError(400, `${i + 1}번 질문 선택지는 2~4개여야 합니다`)
    }
    const options = rawOptions.map((o: unknown, j: number) => {
      const content =
        typeof o === 'string'
          ? o.trim()
          : typeof (o as { content?: unknown })?.content === 'string'
            ? (o as { content: string }).content.trim()
            : ''
      if (!content) {
        throw new EventError(400, `${i + 1}번 질문 ${j + 1}번 선택지가 비어 있습니다`)
      }
      return { label: OPTION_LABELS[j], content }
    })
    return { id: String(q.id ?? i + 1), title, options }
  })
}

export async function createRoom(
  name: string,
  questions: EventQuestion[],
): Promise<EventRoom> {
  const store = getEventStore()
  let code = randomCode()
  // 충돌은 사실상 없지만, 있으면 다시 뽑는다
  for (let i = 0; i < 5 && (await store.getSnapshot(code)); i++) code = randomCode()
  const now = Date.now()
  const room: EventRoom = {
    code,
    hostKey: randomBytes(16).toString('hex'),
    name: name.trim() || '밸런스게임',
    questions,
    status: 'lobby',
    currentIndex: 0,
    revealed: false,
    createdAt: now,
    expiresAt: now + ROOM_TTL_SECONDS * 1000,
  }
  await store.saveRoom(room)
  return room
}

/** 방·참가자·표를 한 번에 (Redis 커맨드 1개). 없으면 404 */
export async function requireSnapshot(code: string): Promise<RoomSnapshot> {
  const snapshot = await getEventStore().getSnapshot(normalizeCode(code))
  if (!snapshot) throw new EventError(404, '방을 찾을 수 없습니다')
  return snapshot
}

export async function requireRoom(code: string): Promise<EventRoom> {
  return (await requireSnapshot(code)).room
}

export async function joinRoom(
  code: string,
  participantId: string,
  nickname: string,
) {
  const room = await requireRoom(code)
  if (room.status === 'ended') throw new EventError(410, '끝난 방입니다')
  const nick = nickname.trim().slice(0, NICKNAME_MAX)
  if (!nick) throw new EventError(400, '닉네임을 입력해 주세요')
  if (!participantId) throw new EventError(400, '참가자 식별자가 없습니다')
  await getEventStore().addParticipant(room.code, {
    id: participantId,
    nickname: nick,
    joinedAt: Date.now(),
  })
}

export async function castVote(
  code: string,
  participantId: string,
  questionIndex: number,
  label: string,
) {
  const room = await requireRoom(code)
  if (room.status !== 'live') throw new EventError(409, '지금은 투표할 수 없어요')
  if (questionIndex !== room.currentIndex) {
    throw new EventError(409, '질문이 바뀌었어요. 화면을 새로고침해 주세요')
  }
  if (room.revealed) throw new EventError(409, '결과가 공개돼 더 바꿀 수 없어요')
  const question = room.questions[questionIndex]
  if (!question.options.some((o) => o.label === label)) {
    throw new EventError(400, '없는 선택지입니다')
  }
  if (!participantId) throw new EventError(400, '참가자 식별자가 없습니다')
  await getEventStore().setVote(room.code, questionIndex, participantId, label)
}

function currentVotes({ room, votes }: RoomSnapshot): Record<string, string> {
  return room.status === 'live' ? (votes[room.currentIndex] ?? {}) : {}
}

function tally(
  room: EventRoom,
  votes: Record<string, string>,
): Record<string, number> {
  const question = room.questions[room.currentIndex]
  const counts: Record<string, number> = {}
  for (const o of question?.options ?? []) counts[o.label] = 0
  for (const label of Object.values(votes)) {
    if (label in counts) counts[label] += 1
  }
  return counts
}

function toPublicState(
  snapshot: RoomSnapshot,
  participantId: string | null,
): EventPublicState {
  const { room, participants } = snapshot
  const votes = currentVotes(snapshot)
  const question =
    room.status === 'live' ? room.questions[room.currentIndex] : null
  return {
    code: room.code,
    name: room.name,
    status: room.status,
    currentIndex: room.currentIndex,
    revealed: room.revealed,
    totalQuestions: room.questions.length,
    question: question
      ? { id: question.id, title: question.title, options: question.options }
      : null,
    participantCount: participants.length,
    answeredCount: Object.keys(votes).length,
    counts: room.revealed && question ? tally(room, votes) : null,
    myChoice: participantId ? (votes[participantId] ?? null) : null,
  }
}

export async function getPublicState(
  code: string,
  participantId: string | null,
): Promise<EventPublicState> {
  return toPublicState(await requireSnapshot(code), participantId)
}

export async function getHostState(
  code: string,
  hostKey: string,
): Promise<EventHostState> {
  const snapshot = await requireSnapshot(code)
  const { room, participants } = snapshot
  if (!hostKey || hostKey !== room.hostKey) {
    throw new EventError(403, '사회자 키가 맞지 않습니다')
  }
  return {
    ...toPublicState(snapshot, null),
    counts: tally(room, currentVotes(snapshot)),
    participants,
    questions: room.questions,
  }
}

export async function applyHostAction(
  code: string,
  hostKey: string,
  action: EventHostAction,
): Promise<EventRoom> {
  const room = await requireRoom(code)
  if (!hostKey || hostKey !== room.hostKey) {
    throw new EventError(403, '사회자 키가 맞지 않습니다')
  }
  const last = room.questions.length - 1
  switch (action) {
    case 'start':
      room.status = 'live'
      room.currentIndex = 0
      room.revealed = false
      break
    case 'next':
      if (room.status !== 'live') throw new EventError(409, '먼저 시작해 주세요')
      if (room.currentIndex >= last) {
        room.status = 'ended'
      } else {
        room.currentIndex += 1
        room.revealed = false
      }
      break
    case 'prev':
      if (room.status !== 'live') throw new EventError(409, '먼저 시작해 주세요')
      room.currentIndex = Math.max(0, room.currentIndex - 1)
      room.revealed = false
      break
    case 'reveal':
      if (room.status !== 'live') throw new EventError(409, '먼저 시작해 주세요')
      room.revealed = true
      break
    case 'hide':
      room.revealed = false
      break
    case 'end':
      room.status = 'ended'
      break
    default:
      throw new EventError(400, '알 수 없는 동작입니다')
  }
  await getEventStore().saveRoom(room)
  return room
}
