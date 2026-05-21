import fs from 'node:fs/promises'
import path from 'node:path'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface ScreenEntry {
  id: string
  fileName: string
  title: string
}

async function listScreens(): Promise<ScreenEntry[]> {
  const dir = path.join(process.cwd(), 'docs/screens')
  const files = await fs.readdir(dir)
  return files
    .filter(
      (f) => f.endsWith('.md') && f !== 'README.md' && f !== '_TEMPLATE.md',
    )
    .sort()
    .map((fileName) => {
      const [id, ...rest] = fileName.replace(/\.md$/, '').split('_')
      return {
        id,
        fileName,
        title: rest.join('_') || id,
      }
    })
}

export default async function UsecaseIndexPage() {
  const screens = await listScreens()
  return (
    <main>
      <h1 style={{ marginBottom: 8 }}>화면 명세서 (Usecase)</h1>
      <p style={{ color: '#6b7280', marginTop: 0 }}>
        개발 환경 전용 페이지입니다. 프로덕션에서는 404로 차단됩니다.
      </p>
      <p style={{ color: '#6b7280' }}>
        원본 마크다운: <code>docs/screens/</code>
      </p>
      <hr style={{ margin: '24px 0', borderColor: '#e5e7eb' }} />
      <ul style={{ paddingLeft: 18 }}>
        {screens.map((s) => (
          <li key={s.id} style={{ marginBottom: 8 }}>
            <Link
              href={`/usecase/${encodeURIComponent(s.id)}`}
              style={{ color: '#2563eb', textDecoration: 'none' }}
            >
              <strong>{s.id}</strong> — {s.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
