'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import VoteOptionPill from '@/components/_shared/voteOptionPill'
import EventResultBars from './eventResultBars'
import { pollIntervalFor, useEventPolling } from '@/hooks/event/useEventPolling'
import {
  castEventVote,
  fetchPublicState,
  joinEventRoom,
  EventApiError,
} from '@/api/event/eventRoomApi'
import { getOrCreateAnonymousId } from '@/utils/anonymousId'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_COLUMN } from '@/constants/layout'

const NICKNAME_KEY = 'valanse_event_nickname'
const NICKNAME_MAX = 12

interface Props {
  code: string
}

/**
 * 행사 참가자 화면 (/event/[code]). 로그인 없이 닉네임만 입력하고,
 * 사회자가 넘기는 현재 질문을 2초 폴링으로 따라간다.
 */
export default function ParticipantPage({ code }: Props) {
  const [pid, setPid] = useState<string | null>(null)
  const [nickname, setNickname] = useState('')
  const [joined, setJoined] = useState(false)
  const [joining, setJoining] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [voteError, setVoteError] = useState<string | null>(null)

  useEffect(() => {
    setPid(getOrCreateAnonymousId())
    try {
      const saved = window.localStorage.getItem(NICKNAME_KEY)
      if (saved) setNickname(saved)
    } catch {
      /* 저장소 접근 불가 — 입력만 받는다 */
    }
  }, [])

  const fetcher = useMemo(
    () => (joined && pid ? () => fetchPublicState(code, pid) : null),
    [joined, pid, code],
  )
  // 간격은 직전 상태로 정한다: 고르는 중엔 2초, 대기·공개·종료는 4초
  const [interval, setInterval_] = useState(pollIntervalFor(null))
  const { data: state, error, refresh, setData } = useEventPolling(fetcher, interval)
  useEffect(() => setInterval_(pollIntervalFor(state)), [state])

  const join = useCallback(async () => {
    if (!pid) return
    const nick = nickname.trim()
    if (!nick) {
      setFormError('닉네임을 입력해 주세요')
      return
    }
    setJoining(true)
    setFormError(null)
    try {
      await joinEventRoom(code, pid, nick)
      try {
        window.localStorage.setItem(NICKNAME_KEY, nick)
      } catch {
        /* 무시 */
      }
      setJoined(true)
    } catch (e) {
      setFormError(e instanceof EventApiError ? e.message : '참여에 실패했어요')
    } finally {
      setJoining(false)
    }
  }, [code, nickname, pid])

  const choose = useCallback(
    async (label: string) => {
      if (!pid || !state?.question || state.revealed) return
      const prev = state.myChoice
      setData({ ...state, myChoice: label })
      setVoteError(null)
      try {
        await castEventVote(code, pid, state.currentIndex, label)
        void refresh()
      } catch (e) {
        setData({ ...state, myChoice: prev })
        setVoteError(e instanceof EventApiError ? e.message : '다시 눌러 주세요')
        void refresh()
      }
    },
    [code, pid, refresh, setData, state],
  )

  const shell = (children: React.ReactNode) => (
    <div
      className={cn(
        'flex min-h-screen flex-col bg-background px-4 pb-10 pt-6 lg:pt-ds-8',
        DESKTOP_PAGE_COLUMN,
      )}
    >
      {children}
    </div>
  )

  // 1. 닉네임 입력
  if (!joined) {
    return shell(
      <section className="flex flex-col gap-4 rounded-2xl bg-card p-5">
        <p className="typo-label-03 text-primary">참가 코드 {code}</p>
        <h1 className="typo-heading-04 text-foreground">
          밸런스게임에 참여해요
        </h1>
        <p className="typo-body-b-01 text-brand-gray-200">
          로그인 없이 닉네임만 적으면 돼요. 결과 화면에 이름이 보이진 않아요.
        </p>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            void join()
          }}
        >
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, NICKNAME_MAX))}
            placeholder="닉네임 (12자까지)"
            autoComplete="nickname"
            className="typo-body-a-01 h-12 rounded-xl border border-border bg-background px-4 text-foreground outline-none focus:border-primary"
            aria-label="닉네임"
          />
          {formError && (
            <p className="typo-body-c-02 text-brand-red-200" role="alert">
              {formError}
            </p>
          )}
          <Button type="submit" size="xl" fullWidth loading={joining} disabled={!pid}>
            입장하기
          </Button>
        </form>
      </section>,
    )
  }

  // 2. 입장 후 (폴링)
  if (!state) {
    return shell(
      <p className="typo-body-b-01 py-10 text-center text-brand-gray-100">
        {error ? error.message : '방에 연결하는 중…'}
      </p>,
    )
  }

  const header = (
    <div className="flex items-center justify-between">
      <p className="typo-label-03 text-brand-gray-100">{state.name}</p>
      {state.status === 'live' && (
        <p className="typo-label-03 text-brand-gray-100">
          {state.currentIndex + 1} / {state.totalQuestions}
        </p>
      )}
    </div>
  )

  if (state.status === 'lobby') {
    return shell(
      <section className="flex flex-col gap-3 rounded-2xl bg-card p-5">
        {header}
        <h1 className="typo-heading-04 text-foreground">
          {nickname}님, 곧 시작해요
        </h1>
        <p className="typo-body-b-01 text-brand-gray-200">
          사회자가 시작하면 이 화면에 첫 질문이 떠요. 화면을 켜 둔 채 기다려 주세요.
        </p>
        <p className="typo-label-03 text-primary">
          지금 {state.participantCount}명 입장
        </p>
      </section>,
    )
  }

  if (state.status === 'ended' || !state.question) {
    return shell(
      <section className="flex flex-col gap-3 rounded-2xl bg-card p-5">
        {header}
        <h1 className="typo-heading-04 text-foreground">오늘 게임 끝!</h1>
        <p className="typo-body-b-01 text-brand-gray-200">
          함께해 줘서 고마워요. 더 많은 질문은 valanse.kr 에서 골라 보세요.
        </p>
        <Button asChild variant="secondary" size="l" fullWidth>
          <a href="/topics">밸런스게임 주제 더 보기</a>
        </Button>
      </section>,
    )
  }

  const { question } = state
  return shell(
    <section className="flex flex-col gap-4 rounded-2xl bg-card p-5">
      {header}
      <h1 className="typo-heading-04 text-foreground">{question.title}</h1>

      {state.revealed && state.counts ? (
        <>
          <p className="typo-label-03 text-brand-gray-100">
            우리 {state.answeredCount}명의 선택
          </p>
          <EventResultBars options={question.options} counts={state.counts} />
          {state.myChoice && (
            <p className="typo-body-c-02 text-brand-gray-100">
              나는 {state.myChoice}를 골랐어요
            </p>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {question.options.map((o, i) => (
              <VoteOptionPill
                key={o.label}
                index={i}
                content={o.content}
                isSelected={state.myChoice === o.label}
                onClick={() => void choose(o.label)}
              />
            ))}
          </div>
          <p className="typo-body-c-02 text-brand-gray-100" aria-live="polite">
            {voteError ??
              (state.myChoice
                ? '선택 완료! 공개 전까지는 바꿀 수 있어요.'
                : '하나를 골라 주세요.')}
          </p>
        </>
      )}
    </section>,
  )
}
