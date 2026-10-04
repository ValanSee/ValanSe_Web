import type { Metadata } from 'next'
import { BASE_OPEN_GRAPH } from '@/constants/seo'

type Props = {
  params: Promise<{ id: string }>
}

// page.tsx 가 클라이언트 컴포넌트라 metadata 를 layout 에서 지정
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const path = `/poll/${id}`

  return {
    alternates: { canonical: path },
    openGraph: { ...BASE_OPEN_GRAPH, url: path },
  }
}

export default function PollDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
