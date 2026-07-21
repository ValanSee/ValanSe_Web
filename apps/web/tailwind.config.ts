import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        brand: {
          yellow: {
            50: 'hsl(var(--color-y50))',
            75: 'hsl(var(--color-y75))',
            100: 'hsl(var(--color-y100))',
            200: 'hsl(var(--color-y200))',
            300: 'hsl(var(--color-y300))',
            400: 'hsl(var(--color-y400))',
            500: 'hsl(var(--color-y500))',
          },
          violet: {
            50: 'hsl(var(--color-v50))',
            75: 'hsl(var(--color-v75))',
            100: 'hsl(var(--color-v100))',
            200: 'hsl(var(--color-v200))',
            300: 'hsl(var(--color-v300))',
            400: 'hsl(var(--color-v400))',
            500: 'hsl(var(--color-v500))',
          },
          gray: {
            50: 'hsl(var(--color-g50))',
            75: 'hsl(var(--color-g75))',
            100: 'hsl(var(--color-g100))',
            200: 'hsl(var(--color-g200))',
            300: 'hsl(var(--color-g300))',
            400: 'hsl(var(--color-g400))',
            500: 'hsl(var(--color-g500))',
          },
          black: 'hsl(var(--color-black))',
          red: {
            100: 'hsl(var(--color-r100))',
            200: 'hsl(var(--color-r200))',
            300: 'hsl(var(--color-r300))',
          },
          kakao: 'hsl(var(--color-kakao))',
        },
        tier: {
          basic: {
            DEFAULT: 'var(--tier-basic-bg)',
            foreground: 'var(--tier-basic-fg)',
          },
          1: {
            DEFAULT: 'var(--tier-1-bg)',
            foreground: 'var(--tier-1-fg)',
          },
          2: {
            DEFAULT: 'var(--tier-2-bg)',
            foreground: 'var(--tier-2-fg)',
          },
          3: {
            DEFAULT: 'var(--tier-3-bg)',
            foreground: 'var(--tier-3-fg)',
          },
          season: {
            DEFAULT: 'var(--tier-season-bg)',
            foreground: 'var(--tier-season-fg)',
          },
          rare: {
            DEFAULT: 'var(--tier-rare-bg)',
            foreground: 'var(--tier-rare-fg)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        'ds-1': '4px',
        'ds-2': '8px',
        'ds-3': '12px',
        'ds-4': '16px',
        'ds-5': '20px',
        'ds-6': '24px',
        'ds-8': '32px',
        'ds-10': '40px',
        'ds-grid-margin': '24px',
        'ds-grid-gutter': '16px',
      },
      fontFamily: {
        pretendard: [
          'var(--font-pretendard)',
          'Pretendard Variable',
          'Pretendard',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config
