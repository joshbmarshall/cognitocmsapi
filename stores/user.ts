import { acceptHMRUpdate, defineStore } from 'pinia'
import { nanoid } from 'nanoid'

export const useUserStore = defineStore({
  id: 'user',

  state: () => {
    return {
      access_token: '',
      refresh_token: '',
      redirect_after_login: '/',
      oauth2_state: '',
      auth_fingerprint: '',
      user: {
        id: 0,
        first_name: '',
        last_name: '',
        is_admin: false,
        email: '',
        mobile_phone: '',
      },
    }
  },

  actions: {
    getAuthFingerprint(): string {
      if (!this.auth_fingerprint) {
        this.auth_fingerprint = nanoid()
      }
      return this.auth_fingerprint
    },
    setAccessToken(token: string) {
      this.access_token = token
    },
    setRefreshToken(token: string) {
      this.refresh_token = token
    },
    setUser(user: any) {
      this.user = JSON.parse(JSON.stringify(user))
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
        is_admin: false,
        email: '',
        mobile_phone: '',
      }
    },
    isLoggedIn(): boolean {
      return !!this.user.id
    },
    checkLoggedIn() {
      if (this.isLoggedIn()) {
        return
      }
      this.setRedirectAfterLogin(useRoute().fullPath)
      useRouter().replace('/login')
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
