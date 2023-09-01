import { acceptHMRUpdate, defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import jwt_decode from 'jwt-decode'

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
      link_active: true,
    }
  },

  actions: {
    getAuthFingerprint(): string {
      if (!this.auth_fingerprint) {
        this.auth_fingerprint = nanoid()
      }
      return this.auth_fingerprint
    },
    setAccessToken(token: string, renewCallback?: CallableFunction) {
      this.access_token = token
      if (!renewCallback) {
        return
      }
      const decoded = jwt_decode(token)
      if (!decoded?.exp) {
        return
      }
      const expires_in = decoded.exp - Math.floor(Date.now() / 1000)
      const renew_at = expires_in - (10 + Math.random() * 30)
      if (renew_at > 0) {
        setTimeout(() => {
          renewCallback()
        }, renew_at * 1000)
      }
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
      if (!this.user.id) {
        this.logout()
      }
      return !!this.access_token
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
