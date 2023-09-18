import { type UserModule } from '~/types'

// https://github.com/antfu/vite-plugin-pwa#automatic-reload-when-new-content-available
export const install: UserModule = ({ isClient, router }) => {
  if (!isClient) {
    return
  }
  const intervalMS = 10 * 60 * 1000
  router.isReady()
    .then(async () => {
      const { registerSW } = await import('virtual:pwa-register')
      registerSW({
        immediate: true,
        onRegisteredSW(swUrl, r) {
          r && setInterval(async () => {
            if (!(!r.installing && navigator)) {
              return
            }

            if (('connection' in navigator) && !navigator.onLine) {
              return
            }

            const resp = await fetch(swUrl, {
              cache: 'no-store',
              headers: {
                'cache': 'no-store',
                'cache-control': 'no-cache',
              },
            })

            if (resp?.status === 200) {
              await r.update()
            }
          }, intervalMS)
        },
      })
    })
    .catch(() => {})
}
