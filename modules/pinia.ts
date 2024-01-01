import { createPinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { UserModule } from '~/types'

// Setup Pinia
// https://pinia.vuejs.org/
export const install: UserModule = ({ isClient, initialState, app }) => {
  const pinia = createPinia()
  if (isClient) {
    pinia.use(PiniaSharedState({
      // Enables the plugin for all stores. Defaults to true.
      enable: true,
      // If set to true this tab tries to immediately recover the shared state from another tab. Defaults to true.
      initialize: true,
    }))
    pinia.use(piniaPluginPersistedstate)
  }
  app.pinia = pinia // Record for custom elements
  app.use(pinia)
  // Refer to
  // https://github.com/antfu/vite-ssg/blob/main/README.md#state-serialization
  // for other serialization strategies.
  return
  if (isClient) {
    pinia.state.value = (initialState.pinia) || {}
  } else {
    initialState.pinia = pinia.state.value
  }
}
