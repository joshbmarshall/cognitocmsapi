import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import { type UserModule } from '~/types'

export const install: UserModule = ({ app, router, isClient }) => {
  if (isClient && import.meta.env.PROD) {
    Sentry.init({
      app,
      dsn: 'https://23f886af5a544d3b9984f87eb3862fda@sentry.jm1.me/5',
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracePropagationTargets: ['localhost', 'my-site-url.com', /^\//],
        }),
      ],
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 0.5,
    })
  }
}
