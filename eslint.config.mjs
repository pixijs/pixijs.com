import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import eslint from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/build/**',
      '**/static/**',
      '**/src/tutorials/v8.0.0**',
      '**/src/tutorials/v7.0.0**',
      '.docusaurus',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2023, ...globals.node },
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    settings: { react: { version: 'detect' } },
  },
  { plugins: { '@stylistic': stylistic }, rules: { 'prettier/prettier': ['error', { usePrettierrc: true }] } },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.jsx'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    plugins: { '@typescript-eslint': tseslint.plugin, '@stylistic': stylistic },
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@stylistic/indent': 'off',
      '@stylistic/brace-style': 'off',
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': ['error', { allowProtectedClassPropertyAccess: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrorsIgnorePattern: '^_', ignoreRestSiblings: true }],
    },
  },
  // Disable some rules for specific files based on legacy code or examples
  {
    files: ['docs/examples/**/*/*.js', 'versioned_docs/version-7.x/examples/**/*/*.js'],
    rules: { '@typescript-eslint/no-this-alias': 'off' },
  },
  {
    files: ['src/tutorials/**/*/*.js', 'docs/guides/concepts/scene-graph-order.js'],
    rules: { '@typescript-eslint/no-unused-vars': 'off' },
  },
);
