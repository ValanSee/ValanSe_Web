import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const avatarVariants = cva(
  'shrink-0 overflow-hidden rounded-full bg-brand-gray-75 object-cover',
  {
    variants: {
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-[72px] w-[72px]',
        xl: 'h-[96px] w-[96px]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

const AVATAR_PX: Record<
  NonNullable<VariantProps<typeof avatarVariants>['size']>,
  number
> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 72,
  xl: 96,
}

interface Props extends VariantProps<typeof avatarVariants> {
  src?: string | null
  alt?: string
  className?: string
}

/**
 * 프로필 아바타 · fallback 이미지 처리 포함.
 */
export default function Avatar({
  src,
  alt = '프로필 이미지',
  size = 'md',
  className,
}: Props) {
  const px = AVATAR_PX[size ?? 'md']
  const source = src && src.trim() !== '' ? src : '/file.svg'
  return (
    <Image
      src={source}
      alt={alt}
      width={px}
      height={px}
      className={cn(avatarVariants({ size }), className)}
    />
  )
}
