import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

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
