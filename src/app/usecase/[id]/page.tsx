import fs from 'node:fs/promises'
import path from 'node:path'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

async function findScreenFile(id: string): Promise<string | null> {
  const dir = path.join(process.cwd(), 'docs/screens')
  const files = await fs.readdir(dir)
  const match = files.find(
    (f) => f.endsWith('.md') && (f === `${id}.md` || f.startsWith(`${id}_`)),
  )
  return match ? path.join(dir, match) : null
}

export default async function UsecaseDetailPage({ params }: PageProps) {
  const { id } = await params
  const filePath = await findScreenFile(id)
  if (!filePath) notFound()

  const content = await fs.readFile(filePath, 'utf-8')

  return (
    <main>
      <p style={{ marginBottom: 16 }}>
        <Link
          href="/usecase"
          style={{ color: '#2563eb', textDecoration: 'none' }}
        >
          ← Usecase 인덱스
        </Link>
      </p>
      <article className="usecase-md">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
      <style>{`
        .usecase-md h1 { font-size: 28px; margin: 24px 0 12px; }
        .usecase-md h2 { font-size: 22px; margin: 28px 0 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
        .usecase-md h3 { font-size: 18px; margin: 20px 0 8px; }
        .usecase-md p { margin: 8px 0; }
        .usecase-md table { border-collapse: collapse; margin: 12px 0; width: 100%; }
        .usecase-md th, .usecase-md td { border: 1px solid #e5e7eb; padding: 6px 10px; text-align: left; font-size: 14px; }
        .usecase-md th { background: #f9fafb; }
        .usecase-md code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
        .usecase-md ul, .usecase-md ol { padding-left: 22px; margin: 8px 0; }
        .usecase-md li { margin: 4px 0; }
        .usecase-md blockquote { border-left: 3px solid #d1d5db; padding-left: 12px; color: #6b7280; margin: 12px 0; }
        .usecase-md a { color: #2563eb; }
      `}</style>
    </main>
  )
}
