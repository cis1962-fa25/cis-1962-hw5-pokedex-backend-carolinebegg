import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

// TypeScript support
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default defineConfig([
  // JS files (if you have any)
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, unicorn: eslintPluginUnicorn },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Backend → Node, not browser
      globals: globals.node,
    },
    rules: {
      // eslint base rules
      'no-lonely-if': 'error',
      eqeqeq: 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'no-unused-vars': 'warn',
      'consistent-return': 'off',

      // unicorn
      'unicorn/consistent-destructuring': 'error',
      'unicorn/error-message': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/prefer-ternary': 'error',
    },
  },

  // TypeScript files in src/
  {
    files: ['src/**/*.{ts,tsx}'],
    // use TS parser + plugin
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin,
      unicorn: eslintPluginUnicorn,
    },
    // You can’t use string "extends" in flat config for TS plugin,
    // so we just add rules directly.
    rules: {
      // same style rules as above
      'no-lonely-if': 'error',
      eqeqeq: 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'consistent-return': 'off',

      'unicorn/consistent-destructuring': 'error',
      'unicorn/error-message': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/prefer-ternary': 'error',

      // TS-specific rule to replace base no-unused-vars
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
]);
