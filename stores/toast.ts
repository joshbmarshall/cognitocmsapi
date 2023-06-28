import { acceptHMRUpdate, defineStore } from 'pinia'
import { nanoid } from 'nanoid'

export const useToastStore = defineStore({
  id: 'toast',

  state: () => {
    return {
      toasts: [],
    }
  },

  actions: {
    addToast(message: string, type: string, timeout: number) {
      const id = nanoid()
      const toast = { message, type, timeout, id }
      this.toasts.push(toast)
      setTimeout(() => {
        // Remove toast
        this.toasts.splice(this.toasts.findIndex(e => e.id == id), 1)
      }, timeout)
    },
  },

  persist: false,
  share: {
    enable: false,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToastStore, import.meta.hot))
}
