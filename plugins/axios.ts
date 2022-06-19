import axios from 'axios'
import type { Router } from 'vue-router'
import { baseURL, sitename } from '~/config'
import { useUserStore } from '~cognito/stores/user'
import { useCartStore } from '~cognito/stores/cart'
import { CognitoUser } from '~cognito/models/Cognito/User'

const $axios = axios.create({
  baseURL,
})

const urls = {
  login: '/api/v1/cognito/user/login',
  logout: '/api/v1/cognito/user/logout',
  refresh: '/api/v1/cognito/user/refreshToken',
  user: '/api/v1/cognito/user/authUser',
}

const ignoredPaths = [
  urls.login,
  urls.logout,
  urls.refresh,
]

const isLoggedIn = () => {
  return !!useUserStore().access_token
}

const logout = async () => {
  useUserStore().logout()
  await $axios.get(urls.logout)
  useCartStore().getCart()
}

const setRedirectAfterLogin = (path: string) => {
  useUserStore().setRedirectAfterLogin(path)
}

const doRefresh = async () => {
  const userStore = useUserStore()
  const refresh_token = userStore.refresh_token

  // make an API call using the refresh token to generate a access tokens
  const tokens = await $axios.post(urls.refresh, {
    refresh_token,
  })

  userStore.setAccessToken(tokens.data.access_token)
  userStore.setRefreshToken(tokens.data.refresh_token)
}
const getUser = async () => {
  const user = await new CognitoUser().getLoggedInUser()
  useUserStore().setUser(user)
}

const login = async (username: string, password: string, router: Router) => {
  const userStore = useUserStore()
  const cartStore = useCartStore()
  try {
    // make an API call to login the user with an email address and password
    const tokens = await $axios.post(urls.login, {
      username,
      password,
    })
    userStore.setAccessToken(tokens.data.access_token)
    userStore.setRefreshToken(tokens.data.refresh_token)
    await getUser()
    router.push(userStore.redirect_after_login)
    cartStore.mergeCart()
  } catch (error) {
    return false
  }
  cartStore.getCart()
  return true
}

$axios.interceptors.request.use(
  (request) => {
    const access_token = useUserStore().access_token
    if (access_token) {
      const isIgnored = ignoredPaths.some(path => request.url.includes(path))
      if (request.url.startsWith('http')) {
        // do not add auth header
      } else if (isIgnored) {
        // do not add auth header
      } else {
        request.headers.Authorization = `Bearer ${access_token}`
      }
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

$axios.interceptors.response.use(

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
      const refreshToken = useUserStore().refresh_token

      // determine if the error is a result of an expired access token
      // also ensure that the refresh token is present
      if (text_code === 'TOKEN_EXPIRED' && refreshToken) {
        try {
          // attempt to refresh access token using refresh token
          await doRefresh()

          // re-run the initial request using the new request config after a successful refresh
          // this response will be returned to the initial calling method
          return $axios.request({
            method: error.response.config.method,
            url: error.response.config.url,
            headers: error.response.config.headers,
            data: error.response.config.data,
            params: error.response.config.params,
          })
        } catch (e) {
          // catch any error while refreshing the token
          await logout()

          // redirect the user home
          window.location = '/'
          return
        }
      } else if (text_code === 'TOKEN_INVALID') {
        // catch any other JWT-related error (i.e. malformed token) and logout the user
        await logout()

        // redirect the user home
        window.location = '/'
        return
      }
    }

    // ignore all other errors, let component or other error handlers handle them
    return Promise.reject(error)
  })

const setTitle = (suffix: string) => {
  useHead({ title: `${sitename} | ${suffix}` })
}

export {
  $axios,
  login,
  logout,
  isLoggedIn,
  setRedirectAfterLogin,
  getUser,
  setTitle,
}
