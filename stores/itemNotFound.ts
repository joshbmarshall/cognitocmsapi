import { acceptHMRUpdate, defineStore } from 'pinia'

// Set by item-level page builder templates (eg blog article) when the item in
// the URL does not exist, so the page builder router can show the 404 page.
export const useItemNotFoundStore = defineStore({
  id: 'itemNotFound',
  state: () => {
    return {
      url: '',
    }
  },

  actions: {
    set(url: string) {
      this.url = url
    },
    clear() {
      this.url = ''
    },
  },

  persist: false,
  share: {
    enable: false,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useItemNotFoundStore, import.meta.hot))
}
