import type { MetadataRoute } from 'next'
import { fetchVotes } from '@/api/pages/valanse/balanseListapi'
import { CATEGORIES } from '@/constants/category'
import { SITE_URL } from '@/constants/seo'

const MAX_PAGES = 200
const PAGE_SIZE = 50 // 서버 /votes size 상한 50

export const revalidate = 3600

// 목록 페이지 lastmod 는 매 요청 시각이 아니라 실제로 마지막 게임이 올라온 시각으로
// (항상 현재 시각이면 검색엔진이 lastmod 를 신뢰하지 않음)
function latestDate(dates: (Date | undefined)[]): Date | undefined {
  return dates.reduce<Date | undefined>(
    (latest, d) => (d && (!latest || d > latest) ? d : latest),
    undefined,
  )
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const voteEntries: MetadataRoute.Sitemap = []
  const voteDates: { category: string; date: Date }[] = []

  try {
    let cursor: string | undefined = undefined
    let pageCount = 0

    while (pageCount < MAX_PAGES) {
      const res = await fetchVotes({ size: PAGE_SIZE, cursor })

      for (const vote of res.votes) {
        const createdAt = vote.created_at
          ? new Date(vote.created_at)
          : undefined
        if (createdAt)
          voteDates.push({ category: vote.category, date: createdAt })
        voteEntries.push({
          url: `${SITE_URL}/poll/${vote.id}`,
          lastModified: createdAt,
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }

      if (!res.has_next_page || !res.next_cursor) break
      cursor = res.next_cursor
      pageCount++
    }
  } catch (error) {
    console.error('[sitemap] failed to fetch votes:', error)
  }

  const latestOverall = latestDate(voteDates.map((v) => v.date))

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: latestOverall,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/balanse`,
      lastModified: latestOverall,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/topics`,
      lastModified: latestOverall,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/balanse?category=${c.param}`,
      lastModified: latestDate(
        voteDates.filter((v) => v.category === c.param).map((v) => v.date),
      ),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/about`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  return [...staticEntries, ...voteEntries]
}
