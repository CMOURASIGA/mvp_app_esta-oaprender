import js from '@eslint/js';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', 'bun.lock', '*.json'],
  },
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'off',
      'no-console': 'off',
    },
  },
];
