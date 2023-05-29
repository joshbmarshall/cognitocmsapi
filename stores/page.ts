import { acceptHMRUpdate, defineStore } from 'pinia'
import { usePagesStore } from './pages'
import { CognitoPage } from '~cognito/models/Cognito/Page'
import pagebuilderdata from '~/pagebuilderdata.json'

export const usePageStore = defineStore({
  id: 'page',

  state: () => {
    return {
      currentPage: new CognitoPage(),
    }
  },

  actions: {
    loadPages(loadUrlAfter?: string | string[]) {
      usePagesStore().loadPages()
        .then((res) => {
          if (loadUrlAfter) {
            this.loadPage(loadUrlAfter)
          }
        })
    },
    setCurrentPageUrlFragments(urlToLoad: string | string[]) {
      this.setCurrentPageFullUrl(urlToLoad)
      this.currentPage.item_url = this.getUrlParameter(urlToLoad, 1)
      this.currentPage.url_parameter_2 = this.getUrlParameter(urlToLoad, 2)
      this.currentPage.url_parameter_3 = this.getUrlParameter(urlToLoad, 3)
    },
    loadPage(urlToLoad: string | string[]) {
      const url = this.resolveurlpath(urlToLoad)
      let page = pagebuilderdata.data?.find(e => e.slug == url)
      if (!page?.slug) {
        page = {}
      }
      if (usePagesStore().pages.length > 0) {
        const pageStorepage = usePagesStore().pages.find(e => url === e.slug)
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
      this.setCurrentPageUrlFragments(urlToLoad)

      // Check if there is a newer version
      const page_check_slug = this.currentPage.slug
      setTimeout(() => {
        new CognitoPage().find_one({
          url,
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
              this.setCurrentPageUrlFragments(urlToLoad)
              // Update page cache
              usePagesStore().loadPages()
            }
          })
      }, 1000)
    },
    setCurrentPageFullUrl(url: string | string[]) {
      if (typeof (url) === 'string') {
        this.currentPage.full_url = `/${url}`
        return
      }
      this.currentPage.full_url = `/${url.join('/')}`
    },
    getUrlParameter(url: string | string[], parameter_number: number): string {
      if (typeof (url) === 'string') {
        if (parameter_number) {
          return ''
        }
        return url
      }
      if (parameter_number > url.length) {
        return ''
      }
      return url[parameter_number]
    },
    resolveurlpath(url: string | string[]): string {
      return this.getUrlParameter(url, 0)
    },
    getItemFromUrl(url: string | string[]): string {
      return this.getUrlParameter(url, 1)
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
