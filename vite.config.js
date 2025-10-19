import { defineConfig } from 'vite';
import path from 'path';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'js/pages/index.js'),
        listMembers: path.resolve(__dirname, 'js/listMembers.js'),
        stylesMain: path.resolve(__dirname, 'src/pages/index.scss'),
        stylesListMembers: path.resolve(__dirname, 'src/pages/listMembers.scss'
        ),
      },
    },
  },
  server: {
    open: true,
  },
  plugins: [
    inject({
      jQuery: 'jquery',
    }),
  ],
  optimizeDeps: {
    include: ['jquery'],
  },
});
