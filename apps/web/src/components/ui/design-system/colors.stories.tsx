import type { Meta, StoryObj } from '@storybook/nextjs'

type Swatch = { name: string; className: string; hex: string }

type PaletteProps = { title: string; swatches: Swatch[] }

const Palette = ({ title, swatches }: PaletteProps) => (
  <section className="mb-8">
    <h2 className="typo-heading-04 mb-4">{title}</h2>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {swatches.map((s) => (
        <div key={s.name} className="overflow-hidden rounded-md border border-border">
          <div className={`h-20 ${s.className}`} />
          <div className="bg-card p-3">
            <div className="typo-label-01 text-foreground">{s.name}</div>
            <div className="typo-body-c-03 text-muted-foreground">{s.hex}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
)

const yellow: Swatch[] = [
  { name: 'Y50', className: 'bg-brand-yellow-50', hex: '#fffbe7' },
  { name: 'Y75', className: 'bg-brand-yellow-75', hex: '#ffee9b' },
  { name: 'Y100', className: 'bg-brand-yellow-100', hex: '#ffe771' },
  { name: 'Y200', className: 'bg-brand-yellow-200', hex: '#ffdd34' },
  { name: 'Y300', className: 'bg-brand-yellow-300', hex: '#ffd60a' },
  { name: 'Y400', className: 'bg-brand-yellow-400', hex: '#b39607' },
  { name: 'Y500', className: 'bg-brand-yellow-500', hex: '#9c8306' },
]

const violet: Swatch[] = [
  { name: 'V50', className: 'bg-brand-violet-50', hex: '#f5f0fd' },
  { name: 'V75', className: 'bg-brand-violet-75', hex: '#d7c2f5' },
  { name: 'V100', className: 'bg-brand-violet-100', hex: '#c7a9f1' },
  { name: 'V200', className: 'bg-brand-violet-200', hex: '#ae84ea' },
  { name: 'V300', className: 'bg-brand-violet-300', hex: '#9e6be6' },
  { name: 'V400', className: 'bg-brand-violet-400', hex: '#6f4ba1' },
  { name: 'V500', className: 'bg-brand-violet-500', hex: '#60418c' },
]

const gray: Swatch[] = [
  { name: 'G50', className: 'bg-brand-gray-50', hex: '#F6F6F6' },
  { name: 'G75', className: 'bg-brand-gray-75', hex: '#BFBFBF' },
  { name: 'G100', className: 'bg-brand-gray-100', hex: '#848484' },
  { name: 'G200', className: 'bg-brand-gray-200', hex: '#4f4f4f' },
  { name: 'G300', className: 'bg-brand-gray-300', hex: '#2b2b2b' },
  { name: 'G400', className: 'bg-brand-gray-400', hex: '#1e1e1e' },
  { name: 'G500', className: 'bg-brand-gray-500', hex: '#1a1a1a' },
  { name: 'Black', className: 'bg-brand-black', hex: '#0A0A0A' },
]

const red: Swatch[] = [
  { name: 'R100', className: 'bg-brand-red-100', hex: '#FFB5CE' },
  { name: 'R200', className: 'bg-brand-red-200', hex: '#FF5B91' },
  { name: 'R300', className: 'bg-brand-red-300', hex: '#F80E5C' },
]

const semantic: Swatch[] = [
  { name: 'primary', className: 'bg-primary', hex: 'V300 · #9e6be6' },
  { name: 'primary-foreground', className: 'bg-primary-foreground', hex: 'white' },
  { name: 'secondary', className: 'bg-secondary', hex: 'G50 · #F6F6F6' },
  { name: 'accent', className: 'bg-accent', hex: 'Y300 · #ffd60a' },
  { name: 'destructive', className: 'bg-destructive', hex: 'R300 · #F80E5C' },
  { name: 'background', className: 'bg-background', hex: 'G50 · #F6F6F6' },
  { name: 'card', className: 'bg-card', hex: 'white' },
  { name: 'border', className: 'bg-border', hex: 'G75 · #BFBFBF' },
  { name: 'muted', className: 'bg-muted', hex: 'G50 · #F6F6F6' },
]

const meta = {
  title: 'Design/Colors',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '브랜드 컬러 팔레트(Yellow/Violet/Gray/Red/Black)와 shadcn 시멘틱 매핑을 검증합니다.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const YellowPalette: Story = {
  render: () => <Palette title="Yellow" swatches={yellow} />,
}
export const VioletPalette: Story = {
  render: () => <Palette title="Violet" swatches={violet} />,
}
export const GrayPalette: Story = {
  render: () => <Palette title="Gray + Black" swatches={gray} />,
}
export const RedPalette: Story = {
  render: () => <Palette title="Red" swatches={red} />,
}
export const SemanticColors: Story = {
  render: () => <Palette title="Semantic (shadcn)" swatches={semantic} />,
}
