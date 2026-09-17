import { configDefaults, coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [...configDefaults.exclude, '**/coverage/**', '**/dist/**'],
    coverage: {
      include: ['src/**/*.ts'],
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
      reporter: ['text', 'html', 'json', 'json-summary', 'lcov'],
      exclude: [...coverageConfigDefaults.exclude, '**/dist/**'],
    },
  },
});
