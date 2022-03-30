import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'cognitoapi',
      fileName: format => `cognitoapi.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },

  resolve: {
    alias: {
      '~/': new URL('./src/', import.meta.url).pathname,
    },
  },

  plugins: [
    vue(),

    cssInjectedByJsPlugin(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
      ],
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      // dts: false,
      directoryAsNamespace: true,
      resolvers: [
        IconsResolver(),
      ],
    }),

    // https://github.com/antfu/unplugin-icons
    Icons(),
  ],
})
