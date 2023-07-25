import { acceptHMRUpdate, defineStore } from 'pinia'

export const useWebpStore = defineStore({
  id: 'webp',

  state: () => {
    return {
      supported: false,
      blank_webp: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAQAFZQOCAYAAAAMAEAnQEqAQABAAEYOCekAANwAP77nMAA',
      tested: false,
    }
  },

  actions: {
    async testWebP(): Promise<boolean> {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img.height == 1)
        img.onerror = () => resolve(false)
        img.src = this.blank_webp
      })
    },
    async isSupported() {
      if (!this.tested) {
        this.supported = await this.testWebP()
        this.tested = true
      }
      return this.supported
    },
  },

  persist: true,
  share: {
    enable: true,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWebpStore, import.meta.hot))
}
