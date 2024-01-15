import type { Axios, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { Router } from 'vue-router'
import { nanoid } from 'nanoid'
import jwt_decode from 'jwt-decode'
import { GraphQLClient } from 'graphql-request'
import { config } from '~/config'
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
  lastRequestAt: number
  ready: boolean

  constructor(settings: {
    clientId?: string
    baseURL?: string
    userStore?: any
    useCart?: boolean
  }) {
    this.ready = false
    if (typeof (settings.useCart) == 'undefined') {
      settings.useCart = false
    }
    this.useCart = settings.useCart

    if (!settings.clientId) {
      settings.clientId = ''
    }

    this.clientId = settings.clientId
    this.baseURL = settings.baseURL ? settings.baseURL : config.baseURL

    this.userStore = settings.userStore

    if (!settings.userStore) {
      settings.userStore = useUserStore
    }

    this.userStore = settings.userStore

    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: 50000,
    })

    this.lastRequestAt = Date.now()

    this.axios.interceptors.request.use(
      async (request) => {
        const isIgnored = ignoredPaths.some(path => request.url.includes(path))
        if (!isIgnored) {
          while (!this.ready) {
            // wait for api to become ready
            await new Promise(r => setTimeout(r, 100))
          }
        }
        request.baseURL = this.baseURL
        if (this.userStore().baseURL) {
          request.baseURL = this.userStore().baseURL
        }
        if (this.userStore().access_token) {
          if (isIgnored) {
            // do not add auth header
          } else {
            request.headers.Authorization = `Bearer ${this.userStore().access_token}`
          }
        }
        // Rate limit
        const minBetween = this.isSSR() ? 500 : 50
        const now = Date.now()
        this.lastRequestAt += minBetween
        if (this.lastRequestAt < now) {
          this.lastRequestAt = now
        }
        const delay = this.lastRequestAt - now
        if (this.isSSR()) {
          console.log({ url: request.url, delay })
        }
        return new Promise((resolve) => {
          setTimeout(
            () => resolve(request),
            delay,
          )
        })
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    this.axios.interceptors.response.use(

      (response) => {
        this.userStore().link_active = true
        return response
      },
      async (error) => {
        const isIgnored = ignoredPaths.some(path => error.config.url.includes(path))

        // get the status code from the response
        const statusCode = error.response ? error.response.status : -1

        // Report disconnection from server
        this.userStore().link_active = statusCode !== -1

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
          } else if (text_code === 'TOKEN_INVALID' || text_code === 'Signature verification failed') {
            // catch any other JWT-related error (i.e. malformed token) and logout the user
            await this.logout()

            // redirect the user home
            window.location = '/'
            return
          }
        }

        // Pass through all other errors, let component or other error handlers handle them
        throw error
      },
    )

    setInterval(() => {
      this.checkRefresh()
    }, 10000)
    this.checkRefresh()
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

  setBaseUrl(baseURL: string) {
    this.baseURL = baseURL
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

  async checkRefresh() {
    let access_token = ''
    try {
      access_token = this.userStore().access_token
    } catch (error) {
      // Pinia store not yet initialised, check again shortly.
      // This is so we can unlock startup requests waiting for a valid token
      setTimeout(() => {
        this.checkRefresh()
      }, 100)
      return
    }

    try {
      const decoded = jwt_decode(access_token)
      if (!decoded?.exp) {
        this.ready = true
        return
      }
      const expires_in = decoded.exp - Math.floor(Date.now() / 1000)
      // console.log({ expires_in })
      if (expires_in > 30) {
        this.ready = true
        return
      }
      // Renew the token as it will expire in 30 seconds
      await this.doRefresh()
    } catch (error) {
      // Probably not logged on
      this.ready = true
    }
  }

  async doRefresh() {
    console.log('doing refresh')
    const refresh_token = this.userStore().refresh_token
    const fingerprint = this.userStore().getAuthFingerprint()

    // make an API call using the refresh token to generate an access tokens
    const tokens = await this.axios.post(urls.refresh, {
      refresh_token,
      fingerprint,
    })

    this.userStore().setAccessToken(tokens.data.access_token)
    this.userStore().setRefreshToken(tokens.data.refresh_token)
    this.ready = true
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
    const fingerprint = this.userStore().getAuthFingerprint()
    try {
    // make an API call to login the user with an email address and password
      const tokens = await this.axios.post(urls.login, {
        username,
        password,
        fingerprint,
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

  async tokenlogin(access_token = '', refresh_token = '') {
    if (!access_token) {
      access_token = new URL(location.href).searchParams.get('a') || ''
    }
    if (!refresh_token) {
      refresh_token = new URL(location.href).searchParams.get('r') || ''
    }

    const userStore = this.userStore()
    let redirectTo = userStore.redirect_after_login || '/'
    if (window.location.host === 'www.qldraceways.com.au' || window.location.host === 'www.hamptondowns.com') {
      redirectTo = `/enter/#${userStore.redirect_after_login || '/profile'}`
    }

    if (access_token && refresh_token) {
      userStore.setRefreshToken(refresh_token)
      userStore.setAccessToken(access_token)
      await this.getUser()
      if (this.useCart) {
        await useCartStore().mergeCart()
      }

      userStore.redirect_after_login = ''
    }
    if (this.isLoggedIn()) {
      nextTick(() => {
        window.location = redirectTo
      })
    }
  }

  get(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return this.axios.get(url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig<any> | undefined) {
    return this.axios.post(url, data, config)
  }

  isSSR(): boolean {
    return import.meta.env?.SSR
  }

  async graphql(query: string, variables?: any) {
    while (!this.ready) {
      // Wait for api to become ready
      await new Promise(r => setTimeout(r, 100))
    }
    const endpoint = `${this.baseURL}/graphql`
    const access_token = useUserStore().access_token
    const headers = access_token
      ? {
          authorization: `Bearer ${access_token}`,
        }
      : {}

    const graphQLClient = new GraphQLClient(endpoint, {
      headers,
    })

    return graphQLClient.request(query, variables)
      .catch(async (e) => {
        if (e.response.status === 401 || e.response.status === 422) {
          await this.doRefresh()
          return this.graphql(query, variables)
        }
        console.log(e.message)
        return e.response.data
      })
  }
}

export { CgnAxios }
