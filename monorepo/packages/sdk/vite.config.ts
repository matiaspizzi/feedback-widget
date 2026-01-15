import { defineConfig, type PluginOption } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    tsconfigPaths() as PluginOption,
    dts({ insertTypesEntry: true }) as PluginOption
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FeedbackSDK',
      fileName: (format) => `feedback-sdk.${format}.js`,
      formats: ['es', 'umd'],
    },
  },
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
  },
});