import Link from 'next/link'
import { CATEGORIES } from '@/constants/category'
import { SITE_NAME } from '@/constants/seo'

type FooterLink = { label: string; href: string }

const FOOTER_GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    title: '밸런스게임',
    links: [
      { label: '홈', href: '/' },
      { label: '밸런스게임 모음', href: '/balanse' },
      { label: '인기 밸런스게임', href: '/balanse?sort=popular' },
      { label: '밸런스게임 만들기', href: '/create' },
    ],
  },
  {
    title: '카테고리',
    links: CATEGORIES.map((c) => ({
      label: `${c.label} 밸런스게임`,
      href: `/balanse?category=${c.param}`,
    })),
  },
  {
    title: '안내',
    links: [{ label: '개인정보 처리방침', href: '/privacy' }],
  },
]

/**
 * PC(lg 이상) 전용 푸터. 카테고리·목록 링크를 모아 내부 링크(크롤링 경로)를 늘린다.
 * 모바일 앱(WebView) 화면에는 노출하지 않는다.
 */
export default function DesktopFooter() {
  return (
    <footer className="hidden border-t border-border bg-card lg:block">
      <div className="mx-auto flex w-full max-w-[1200px] gap-ds-10 px-ds-6 py-ds-10">
        <div className="flex w-64 shrink-0 flex-col gap-ds-2">
          <span className="typo-heading-05 text-foreground">{SITE_NAME}</span>
          <p className="typo-body-c-02 text-brand-gray-100">
            둘 중 하나를 골라 투표하고, 다른 사람들의 선택을 확인하는 밸런스게임
            서비스
          </p>
        </div>

        <div className="flex flex-1 gap-ds-10">
          {FOOTER_GROUPS.map(({ title, links }) => (
            <nav
              key={title}
              aria-label={title}
              className="flex min-w-32 flex-col gap-ds-3"
            >
              <h2 className="typo-title-03 text-foreground">{title}</h2>
              <ul className="flex flex-col gap-ds-2">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="typo-body-c-02 text-brand-gray-100 transition-colors hover:text-primary"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-border">
        <p className="typo-body-c-03 mx-auto w-full max-w-[1200px] px-ds-6 py-ds-4 text-brand-gray-100">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
