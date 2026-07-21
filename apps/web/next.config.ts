import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'k.kakaocdn.net' },
      { protocol: 'https', hostname: 'img1.kakaocdn.net' },
      { protocol: 'https', hostname: 'img2.kakaocdn.net' },
      {
        protocol: 'https',
        hostname: 'pub-87cd0d25fe40436d83d5fb49e513cd55.r2.dev',
      },
    ],
  },
}

export default nextConfig
