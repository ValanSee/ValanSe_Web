'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import EventResultBars from './eventResultBars'
import { useEventPolling } from '@/hooks/event/useEventPolling'
import {
  fetchHostState,
  sendHostAction,
  EventApiError,
} from '@/api/event/eventRoomApi'
import type { EventHostAction } from '@/lib/event/types'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_COLUMN } from '@/constants/layout'

const KEY_STORAGE_PREFIX = 'valanse_event_hostkey:'

interface Props {
  code: string
}

/**
 * 사회자 화면 (/event/[code]/host?key=...). 키는 URL 로 한 번 받아 sessionStorage 에 두고,
 * 현재 질문·응답 수·집계를 보며 시작/공개/다음을 조작한다.
 */
export default function HostPage({ code }: Props) {
  const searchParams = useSearchParams()
  const [hostKey, setHostKey] = useState<string | null>(null)
  const [keyInput, setKeyInput] = useState('')
  const [busy, setBusy] = useState<EventHostAction | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    const fromUrl = searchParams.get('key')
    const storageKey = KEY_STORAGE_PREFIX + code
    try {
      if (fromUrl) {
        window.sessionStorage.setItem(storageKey, fromUrl)
        setHostKey(fromUrl)
        // 키가 주소창에 남지 않도록 지운다 (공유·스크린샷 사고 방지)
        window.history.replaceState(null, '', window.location.pathname)
        return
      }
      setHostKey(window.sessionStorage.getItem(storageKey))
    } catch {
      setHostKey(fromUrl)
    }
  }, [code, searchParams])

  const fetcher = useMemo(
    () => (hostKey ? () => fetchHostState(code, hostKey) : null),
    [code, hostKey],
  )
  const { data: state, error, setData } = useEventPolling(fetcher)

  const act = useCallback(
    async (action: EventHostAction) => {
      if (!hostKey) return
      setBusy(action)
      setActionError(null)
      try {
        setData(await sendHostAction(code, hostKey, action))
      } catch (e) {
        setActionError(e instanceof EventApiError ? e.message : '실패했어요')
      } finally {
        setBusy(null)
      }
    },
    [code, hostKey, setData],
  )

  const shell = (children: React.ReactNode) => (
    <div
      className={cn(
        'flex min-h-screen flex-col gap-4 bg-background px-4 pb-10 pt-6 lg:pt-ds-8',
        DESKTOP_PAGE_COLUMN,
      )}
    >
      {children}
    </div>
  )

  if (!hostKey) {
    return shell(
      <section className="flex flex-col gap-3 rounded-2xl bg-card p-5">
        <h1 className="typo-heading-04 text-foreground">사회자 키를 입력해 주세요</h1>
        <p className="typo-body-b-01 text-brand-gray-200">
          방을 만들 때 받은 사회자 링크를 열면 자동으로 들어갑니다.
        </p>
        <input
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value.trim())}
          placeholder="사회자 키"
          className="typo-body-a-01 h-12 rounded-xl border border-border bg-background px-4 text-foreground outline-none focus:border-primary"
          aria-label="사회자 키"
        />
        <Button size="l" fullWidth disabled={!keyInput} onClick={() => setHostKey(keyInput)}>
          들어가기
        </Button>
      </section>,
    )
  }

  if (!state) {
    return shell(
      <p className="typo-body-b-01 py-10 text-center text-brand-gray-100">
        {error ? error.message : '방 상태를 불러오는 중…'}
      </p>,
    )
  }

  const question = state.question
  const isLast = state.currentIndex >= state.totalQuestions - 1

  return shell(
    <>
      <section className="flex flex-col gap-2 rounded-2xl bg-card p-5">
        <p className="typo-label-03 text-primary">사회자 · 참가 코드 {state.code}</p>
        <h1 className="typo-heading-05 text-foreground">{state.name}</h1>
        <p className="typo-body-c-02 text-brand-gray-100">
          입장 {state.participantCount}명 · 질문 {state.totalQuestions}개 ·{' '}
          {state.status === 'lobby' ? '대기 중' : state.status === 'live' ? '진행 중' : '종료'}
        </p>
        {error && (
          <p className="typo-body-c-02 text-brand-red-200" role="alert">
            {error.message}
          </p>
        )}
      </section>

      {state.status === 'lobby' && (
        <section className="flex flex-col gap-3 rounded-2xl bg-card p-5">
          <h2 className="typo-title-02 text-foreground">입장한 사람</h2>
          {state.participants.length === 0 ? (
            <p className="typo-body-c-01 text-brand-gray-100">
              아직 없어요. 프로젝터 화면의 QR 을 보여 주세요.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {state.participants.map((p) => (
                <li
                  key={p.id}
                  className="typo-label-03 rounded-full bg-brand-violet-50 px-3 py-1 text-brand-violet-500"
                >
                  {p.nickname}
                </li>
              ))}
            </ul>
          )}
          <Button size="xl" fullWidth loading={busy === 'start'} onClick={() => void act('start')}>
            첫 질문 시작
          </Button>
        </section>
      )}

      {state.status === 'live' && question && (
        <section className="flex flex-col gap-4 rounded-2xl bg-card p-5">
          <p className="typo-label-03 text-brand-gray-100">
            Q{state.currentIndex + 1} / {state.totalQuestions}
          </p>
          <h2 className="typo-heading-04 text-foreground">{question.title}</h2>
          <p className="typo-body-c-01 text-brand-gray-200">
            응답 {state.answeredCount} / {state.participantCount}명
            {state.revealed ? ' · 공개됨' : ' · 비공개 (사회자만 보는 중)'}
          </p>
          <EventResultBars options={question.options} counts={state.counts} />
          {actionError && (
            <p className="typo-body-c-02 text-brand-red-200" role="alert">
              {actionError}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="l"
              disabled={state.currentIndex === 0}
              loading={busy === 'prev'}
              onClick={() => void act('prev')}
            >
              이전
            </Button>
            {state.revealed ? (
              <Button variant="secondary" size="l" loading={busy === 'hide'} onClick={() => void act('hide')}>
                다시 가리기
              </Button>
            ) : (
              <Button variant="secondary" size="l" loading={busy === 'reveal'} onClick={() => void act('reveal')}>
                결과 공개
              </Button>
            )}
          </div>
          <Button size="xl" fullWidth loading={busy === 'next'} onClick={() => void act('next')}>
            {isLast ? '마지막 질문 끝내기' : '다음 질문'}
          </Button>
        </section>
      )}

      {state.status === 'ended' && (
        <section className="flex flex-col gap-3 rounded-2xl bg-card p-5">
          <h2 className="typo-title-02 text-foreground">게임이 끝났어요</h2>
          <p className="typo-body-c-01 text-brand-gray-200">
            참가자 화면에는 마무리 안내가 떠 있어요. 다시 열려면 아래를 누르세요.
          </p>
          <Button variant="ghost" size="l" fullWidth loading={busy === 'start'} onClick={() => void act('start')}>
            처음부터 다시 시작
          </Button>
        </section>
      )}

      {state.status !== 'ended' && (
        <Button variant="ghost" size="m" loading={busy === 'end'} onClick={() => void act('end')}>
          게임 종료
        </Button>
      )}
    </>,
  )
}
