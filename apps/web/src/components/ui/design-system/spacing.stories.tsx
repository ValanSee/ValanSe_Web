import type { Meta, StoryObj } from '@storybook/nextjs'

type Token = { name: string; className: string; px: number }

const tokens: Token[] = [
  { name: 'ds-1', className: 'w-ds-1', px: 4 },
  { name: 'ds-2', className: 'w-ds-2', px: 8 },
  { name: 'ds-3', className: 'w-ds-3', px: 12 },
  { name: 'ds-4', className: 'w-ds-4', px: 16 },
  { name: 'ds-5', className: 'w-ds-5', px: 20 },
  { name: 'ds-6', className: 'w-ds-6', px: 24 },
  { name: 'ds-8', className: 'w-ds-8', px: 32 },
  { name: 'ds-10', className: 'w-ds-10', px: 40 },
]

const grid: Token[] = [
  { name: 'ds-grid-margin', className: 'w-ds-grid-margin', px: 24 },
  { name: 'ds-grid-gutter', className: 'w-ds-grid-gutter', px: 16 },
]

const Bar = ({ token }: { token: Token }) => (
  <div className="flex items-center gap-4 py-2">
    <div className="min-w-[180px]">
      <div className="typo-label-01 text-foreground">{token.name}</div>
      <div className="typo-body-c-03 text-muted-foreground">{token.px}px</div>
    </div>
    <div className={`h-4 rounded bg-primary ${token.className}`} />
  </div>
)

const meta = {
  title: 'Design/Spacing',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '4pt/8pt 기반 스페이싱 스케일. `p-ds-*`, `gap-ds-*`, `w-ds-*` 등으로 사용합니다.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SpacingScale: Story = {
  render: () => (
    <section className="p-6">
      <h2 className="typo-heading-03 mb-4">Spacing Scale</h2>
      <div>
        {tokens.map((t) => (
          <Bar key={t.name} token={t} />
        ))}
      </div>
    </section>
  ),
}

export const GridSpacing: Story = {
  render: () => (
    <section className="p-6">
      <h2 className="typo-heading-03 mb-2">Grid</h2>
      <p className="typo-body-c-02 mb-4 text-muted-foreground">
        4 column · 마진 24 · 거터 16
      </p>
      <div>
        {grid.map((t) => (
          <Bar key={t.name} token={t} />
        ))}
      </div>
    </section>
  ),
}
