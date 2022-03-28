import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2015',
    outDir: 'dist',
    cssCodeSplit: true,
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      name: 'cognitoapi',
      fileName: 'cognitoapi-lib',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          MyLib: 'cognitoapi',
        },
      },
    },
  },

  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },

  plugins: [
    vue(),

    dts({
      insertTypesEntry: true,
      copyDtsFiles: false,
    }),

    cssInjectedByJsPlugin(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
      ],
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: false,
      directoryAsNamespace: true,
      resolvers: [
        IconsResolver(),
      ],
    }),

    // https://github.com/antfu/unplugin-icons
    Icons(),
  ],
})
