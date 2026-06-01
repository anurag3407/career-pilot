import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Ignore common intentionally-unused patterns:
      //   - PascalCase/UPPER_CASE vars (React components, constants)
      //   - args prefixed with _
      //   - framer-motion's `motion`, UI helpers like `toast`
      //   - all catch-clause errors (caughtErrors)
      'no-unused-vars': ['warn', {
        varsIgnorePattern: '^[A-Z_]|^motion$|^toast$',
        argsIgnorePattern: '^_|^Icon$',
        caughtErrorsIgnorePattern: '.*',
      }],
      'react-hooks/exhaustive-deps': 'warn',
      // Keep purity/refs as warnings — intentional Math.random usage in animation templates
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
      // Disable rules that were intentionally off before — these patterns are
      // widespread in the codebase and fixing them all is out of scope.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/static-components': 'off',
      'react-compiler/react-compiler': 'off',
      'no-empty': 'off',
      'no-unsafe-finally': 'warn',
    },
  },
  // Test files — add Vitest globals (vi, describe, test, expect, beforeEach, etc.)
  {
    files: ['**/__tests__/**/*.{js,jsx}', '**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        vi: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },
  // Node/CommonJS scripts (vite config, test helpers, etc.)
  {
    files: ['vite.config.js', 'test-react-batch.js', '*.config.{js,cjs,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]