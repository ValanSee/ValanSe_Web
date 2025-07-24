import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: [
      'k.kakaocdn.net',
      // 필요시 기존 도메인도 여기에 추가
    ],
  },
}

export default nextConfig
