import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// 디자인 토큰 규칙 (작업 지시서 9절). eslint-plugin-jsx-a11y는 ESLint 10을 지원하지 않아 빼 두었다.
const dashMessage = 'Em and en dashes are banned in UI copy.'
// Arbitrary values and default-palette escapes that bypass design tokens
const arbitraryValue =
  '/(?:^|\\s)[a-z:-]*(?:bg|text|border|fill|stroke|ring|outline|shadow|rounded|font|leading|tracking|decoration|accent|caret)-\\[/'
// Decorative effects the design system forbids
const bannedEffects =
  '/(?:^|\\s)[a-z:-]*(?:bg-linear|bg-radial|bg-conic|bg-gradient|from-|via-|backdrop-blur|blur-|drop-shadow|text-shadow|animate-)/'

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'dev-dist', 'docs', 'public/mockServiceWorker.js'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2023, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}', 'src/mocks/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
          message: 'Use a design token instead of a raw hex color.',
        },
        {
          selector: `Literal[value=${arbitraryValue}]`,
          message: 'Use a token utility instead of an arbitrary value.',
        },
        {
          selector: `TemplateElement[value.raw=${arbitraryValue}]`,
          message: 'Use a token utility instead of an arbitrary value.',
        },
        {
          selector: `Literal[value=${bannedEffects}]`,
          message: 'Gradients, blur, shadows and decorative animation are not allowed.',
        },
        { selector: 'Literal[value=/[\\u2013\\u2014]/]', message: dashMessage },
        { selector: 'TemplateElement[value.raw=/[\\u2013\\u2014]/]', message: dashMessage },
        { selector: 'JSXText[value=/[\\u2013\\u2014]/]', message: dashMessage },
        {
          selector: "JSXAttribute[name.name='style']",
          message: 'Use token utilities instead of inline styles.',
        },
      ],
    },
  },
  prettier,
)
