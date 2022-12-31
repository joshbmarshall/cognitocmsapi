import type { Router } from 'vue-router'
import { isEcommerce, sitename } from '~/config'
import { useUserStore } from '~cognito/stores/user'

import { CgnAxios } from '~cognito/plugins/cgnAxios'

const $axios = new CgnAxios({ useCart: isEcommerce })

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

const relogin = (loginurl: string, redirect_after_login: string, router: Router) => {
  const userStore = useUserStore()
  userStore.redirect_after_login = redirect_after_login
  router.push(loginurl)
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
  relogin,
  isLoggedIn,
  setRedirectAfterLogin,
  getUser,
  setTitle,
}
