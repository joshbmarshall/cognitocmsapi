import { acceptHMRUpdate, defineStore } from 'pinia'
import { usePagesStore } from './pages'
import { CognitoPage, CognitoUrlParts } from '~cognito/models/Cognito/Page'

export const usePageStore = defineStore({
  id: 'page',

  state: () => {
    return {
      currentPage: new CognitoPage(),
      title: '',
      metaDescription: '',
      canonical: '',
    }
  },

  actions: {
    setTitle(text: string) {
      this.title = text
    },
    setMetaDescription(text: string) {
      this.metaDescription = text
    },
    setCanonical(canonical: string) {
      this.canonical = canonical
    },
    loadPages(loadUrlAfter?: string | string[]) {
      usePagesStore().loadPages()
        .then((res) => {
          if (loadUrlAfter) {
            this.loadPage(loadUrlAfter)
          }
        })
    },
    loadPage(urlToLoad: string | string[]) {
      const urlParts = new CognitoUrlParts().parse(urlToLoad)
      let page = new CognitoPage()
      if (usePagesStore().pages.length == 0) {
        usePagesStore().initPages()
      }
      if (usePagesStore().pages.length > 0) {
        const pageStorepage = usePagesStore().pages.find(e => urlParts.page_url === e.slug)
        if (pageStorepage?.slug) {
          page = pageStorepage
        }
      } else {
        this.loadPages(urlToLoad)
      }
      if (!page.slug) {
        page.updated_at = 'Need load from server'
      }

      // Set the page from the cached version
      this.currentPage = page

      // Check if there is a newer version
      const page_check_slug = this.currentPage.slug
      setTimeout(() => {
        new CognitoPage().find_one({
          url: urlParts.page_url,
          pb: 1,
        })
          .then((data) => {
            // Check if currentPage has changed since loading (ie navigated to another page)
            if (this.currentPage.slug != page_check_slug) {
              return
            }
            if (data.updated_at != this.currentPage.updated_at) {
              this.currentPage.slug = ''
              this.currentPage = data
              // Update page cache
              usePagesStore().loadPages()
            }
          })
      }, 1000)
    },
  },

  persist: false,
  share: {
    enable: false,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}
