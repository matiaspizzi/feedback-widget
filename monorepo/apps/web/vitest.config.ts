import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@lib': path.resolve(__dirname, './lib'),
      '@tests': path.resolve(__dirname, './tests'),
      '@services': path.resolve(__dirname, './services'),
      '@repositories': path.resolve(__dirname, './repositories'),
      '@auth': path.resolve(__dirname, './auth.ts'),
    },
  },
});