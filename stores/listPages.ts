import { acceptHMRUpdate, defineStore } from 'pinia'
import { CognitoTime } from '~cognito/models/Cognito/Time'
import { CognitoDomain } from '~cognito/models/Cognito/Domain'
import initialData from '~/initialData.json'
import { $axios } from '~cognito/plugins/axios'
import { CognitoListPage } from '~cognito/models/Cognito/ListPage'

export const useListPagesStore = defineStore('listPages', {
  state: () => {
    return {
      pages: <CognitoListPage[]>[],
      currentDomain: JSON.parse(JSON.stringify(new CognitoDomain())),
      lastUpdate: new CognitoTime('2000-01-01').toDateTimeString(),
    }
  },

  actions: {
    initPages() {
      // this.pages = JSON.parse(JSON.stringify(initialData.pages.data))
      // TODO initialData for pageList
      this.currentDomain = JSON.parse(JSON.stringify(initialData.currentDomain))
    },
    async loadPages() {
      const pageResolver = useListPageResolver()
      if ($axios.isSSR()) {
        this.initPages()
        this.lastUpdate = new CognitoTime('').toDateTimeString()
        return
      }
      this.pages = await pageResolver.loadPages()
      this.currentDomain = await new CognitoDomain().currentDomain()
      this.lastUpdate = new CognitoTime().toDateTimeString()
    },
    async refreshPage(id: number) {
      const pageResolver = useListPageResolver()
      const pageIndex = this.pages.findIndex(page => page.id === id)
      if (pageIndex < 0) {
        return
      }
      this.pages[pageIndex] = await pageResolver.loadPage(this.pages[pageIndex].url)
    },
    findById(id: number): CognitoListPage {
      return new CognitoListPage(JSON.parse(JSON.stringify(this.pages.find(page => page.id === id) || {})))
    },
    findByUrl(url: string): CognitoListPage {
      return new CognitoListPage(JSON.parse(JSON.stringify(this.pages.find(page => page.url === url) || {})))
    },
  },
  persist: true,
  share: {
    enable: true,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListPagesStore, import.meta.hot))
}
