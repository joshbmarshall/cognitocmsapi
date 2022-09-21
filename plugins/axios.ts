import type { Router } from 'vue-router'
import { sitename } from '~/config'
import { useUserStore } from '~cognito/stores/user'

import { CgnAxios } from '~cognito/plugins/cgnAxios'

const $axios = new CgnAxios({})

const setRedirectAfterLogin = (path: string) => {
  useUserStore().setRedirectAfterLogin(path)
}

const isLoggedIn = () => {
  return $axios.isLoggedIn()
}

const logout = () => {
  return $axios.logout()
}

const login = async (username: string, password: string, router: Router) => {
  return $axios.login(username, password, router)
}

const getUser = () => {
  return $axios.getUser()
}

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
