import type { Metadata } from 'next'
import { BASE_OPEN_GRAPH } from '@/constants/seo'
import { PrivacyPolicyPage } from '../../../components/pages/privacy/privacyPolicyPage'

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description: 'ValanSe 개인정보 처리방침',
  alternates: { canonical: '/privacy' },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    url: '/privacy',
    title: '개인정보 처리방침',
  },
}

function Privacy() {
  return <PrivacyPolicyPage />
}

export default Privacy
