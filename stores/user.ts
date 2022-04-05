import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',

  state: () => {
    return {
      access_token: '',
      refresh_token: '',
      redirect_after_login: '/',
      user: {},
    }
  },

  actions: {
    setAccessToken(token: string) {
      this.access_token = token
    },
    setRefreshToken(token: string) {
      this.refresh_token = token
    },
    setUser(user: any) {
      this.user = user
    },
    setRedirectAfterLogin(path: string) {
      this.redirect_after_login = path
    },
    logout() {
      this.access_token = ''
      this.refresh_token = ''
      this.user = {
        id: 0,
        first_name: '',
        last_name: '',
        email: '',
        mobile_phone: '',
      }
    },
  },

  persist: true,
  share: {
    enable: true,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
