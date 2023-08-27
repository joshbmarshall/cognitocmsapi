import { acceptHMRUpdate, defineStore } from 'pinia'

export const useAVIFStore = defineStore({
  id: 'avif',

  state: () => {
    return {
      supported: false,
      blank_avif: 'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAPBtZXRhAAAAAAAAAChoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAbGliYXZpZgAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAEUAAAAFQAAAChpaW5mAAAAAAABAAAAGmluZmUCAAAAAAEAAGF2MDFDb2xvcgAAAABoaXBycAAAAElpcGNvAAAAFGlzcGUAAAAAAAAAAQAAAAEAAAAOcGl4aQAAAAABCAAAAAxhdjFDgQAcAAAAABNjb2xybmNseAABAAEAAQAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB1tZGF0EgAKBxgADlgICAkyCB/xgAAghQm0',
      tested: false,
    }
  },

  actions: {
    async testAVIF(): Promise<boolean> {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img.height == 1)
        img.onerror = () => resolve(false)
        img.src = this.blank_avif
      })
    },
    async isSupported() {
      if (!this.tested) {
        this.supported = await this.testAVIF()
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
  import.meta.hot.accept(acceptHMRUpdate(useAVIFStore, import.meta.hot))
}
