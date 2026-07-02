import type { Meta, StoryObj } from '@storybook/nextjs'

type Spec = {
  name: string
  className: string
  size: number
  weight: number
  lineHeight: string
  letterSpacing: string
}

const SAMPLE = '재미있는 밸런스게임 - The quick brown fox jumps over 1234567890'

const Row = ({ spec }: { spec: Spec }) => (
  <div className="flex items-baseline justify-between gap-6 border-b border-border py-4">
    <div className="min-w-[160px] shrink-0">
      <div className="typo-label-01 text-foreground">{spec.name}</div>
      <div className="typo-body-c-03 text-muted-foreground">
        {spec.size}px · {spec.weight} · LH {spec.lineHeight} · LS {spec.letterSpacing}
      </div>
    </div>
    <div className={`flex-1 text-foreground ${spec.className}`}>{SAMPLE}</div>
  </div>
)

const headings: Spec[] = [
  { name: 'Heading 01', className: 'typo-heading-01', size: 28, weight: 700, lineHeight: '130%', letterSpacing: '-0.4' },
  { name: 'Heading 02', className: 'typo-heading-02', size: 24, weight: 700, lineHeight: '130%', letterSpacing: '-0.4' },
  { name: 'Heading 03', className: 'typo-heading-03', size: 22, weight: 700, lineHeight: '130%', letterSpacing: '-0.2' },
  { name: 'Heading 04', className: 'typo-heading-04', size: 20, weight: 700, lineHeight: '135%', letterSpacing: '-0.2' },
  { name: 'Heading 05', className: 'typo-heading-05', size: 18, weight: 700, lineHeight: '140%', letterSpacing: '-0.2' },
  { name: 'Heading 06', className: 'typo-heading-06', size: 16, weight: 700, lineHeight: '140%', letterSpacing: '-0.2' },
]

const titles: Spec[] = [
  { name: 'Title 01', className: 'typo-title-01', size: 20, weight: 600, lineHeight: '140%', letterSpacing: '0' },
  { name: 'Title 02', className: 'typo-title-02', size: 17, weight: 600, lineHeight: '140%', letterSpacing: '0' },
  { name: 'Title 03', className: 'typo-title-03', size: 15, weight: 600, lineHeight: '140%', letterSpacing: '0' },
  { name: 'Title 04', className: 'typo-title-04', size: 14, weight: 600, lineHeight: '140%', letterSpacing: '0' },
]

const bodies: Spec[] = [
  { name: 'Body A 01', className: 'typo-body-a-01', size: 16, weight: 400, lineHeight: '140%', letterSpacing: '0.2' },
  { name: 'Body A 02', className: 'typo-body-a-02', size: 16, weight: 400, lineHeight: '170%', letterSpacing: '0.2' },
  { name: 'Body B 01', className: 'typo-body-b-01', size: 16, weight: 500, lineHeight: '140%', letterSpacing: '0.2' },
  { name: 'Body B 02', className: 'typo-body-b-02', size: 14, weight: 400, lineHeight: '140%', letterSpacing: '0.4' },
  { name: 'Body B 03', className: 'typo-body-b-03', size: 14, weight: 400, lineHeight: '170%', letterSpacing: '0.4' },
  { name: 'Body C 01', className: 'typo-body-c-01', size: 14, weight: 500, lineHeight: '150%', letterSpacing: '0.4' },
  { name: 'Body C 02', className: 'typo-body-c-02', size: 13, weight: 400, lineHeight: '140%', letterSpacing: '0.4' },
  { name: 'Body C 03', className: 'typo-body-c-03', size: 12, weight: 400, lineHeight: '140%', letterSpacing: '0.4' },
]

const labels: Spec[] = [
  { name: 'Label 01', className: 'typo-label-01', size: 12, weight: 600, lineHeight: '140%', letterSpacing: '0.2' },
  { name: 'Label 02', className: 'typo-label-02', size: 16, weight: 500, lineHeight: '140%', letterSpacing: '0.4' },
  { name: 'Label 03', className: 'typo-label-03', size: 14, weight: 500, lineHeight: '140%', letterSpacing: '0.4' },
]

const Group = ({ title, specs }: { title: string; specs: Spec[] }) => (
  <section className="p-6">
    <h2 className="typo-heading-03 mb-2">{title}</h2>
    <div>
      {specs.map((s) => (
        <Row key={s.name} spec={s} />
      ))}
    </div>
  </section>
)

const meta = {
  title: 'Design/Typography',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '타이포그래피 스케일. `.typo-*` 클래스를 사용해 페이지 컴포넌트에 적용합니다.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Headings: Story = {
  render: () => <Group title="Heading" specs={headings} />,
}
export const Titles: Story = {
  render: () => <Group title="Title" specs={titles} />,
}
export const Bodies: Story = {
  render: () => <Group title="Body A / B / C" specs={bodies} />,
}
export const Labels: Story = {
  render: () => <Group title="Label" specs={labels} />,
}
