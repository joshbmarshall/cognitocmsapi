import { acceptHMRUpdate, defineStore } from 'pinia'
import { CognitoTime } from '~cognito/models/Cognito/Time'

export const useNewsletterStore = defineStore({
  id: 'newsletter',

  state: () => {
    return {
      hideUntil: new CognitoTime('').toDateTimeString(),
    }
  },

  actions: {
    shouldIshow(): boolean {
      return new CognitoTime(this.hideUntil).isPast()
    },
    recordOpened(minutes: number) {
      this.hideUntil = new CognitoTime('').addMinutes(minutes).toDateTimeString()
    },
  },

  persist: true,
  share: {
    enable: true,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNewsletterStore, import.meta.hot))
}
