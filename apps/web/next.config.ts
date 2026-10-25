import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'k.kakaocdn.net' },
      { protocol: 'https', hostname: 'img1.kakaocdn.net' },
      { protocol: 'https', hostname: 'img2.kakaocdn.net' },
      // 카카오 프로필 이미지가 http 로 내려오는 경우가 있음.
      // 이미지 최적화 서버가 받아 /_next/image(https)로 내보내므로 혼합 콘텐츠 문제 없음
      { protocol: 'http', hostname: 'k.kakaocdn.net' },
      { protocol: 'http', hostname: 'img1.kakaocdn.net' },
      { protocol: 'http', hostname: 'img2.kakaocdn.net' },
      {
        protocol: 'https',
        hostname: 'pub-87cd0d25fe40436d83d5fb49e513cd55.r2.dev', // 프로필 이미지 버킷
      },
      {
        protocol: 'https',
        hostname: 'pub-1670751f540e495b8fbc46150a320d85.r2.dev', // 투표 선택지 이미지 버킷
      },
    ],
  },
}

export default nextConfig
