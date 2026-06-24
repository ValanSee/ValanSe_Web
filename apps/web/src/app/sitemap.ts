import type { MetadataRoute } from 'next'
import { fetchVotes } from '@/api/pages/valanse/balanseListapi'

const SITE_URL = 'https://valanse.kr'
const MAX_PAGES = 200
const PAGE_SIZE = 100

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/balanse`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/balanse?category=FOOD`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/balanse?category=LOVE`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/balanse?category=ETC`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  const voteEntries: MetadataRoute.Sitemap = []

  try {
    let cursor: string | undefined = undefined
    let pageCount = 0

    while (pageCount < MAX_PAGES) {
      const res = await fetchVotes({ size: PAGE_SIZE, cursor })

      for (const vote of res.votes) {
        voteEntries.push({
          url: `${SITE_URL}/poll/${vote.id}`,
          lastModified: vote.created_at ? new Date(vote.created_at) : now,
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

  return [...staticEntries, ...voteEntries]
}
