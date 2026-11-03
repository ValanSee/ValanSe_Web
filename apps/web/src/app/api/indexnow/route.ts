import { NextResponse } from 'next/server'
import { serverGetJson } from '@/api/instance/serverFetch'
import { SITE_URL } from '@/constants/seo'
import type { VoteListResponse } from '@/types/balanse/vote'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 공개 키 (https://www.indexnow.org/documentation). 같은 값의 키 파일이 public/{키}.txt 에 있어야 한다
const INDEXNOW_KEY = '0095d887078e4996bcd87db63ff35050'
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

// 크론은 하루 1회. created_at 에 시간대가 없어 UTC·KST 어느 쪽이어도 빠지지 않게 48시간으로 넉넉히 (중복 제출은 무해)
const WINDOW_MS = 48 * 60 * 60 * 1000
const PAGE_SIZE = 50 // 서버 /votes size 상한 50
const MAX_PAGES = 5

// 새 게임이 생기면 목록 페이지도 바뀌므로 함께 제출
const LIST_PATHS = ['/', '/balanse', '/topics']

async function fetchRecentPollUrls(since: number) {
  const urls: string[] = []
  let cursor: string | undefined

  for (let page = 0; page < MAX_PAGES; page++) {
    const result = await serverGetJson<VoteListResponse>(
      '/votes',
      { category: 'ALL', sort: 'latest', size: PAGE_SIZE, cursor },
      { revalidate: 0 },
    )
    if (result.status !== 'ok') break

    const { votes, has_next_page, next_cursor } = result.data
    const recent = votes.filter(
      (v) => new Date(v.created_at).getTime() >= since,
    )
    urls.push(...recent.map((v) => `${SITE_URL}/poll/${v.id}`))

    // 최신순이라 오래된 게임이 섞이기 시작하면 다음 페이지는 볼 필요 없음
    if (recent.length < votes.length || !has_next_page || !next_cursor) break
    cursor = next_cursor
  }
  return urls
}

/**
 * GET /api/indexnow — 최근 생성된 투표 상세 URL 을 IndexNow(Bing · 네이버 · Yandex 등)에 제출.
 * Vercel Cron(vercel.json) 이 하루 1회 호출하며, Authorization: Bearer {CRON_SECRET} 로 인증한다.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET 이 설정되지 않았습니다' },
      { status: 503 },
    )
  }
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const pollUrls = await fetchRecentPollUrls(Date.now() - WINDOW_MS)
  if (pollUrls.length === 0) {
    return NextResponse.json({ submitted: 0 })
  }

  const urlList = [...LIST_PATHS.map((p) => `${SITE_URL}${p}`), ...pollUrls]
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  })

  // 200 · 202 가 정상 (202 = 키 검증 대기)
  if (!res.ok) {
    console.error('[indexnow] submit failed:', res.status, await res.text())
    return NextResponse.json(
      { error: 'indexnow submit failed', status: res.status },
      { status: 502 },
    )
  }
  return NextResponse.json({ submitted: urlList.length, status: res.status })
}
