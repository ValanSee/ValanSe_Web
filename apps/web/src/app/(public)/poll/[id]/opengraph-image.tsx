import { ImageResponse } from 'next/og'
import { fetchPollDetailForServer } from '@/api/pages/poll/pollDetailServer'
import { getCategoryMeta } from '@/constants/category'
import { SITE_URL } from '@/constants/seo'

export const alt = 'ValanSe 밸런스게임'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

// ImageResponse 는 CSS 변수를 못 쓰므로 globals.css 브랜드 토큰 값을 그대로 옮겨 사용
const COLOR = {
  v50: 'hsl(263, 76.5%, 96.7%)',
  v300: 'hsl(265, 71.1%, 66.1%)',
  v500: 'hsl(265, 36.6%, 40.2%)',
  y300: 'hsl(50, 100%, 52%)',
  g500: 'hsl(0, 0%, 10.2%)',
  white: 'hsl(0, 0%, 100%)',
}

const TITLE_MAX = 40
const OPTION_MAX = 18

function truncate(text: string, max: number) {
  const trimmed = text.trim()
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed
}

/**
 * Satori 는 woff2(Pretendard) 를 못 읽으므로 이미지에 쓰는 글자만 Google Fonts 에서 잘라 받는다.
 * (Next.js 공식 예제 방식, 서버 fetch 는 TTF 로 응답)
 */
async function loadFont(text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`
  const css = await (await fetch(cssUrl)).text()
  const fontUrl = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
  )?.[1]
  if (!fontUrl) throw new Error('font url not found')
  const res = await fetch(fontUrl)
  if (!res.ok) throw new Error(`font fetch ${res.status}`)
  return res.arrayBuffer()
}

/** 상세 조회·폰트 로드 실패 시 공통 OG 이미지로 대체 */
async function fallbackImage() {
  const res = await fetch(`${SITE_URL}/og-image.png`)
  return new Response(await res.arrayBuffer(), {
    headers: { 'Content-Type': contentType },
  })
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await fetchPollDetailForServer(id)
  if (result.status !== 'ok') return fallbackImage()

  const poll = result.data
  const category = getCategoryMeta(poll.category)
  const chip = category ? `${category.label} 밸런스게임` : '밸런스게임'
  const title = truncate(poll.title, TITLE_MAX)
  const [optionA, optionB] = poll.options.map((o) =>
    truncate(o.content, OPTION_MAX),
  )
  const footer = '둘 중 하나만 고른다면?'
  const brand = 'ValanSe'

  let font: ArrayBuffer
  try {
    font = await loadFont(
      [chip, title, optionA, optionB, footer, brand, 'ABVS', 'valanse.kr'].join(
        '',
      ),
    )
  } catch (error) {
    console.error('[og image] 폰트 로드 실패', error)
    return fallbackImage()
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 72px',
          background: `linear-gradient(135deg, ${COLOR.v300} 0%, ${COLOR.v500} 100%)`,
          fontFamily: 'Noto Sans KR',
          color: COLOR.white,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', fontSize: 40 }}>{brand}</div>
          <div
            style={{
              display: 'flex',
              padding: '10px 24px',
              borderRadius: 999,
              background: COLOR.y300,
              color: COLOR.g500,
              fontSize: 28,
            }}
          >
            {chip}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 64,
            lineHeight: 1.3,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <OptionBox label="A" text={optionA} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              flexShrink: 0,
              borderRadius: 999,
              background: COLOR.white,
              color: COLOR.v500,
              fontSize: 30,
            }}
          >
            VS
          </div>
          <OptionBox label="B" text={optionB} />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 28,
            opacity: 0.9,
          }}
        >
          <span>{footer}</span>
          <span>valanse.kr</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Noto Sans KR', data: font, weight: 700, style: 'normal' },
      ],
    },
  )
}

function OptionBox({ label, text }: { label: string; text?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        // 두 선택지 너비를 글자 수와 무관하게 같게
        flex: 1,
        flexBasis: 0,
        gap: 16,
        padding: '28px 32px',
        borderRadius: 24,
        background: COLOR.v50,
        color: COLOR.v500,
        fontSize: 36,
      }}
    >
      <span style={{ color: COLOR.v300 }}>{label}</span>
      <span>{text ?? ''}</span>
    </div>
  )
}
