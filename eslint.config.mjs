import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-debugger': 'off',
      'no-console': 'off',
      'class-methods-use-this': 'off',
      'max-lines-per-function': ['error', 40],
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-debugger': 'off',
      'no-console': 'off',
      'class-methods-use-this': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'array',
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            accessors: 'explicit',
            constructors: 'off',
            methods: 'explicit',
            properties: 'explicit',
            parameterProperties: 'explicit',
          },
        },
      ],
      'max-lines-per-function': ['error', 40],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  {
    files: ['**/*.{js,ts}'],
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  prettierConfig,
  {
    ignores: [
      'webpack.config.js',
      'webpack.dev.config.js',
      'webpack.prod.config.js',
      'node_modules/',
      'dist/',
      'eslint.config.js',
    ],
  },
];