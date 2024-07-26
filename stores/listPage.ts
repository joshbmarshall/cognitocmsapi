import { acceptHMRUpdate, defineStore } from 'pinia'
import { CognitoUrlParts } from '~cognito/models/Cognito/Page'
import { $axios } from '~cognito/plugins/axios'
import { CognitoListPage } from '~cognito/models/Cognito/ListPage'

export const useListPageStore = defineStore('listPage', {
  state: () => {
    return {
      currentPage: new CognitoListPage(),
    }
  },

  actions: {
    async loadPages(loadUrlAfter?: string | string[]) {
      const pagesStore = useListPagesStore()
      await pagesStore.loadPages()
      if (!loadUrlAfter) {
        return
      }
      this.loadPage(loadUrlAfter)
    },
    async refreshPage(page_id: number) {
      const pagesStore = useListPagesStore()
      await pagesStore.refreshPage(page_id)
      if (page_id != this.currentPage.id) {
        return
      }
      this.currentPage = pagesStore.findById(this.currentPage.id)
    },
    loadPage(urlToLoad: string | string[]) {
      const pagesStore = useListPagesStore()
      const urlParts = new CognitoUrlParts().parse(urlToLoad)
      let page = new CognitoListPage()
      if (pagesStore.pages.length == 0) {
        pagesStore.initPages()
      }
      if (pagesStore.pages.length > 0) {
        const pageStorepage = pagesStore.findByUrl(urlParts.page_url)
        if (pageStorepage.url) {
          page = pageStorepage
        }
      } else {
        this.loadPages(urlToLoad)
      }
      if (!page.url) {
        page.updated_at = 'Need load from server'
      }

      // Set the page from the cached version
      this.currentPage = page
      if ($axios.isSSR()) {
        return
      }
      const pageResolver = useListPageResolver()
      // Check if there is a newer version
      const page_check_url = this.currentPage.url
      setTimeout(async () => {
        const page = await pageResolver.loadPage(urlParts.page_url)
        // Check if currentPage has changed since loading (ie navigated to another page)
        if (this.currentPage.url != page_check_url) {
          return
        }
        if (page.updated_at != this.currentPage.updated_at) {
          this.currentPage.url = ''
          this.currentPage = page
          pagesStore.loadPages()
        }
      }, 1000)
    },
  },

  persist: false,
  share: {
    enable: false,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListPageStore, import.meta.hot))
}
