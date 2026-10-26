/**
 * 행사용 비공개 투표 방 도메인 타입.
 * 방 상태는 서버 저장소(Upstash Redis, 로컬은 메모리)에만 있고 백엔드(Spring)와는 무관하다.
 */

export interface EventOption {
  /** 'A' | 'B' | 'C' | 'D' */
  label: string
  content: string
}

export interface EventQuestion {
  /** 출처 식별용 (ValanSe 투표 id 등). 없으면 인덱스 문자열 */
  id: string
  title: string
  options: EventOption[]
}

export type EventRoomStatus = 'lobby' | 'live' | 'ended'

export interface EventRoom {
  /** 참가 코드 (대문자 6자리, 혼동 글자 제외) */
  code: string
  /** 사회자 화면 조작 키. 참가자에겐 절대 내려주지 않는다 */
  hostKey: string
  name: string
  questions: EventQuestion[]
  status: EventRoomStatus
  /** 현재 질문 인덱스 (status 가 live 일 때 의미) */
  currentIndex: number
  /** 현재 질문의 집계를 참가자·프로젝터에 보여주는지 */
  revealed: boolean
  createdAt: number
  expiresAt: number
}

export interface EventParticipant {
  id: string
  nickname: string
  joinedAt: number
}

/** 참가자·프로젝터가 받는 상태. 집계는 revealed 일 때만 포함 */
export interface EventPublicState {
  code: string
  name: string
  status: EventRoomStatus
  currentIndex: number
  revealed: boolean
  totalQuestions: number
  question: Pick<EventQuestion, 'id' | 'title' | 'options'> | null
  participantCount: number
  /** 현재 질문 응답 수 (revealed 여부와 무관, 진행 상황 표시용) */
  answeredCount: number
  /** label → 표 수. revealed 이거나 사회자 요청일 때만 */
  counts: Record<string, number> | null
  /** 요청한 참가자의 현재 질문 선택 */
  myChoice: string | null
}

/** 사회자가 받는 상태. 집계는 항상 포함, 참가자 목록 추가 */
export interface EventHostState extends EventPublicState {
  counts: Record<string, number>
  participants: EventParticipant[]
  questions: EventQuestion[]
}

export type EventHostAction =
  | 'start'
  | 'next'
  | 'prev'
  | 'reveal'
  | 'hide'
  | 'end'
