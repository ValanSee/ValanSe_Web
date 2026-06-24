import type { MetadataRoute } from 'next'

const SITE_URL = 'https://valanse.kr'

const PRIVATE_PATHS = [
  '/my',
  '/my/',
  '/create',
  '/account-deletion',
  '/oauth',
  '/onboarding',
  '/api',
  '/usecase',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Yeti',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'NaverBot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Daum',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
