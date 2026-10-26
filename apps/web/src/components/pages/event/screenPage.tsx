'use client'

import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import EventResultBars from './eventResultBars'
import { pollIntervalFor, useEventPolling } from '@/hooks/event/useEventPolling'
import { fetchPublicState } from '@/api/event/eventRoomApi'
import { SITE_URL } from '@/constants/seo'
import { cn } from '@/lib/utils'

interface Props {
  code: string
}

/**
 * 프로젝터 화면 (/event/[code]/screen). GNB·푸터 없이 꽉 채우고(ChromeGate),
 * 대기 중엔 참가 QR, 진행 중엔 질문과 선택지, 공개되면 이 방 사람들의 비율만 크게 보여준다.
 */
export default function ScreenPage({ code }: Props) {
  const joinUrl = `${SITE_URL}/event/${code}`
  const [qr, setQr] = useState<string | null>(null)

  useEffect(() => {
    QRCode.toDataURL(joinUrl, { width: 640, margin: 1 })
      .then(setQr)
      .catch(() => setQr(null))
  }, [joinUrl])

  const fetcher = useMemo(() => () => fetchPublicState(code, null), [code])
  const [interval, setInterval_] = useState(pollIntervalFor(null))
  const { data: state, error } = useEventPolling(fetcher, interval)
  useEffect(() => setInterval_(pollIntervalFor(state)), [state])

  const frame = (children: React.ReactNode, dark = false) => (
    <div
      className={cn(
        'flex min-h-screen flex-col px-10 py-10 lg:px-20 lg:py-14',
        dark ? 'bg-brand-violet-500 text-primary-foreground' : 'bg-background text-foreground',
      )}
    >
      {children}
      <p
        className={cn(
          'mt-auto pt-8 text-xl',
          dark ? 'text-brand-violet-100' : 'text-brand-gray-100',
        )}
      >
        valanse.kr
      </p>
    </div>
  )

  if (!state) {
    return frame(
      <p className="text-3xl text-brand-gray-100">
        {error ? error.message : '방에 연결하는 중…'}
      </p>,
    )
  }

  if (state.status === 'lobby') {
    return frame(
      <div className="flex flex-1 items-center gap-16">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <p className="text-2xl font-semibold text-brand-violet-100">밸런스게임</p>
          <h1 className="text-6xl font-bold leading-tight">{state.name}</h1>
          <p className="text-3xl text-brand-violet-100">
            폰으로 QR 을 찍고 닉네임만 적어 주세요
          </p>
          <p className="text-4xl font-bold text-brand-yellow-300">
            참가 코드 {state.code}
          </p>
          <p className="text-2xl text-brand-violet-100">
            지금 {state.participantCount}명 입장
          </p>
        </div>
        <div className="shrink-0 rounded-3xl bg-card p-6">
          {qr ? (
            <img src={qr} alt={`참가 QR: ${joinUrl}`} className="h-80 w-80 lg:h-96 lg:w-96" />
          ) : (
            <p className="w-80 text-center text-2xl text-foreground">{joinUrl}</p>
          )}
        </div>
      </div>,
      true,
    )
  }

  if (state.status === 'ended' || !state.question) {
    return frame(
      <div className="flex flex-1 flex-col justify-center gap-6">
        <h1 className="text-6xl font-bold">오늘 제일 갈린 질문은?</h1>
        <p className="text-3xl text-brand-violet-100">
          함께해 줘서 고마워요. 다음 모임 질문은 valanse.kr 에서.
        </p>
      </div>,
      true,
    )
  }

  const { question } = state
  return frame(
    <div className="flex flex-1 flex-col gap-10">
      <div className="flex items-center justify-between text-2xl text-brand-gray-100">
        <span className="rounded-full bg-primary px-5 py-1 font-bold text-primary-foreground">
          Q{state.currentIndex + 1}
        </span>
        <span>
          {state.currentIndex + 1} / {state.totalQuestions} · 응답 {state.answeredCount} /{' '}
          {state.participantCount}명
        </span>
      </div>
      <h1 className="text-6xl font-bold leading-tight">{question.title}</h1>

      {state.revealed && state.counts ? (
        <EventResultBars options={question.options} counts={state.counts} large />
      ) : (
        <div
          className={cn(
            'grid gap-6',
            question.options.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4',
          )}
        >
          {question.options.map((o, i) => (
            <div
              key={o.label}
              className={cn(
                'flex min-h-64 flex-col gap-4 rounded-3xl p-8',
                i === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-brand-violet-50 text-foreground',
              )}
            >
              <span
                className={cn(
                  'text-7xl font-bold',
                  i === 0 ? 'text-primary-foreground' : 'text-brand-violet-500',
                )}
              >
                {o.label}
              </span>
              <span className="text-4xl font-semibold leading-snug">{o.content}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-2xl text-brand-gray-100">
        {state.revealed ? '우리끼리의 결과예요. 소수파부터 이유 한마디!' : '폰에서 골라 주세요'}
      </p>
    </div>,
  )
}
