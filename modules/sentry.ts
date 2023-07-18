import * as Sentry from '@sentry/vue'
import { type UserModule } from '~/types'

export const install: UserModule = ({ app, router, isClient }) => {
  if (isClient && import.meta.env.PROD) {
    Sentry.init({
      app,
      dsn: 'https://23f886af5a544d3b9984f87eb3862fda@sentry.jm1.me/5',
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        }),
        new Sentry.Replay(),
      ],
      tracesSampleRate: 0.5,
      tracePropagationTargets: ['localhost', 'my-site-url.com', /^\//],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    })
  }
}
