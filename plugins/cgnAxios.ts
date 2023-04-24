import type { Axios, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { Router } from 'vue-router'
import { nanoid } from 'nanoid'
import { baseURL } from '~/config'
import { CognitoUser } from '~cognito/models/Cognito/User'
import { useUserStore } from '~cognito/stores/user'
import { useCartStore } from '~cognito/stores/cart'

const urls = {
  login: '/api/v1/cognito/user/login',
  logout: '/api/v1/cognito/user/logout',
  refresh: '/api/v1/cognito/user/refreshToken',
  user: '/api/v1/cognito/user/authUser',
}

const ignoredPaths = [
  urls.login,
  urls.refresh,
  '/authtoken',
]

class CgnAxios {
  userStore: any
  axios: Axios
  useCart: boolean
  clientId: string
  baseURL: string

  constructor(settings: {
    clientId?: string
    baseURL?: string
    userStore?: any
    useCart?: boolean
  }) {
    if (typeof (settings.useCart) == 'undefined') {
      settings.useCart = false
    }
    this.useCart = settings.useCart

    if (!settings.clientId) {
      settings.clientId = ''
    }

    this.clientId = settings.clientId
    this.baseURL = settings.baseURL ? settings.baseURL : baseURL

    this.userStore = settings.userStore

    if (!settings.userStore) {
      settings.userStore = useUserStore
    }

    this.userStore = settings.userStore

    this.axios = axios.create({
      baseURL: this.baseURL,
    })

    this.axios.interceptors.request.use(
      (request) => {
        if (this.userStore().access_token) {
          const isIgnored = ignoredPaths.some(path => request.url.includes(path))
          if (request.url.startsWith('http')) {
            // do not add auth header
          } else if (isIgnored) {
            // do not add auth header
          } else {
            request.headers.Authorization = `Bearer ${this.userStore().access_token}`
          }
        }
        return request
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    this.axios.interceptors.response.use(

      (response) => {
        return response
      },
      async (error) => {
        const isIgnored = ignoredPaths.some(path => error.config.url.includes(path))

        // get the status code from the response
        const statusCode = error.response ? error.response.status : -1
        if ((statusCode === 401 || statusCode === 422) && !isIgnored) {
          // API should return a reason for the error, represented here by the text_code property

          // Example API response:
          // {
          //   text_code: 'TOKEN_EXPIRED',
          // }

          // retrieve the text_code property from the response, or default to null
          const { data: { text_code } = { text_code: null } } = error.response || {}

          // get the refresh token from the state if it exists
          const refreshToken = this.userStore().refresh_token

          // determine if the error is a result of an expired access token
          // also ensure that the refresh token is present
          if (text_code === 'TOKEN_EXPIRED' && refreshToken) {
            try {
              // attempt to refresh access token using refresh token
              await this.doRefresh()

              // re-run the initial request using the new request config after a successful refresh
              // this response will be returned to the initial calling method
              return this.axios.request({
                method: error.response.config.method,
                url: error.response.config.url,
                headers: error.response.config.headers,
                data: error.response.config.data,
                params: error.response.config.params,
              })
            } catch (e) {
              // catch any error while refreshing the token
              await this.logout()

              // redirect the user home
              window.location = '/'
              return
            }
          } else if (text_code === 'TOKEN_INVALID') {
            // catch any other JWT-related error (i.e. malformed token) and logout the user
            await this.logout()

            // redirect the user home
            window.location = '/'
            return
          }
        }

        // ignore all other errors, let component or other error handlers handle them
        return Promise.reject(error)
      })
  }

  oauth2AuthorizeUrl(siteurl?: string, redirect_uri?: string) {
    if (!redirect_uri) {
      redirect_uri = '/auth'
    }
    if (!siteurl) {
      siteurl = '/authorize'
    }
    redirect_uri = window.location.origin + redirect_uri
    siteurl = this.baseURL + siteurl
    const nonce = nanoid()
    const state = nanoid()
    this.userStore().oauth2_state = state
    return `${siteurl}?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=all&state=${state}&nonce=${nonce}`
  }

  async oauth2GetToken(code?: string, state?: string, sitepath?: string) {
    if (!sitepath) {
      sitepath = '/authtoken'
    }
    // Check state matches
    if (state != this.userStore().oauth2_state) {
      alert('Bad state please try again')
      return false
    }
    const res = await this.axios.post(this.baseURL + sitepath, {
      grant_type: 'authorization_code',
      code,
      client_id: this.clientId,
    })
    this.userStore().setAccessToken(res.data.access_token)
    this.userStore().setRefreshToken(res.data.refresh_token)
    return res
  }

  async logout() {
    await this.axios.get(urls.logout)
    this.userStore().logout()
    if (this.useCart) {
      useCartStore().getCart()
    }
  }

  setRedirectAfterLogin(path: string) {
    this.userStore().setRedirectAfterLogin(path)
  }

  async doRefresh() {
    const refresh_token = this.userStore().refresh_token

    // make an API call using the refresh token to generate an access tokens
    const tokens = await this.axios.post(urls.refresh, {
      refresh_token,
    })

    this.userStore().setAccessToken(tokens.data.access_token)
    this.userStore().setRefreshToken(tokens.data.refresh_token)
  }

  isLoggedIn(): boolean {
    return !!this.userStore().access_token
  }

  async getUser() {
    const user = await new CognitoUser().getLoggedInUser(this)
    this.userStore().setUser(user)
  }

  async login(username: string, password: string, router: Router) {
    const userStore = this.userStore()
    try {
    // make an API call to login the user with an email address and password
      const tokens = await this.axios.post(urls.login, {
        username,
        password,
      })
      userStore.setAccessToken(tokens.data.access_token)
      userStore.setRefreshToken(tokens.data.refresh_token)
      await this.getUser()
      router.push(userStore.redirect_after_login)
      if (this.useCart) {
        useCartStore().mergeCart()
      }
    } catch (error) {
      return false
    }
    if (this.useCart) {
      useCartStore().getCart()
    }
    return true
  }

  async tokenlogin() {
    const access_token = new URL(location.href).searchParams.get('a')
    const refresh_token = new URL(location.href).searchParams.get('r')
    if (access_token && refresh_token) {
      const userStore = this.userStore()
      userStore.setRefreshToken(refresh_token)
      userStore.setAccessToken(access_token)
      await this.getUser()
      window.location = '/'
    }
  }

  get(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return this.axios.get(url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig<any> | undefined) {
    return this.axios.post(url, data, config)
  }
}

export { CgnAxios }
