import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

/**
 * La regle de dependance de l'architecture (app -> features -> services -> store -> types)
 * est verifiee par le linter plutot que documentee : une violation casse `npm run lint`.
 */
const restrict = (patterns) => ({
  'no-restricted-imports': ['error', { patterns }],
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'no-console': 'error',
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: restrict([
      {
        group: ['@/features/*', '@/services/*', '@/store/*', '@/mocks/*'],
        message: 'Les primitives UI ne connaissent pas le domaine.',
      },
    ]),
  },
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: restrict([
      {
        group: ['@/store/*', '@/mocks/*'],
        message: 'Le routing ne touche ni au store ni au seed : passez par features/services.',
      },
    ]),
  },
  {
    files: ['src/services/**/*.ts'],
    rules: restrict([
      {
        group: ['@/features/*', '@/app/*', '@/components/*'],
        message: 'Un service ne remonte jamais vers la couche UI.',
      },
    ]),
  },
  {
    files: ['src/store/**/*.ts'],
    rules: restrict([
      {
        group: ['@/features/*', '@/app/*', '@/components/*', '@/services/*'],
        message: 'Le store est la couche la plus basse apres les types.',
      },
    ]),
  },
];

export default eslintConfig;
