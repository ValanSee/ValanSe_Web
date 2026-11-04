import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // GA4 Data API(gRPC) · GCS 클라이언트는 번들하지 않고 node_modules 에서 그대로 로드
  serverExternalPackages: ['@google-analytics/data', '@google-cloud/storage'],
}

export default nextConfig
