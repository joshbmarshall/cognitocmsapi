import { acceptHMRUpdate, defineStore } from 'pinia'
import { CognitoPage } from '~cognito/models/Cognito/Page'
import { CognitoTime } from '~cognito/models/Cognito/Time'

export const usePagesStore = defineStore({
  id: 'pages',

  state: () => {
    return {
      pages: <CognitoPage[]>[],
      lastUpdate: new CognitoTime('2000-01-01').toDateTimeString(),
    }
  },

  actions: {
    async loadPages() {
      const data = await new CognitoPage().find_many({
        page_size: 100,
        pb: 1,
      })
      this.pages = data.data
      this.lastUpdate = new CognitoTime('').toDateTimeString()
    },
    findById(id): CognitoPage {
      return new CognitoPage(this.pages.find(e => e.id == id))
    },
  },

  persist: true,
  share: {
    enable: true,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePagesStore, import.meta.hot))
}
