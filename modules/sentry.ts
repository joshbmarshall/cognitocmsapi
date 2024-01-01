import * as Sentry from '@sentry/vue'
import type { UserModule } from '~/types'
import { config } from '~/config'

export const install: UserModule = ({ app, isClient }) => {
  if (!isClient) {
    return
  }

  if (!config.sentryDsn) {
    return
  }
  Sentry.init({
    app,
    dsn: config.sentryDsn,
    release: import.meta.env.VITE_RELEASE,
  })
}
