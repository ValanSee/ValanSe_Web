import Link from 'next/link'
import Header from '@/components/_shared/header'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PLAY_STORE_URL } from '@/constants/about'
import PhoneFrame from './phoneFrame'

const FEATURES = [
  {
    title: '지금 가장 뜨거운 밸런스게임',
    description: '사람들이 지금 고민 중인 질문을 홈에서 한눈에 볼 수 있어요.',
    image: '/assets/app/home.png',
    alt: 'ValanSe 앱 홈 화면 — 뜨고 있는 밸런스와 주제별 카테고리',
  },
  {
    title: '남녀·나이·MBTI별로 결과 비교',
    description: '고르는 순간, 다른 사람들이 무엇을 골랐는지 바로 보여요.',
    image: '/assets/app/result.png',
    alt: 'ValanSe 앱 투표 결과 화면 — 성별 투표 결과 그래프',
  },
  {
    title: '내 고민을 밸런스게임으로',
    description:
      '질문과 선택지만 적으면 바로 올라가고, 친구에게 공유할 수 있어요.',
    image: '/assets/app/create.png',
    alt: 'ValanSe 앱 밸런스게임 만들기 화면',
  },
]

function StoreButtons({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-ds-2 sm:flex-row', className)}>
      {/* Button 의 asChild 는 내부 span 때문에 Slot 이 깨져서 링크는 variants 만 입힌다 */}
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ size: 'xl' }),
          'bg-brand-black hover:bg-brand-black/80',
        )}
      >
        Google Play에서 받기
      </a>
      <Button size="xl" disabled>
        App Store 곧 출시
      </Button>
    </div>
  )
}

/**
 * 앱 소개 · 다운로드 랜딩 페이지 (/app).
 * 스토어 등록정보의 웹사이트 · 공유용 링크. iOS 앱은 출시 전이라 버튼만 비활성으로 둔다.
 */
export default function AppLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        className="lg:hidden"
        titleAs="p"
        title="앱 다운로드"
        showBackButton
      />

      <section className="bg-gradient-to-b from-primary to-brand-violet-500 px-4 py-ds-10 text-primary-foreground lg:py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-ds-4">
          <span className="typo-label-03 rounded-full bg-brand-yellow-300 px-ds-3 py-ds-1 text-brand-black">
            A vs B 밸런스게임
          </span>
          <h1 className="typo-heading-02">
            황금 밸런스를 찾아서,
            <br />
            ValanSe 앱
          </h1>
          <p className="typo-body-b-01 text-primary-foreground/90">
            둘 중 하나를 고르고, 다른 사람들의 선택과 비교해 보세요.
          </p>
          <StoreButtons className="w-full sm:w-auto" />
          <Link
            href="/"
            className="typo-body-c-01 text-primary-foreground underline"
          >
            설치 없이 웹에서 바로 시작하기
          </Link>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-ds-10 px-4 py-ds-10 lg:gap-16 lg:py-16">
        {FEATURES.map(({ title, description, image, alt }, i) => (
          <section
            key={title}
            className={cn(
              'flex flex-col items-center gap-ds-6 lg:flex-row lg:gap-ds-10',
              i % 2 === 1 && 'lg:flex-row-reverse',
            )}
          >
            <div className="flex flex-1 flex-col gap-ds-2 text-center lg:text-left">
              <h2 className="typo-heading-04 text-foreground">{title}</h2>
              <p className="typo-body-b-01 text-brand-gray-200">
                {description}
              </p>
            </div>
            <PhoneFrame
              src={image}
              alt={alt}
              className="w-56 shrink-0 lg:w-64"
            />
          </section>
        ))}
      </div>

      <section className="bg-brand-violet-50 px-4 py-ds-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-ds-4 text-center">
          <h2 className="typo-heading-04 text-foreground">
            지금 모두의 황금 밸런스를 찾아보세요
          </h2>
          <StoreButtons />
        </div>
      </section>
    </div>
  )
}
