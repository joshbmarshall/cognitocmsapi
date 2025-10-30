import { writeFile } from 'node:fs'
import axios from 'axios'
import { config } from '../src/config.js'

const data = await axios.post(`${config.prodURL}/api/v1/cognito/domain/initialData`, {
  config,
})

writeFile('./src/initialData.json', JSON.stringify(data.data), (err) => {
  if (err) {
    throw err
  }
})

const logo = await axios.get(`${config.baseURL}/cms/cognito/domain/favicon`, {
  responseType: 'arraybuffer', // Important
  headers: {
    'Content-Type': 'application/gzip',
  },
})

writeFile('./public/logo', logo.data, (err) => {
  if (err) {
    throw err
  }
})

writeFile('.graphqlrc', JSON.stringify({
  schema: `${config.baseURL}/graphql`,
}), (err) => {
  if (err) {
    throw err
  }
})

writeFile('tsconfig.json', `{
  "compilerOptions": {
    "target": "ESNext",
    "jsx": "preserve",
    "lib": ["DOM", "ESNext"],
    "baseUrl": ".",
    "module": "ESNext",
    "moduleResolution": "node",
    "paths": {
      "~/*": ["src/*"],
      "~cognito/*": ["cognitocmsapi/*"]
    },
    "resolveJsonModule": true,
    "types": [
      "vitest",
      "vite/client",
      "vue/ref-macros",
      "vite-plugin-pages/client",
      "vite-plugin-vue-layouts/client",
      "vite-plugin-pwa/client",
      "unplugin-vue-macros/macros-global"
    ],
    "allowJs": true,
    "strict": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "plugins": [
      {
        "name": "gql.tada/ts-plugin",
        "schema": "${config.baseURL}/graphql",
        "tadaOutputLocation": "src/graphql-env.d.ts"
      }
    ]
  },
  "vueCompilerOptions": {
    "plugins": [
      "@vue-macros/volar/define-models",
      "@vue-macros/volar/define-slots"
    ]
  },
  "exclude": ["dist", "node_modules", "cypress"]
}\n`, (err) => {
  if (err) {
    throw err
  }
})
