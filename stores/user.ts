import { acceptHMRUpdate, defineStore } from 'pinia'
import { nanoid } from 'nanoid'

export const useUserStore = defineStore('user', () => {
  const route = useRoute()
  const router = useRouter()

  const access_token = ref('')
  const refresh_token = ref('')
  const redirect_after_login = ref('')
  const oauth2_state = ref('')
  const auth_fingerprint = ref('')
  const user = ref({
    id: 0,
    first_name: '',
    last_name: '',
    is_admin: false,
    email: '',
    mobile_phone: '',
    date_of_birth: '',
    current_address_id: 0,
    image: '',
    thumbnail: '',
    company_name: '',
    company_phone: '',
    trading_name: '',
    abn: null,
    website: null,
    facebook_link: null,
    drivers_licence_number: '',
    drivers_licence_expiry: '',
    drivers_licence_state_of_issue_id: 0,
    emergency_contact_name: '',
    emergency_contact_phone: '',
  })
  const link_active = ref(true)
  const baseURL = ref('')

  const getAuthFingerprint = (): string => {
    if (!auth_fingerprint.value) {
      auth_fingerprint.value = nanoid()
    }
    return auth_fingerprint.value
  }
  const setAccessToken = (token: string) => {
    access_token.value = token
  }
  const setRefreshToken = (token: string) => {
    refresh_token.value = token
  }
  const setRedirectAfterLogin = (path: string) => {
    redirect_after_login.value = path
  }
  const logout = () => {
    access_token.value = ''
    refresh_token.value = ''
    user.value = {
      id: 0,
      first_name: '',
      last_name: '',
      is_admin: false,
      email: '',
      mobile_phone: '',
      date_of_birth: '',
      current_address_id: 0,
      image: '',
      thumbnail: '',
      company_name: '',
      company_phone: '',
      trading_name: '',
      abn: null,
      website: null,
      facebook_link: null,
      drivers_licence_number: '',
      drivers_licence_expiry: '',
      drivers_licence_state_of_issue_id: 0,
      emergency_contact_name: '',
      emergency_contact_phone: '',
    }
  }
  const isLoggedIn = (): boolean => {
    if (!user.value.id) {
      logout()
    }
    return !!access_token.value
  }
  const checkLoggedIn = () => {
    if (isLoggedIn()) {
      return
    }
    setRedirectAfterLogin(route.fullPath)
    router.replace('/login')
  }

  return { access_token, refresh_token, redirect_after_login, auth_fingerprint, oauth2_state, user, link_active, baseURL, getAuthFingerprint, setAccessToken, setRefreshToken, setRedirectAfterLogin, logout, isLoggedIn, checkLoggedIn }
}, {
  persist: true,
  share: {
    enable: true,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
