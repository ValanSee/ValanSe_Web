// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      js,
      pluginReact,
      '@typescript-eslint': tseslint.plugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-pascal-case': 'error',
      'no-useless-catch': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      // 하드코딩 hex 컬러 금지 (경고). 브랜드 토큰(bg-primary, bg-brand-*, .typo-*)을 사용하세요.
      // AGENTS.md §8 참조. 매치: #RGB / #RRGGBB / #RRGGBBAA (문자열 리터럴 및 템플릿 리터럴).
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "Literal[value=/#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3}(?:[0-9a-fA-F]{2})?)?\\b/]",
          message:
            '하드코딩된 hex 컬러는 사용하지 마세요. 브랜드 토큰(bg-primary, bg-brand-violet-300 등) 또는 .typo-* 클래스를 사용하세요. (AGENTS.md §8)',
        },
        {
          selector:
            "TemplateElement[value.raw=/#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3}(?:[0-9a-fA-F]{2})?)?\\b/]",
          message:
            '하드코딩된 hex 컬러는 사용하지 마세요. 브랜드 토큰(bg-primary, bg-brand-violet-300 등) 또는 .typo-* 클래스를 사용하세요. (AGENTS.md §8)',
        },
      ],
    },
  },
  {
    // 디자인 토큰 스와치 스토리는 팔레트 hex 표기 자체가 콘텐츠이므로 예외.
    files: ['src/components/ui/design-system/**/*.stories.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    ignores: ['**/.next/**', 'eslint.config.mjs', 'postcss.config.mjs'],
  },
  ...storybook.configs["flat/recommended"]
])
