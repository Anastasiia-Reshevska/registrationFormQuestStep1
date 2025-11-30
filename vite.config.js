import { defineConfig } from 'vite';
import path from 'path';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  root: '.',
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'import',
          'color-functions',
          'legacy-js-api',
          'global-builtin',
          'slash-div',
        ],
      },
    },
  },
  build: {
    manifest: true,
    outDir: 'dist',
    assetsDir: '.',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/js/pages/index.js'),
        listMembers: path.resolve(__dirname, 'src/js/pages/listMembers.js'),
        stylesMain: path.resolve(__dirname, 'src/scss/pages/index.scss'),
        stylesListMembers: path.resolve(__dirname,'src/scss/pages/listMembers.scss'),
        index: path.resolve(__dirname, 'index.html'),
        usersTable: path.resolve(__dirname, 'usersTable.html'),
      },
    },
    output: {
      entryFileNames: '[name]',
      assetFileNames: '[name].[ext]',
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    open: true,
  },
  plugins: [
    inject({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  optimizeDeps: {
    include: ['jquery'],
  },
});

