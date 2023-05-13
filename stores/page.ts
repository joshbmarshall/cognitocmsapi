import { acceptHMRUpdate, defineStore } from 'pinia'
import { CognitoPage } from '~cognito/models/Cognito/Page'

export const usePageStore = defineStore({
  id: 'page',

  state: () => {
    return {
      pages: <CognitoPage[]>[],
    }
  },

  actions: {
    async loadPages() {
      this.pages = await new CognitoPage().loadPages()
    },
  },

  persist: true,
  share: {
    enable: true,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}
