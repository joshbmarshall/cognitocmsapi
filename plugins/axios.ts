import type { Router } from 'vue-router'
import { config } from '~/config'
import { useUserStore } from '~cognito/stores/user'

import { CgnAxios } from '~cognito/plugins/cgnAxios'

const $axios = new CgnAxios({ useCart: config.isEcommerce })

function setRedirectAfterLogin(path: string) {
  useUserStore().setRedirectAfterLogin(path)
}

function isLoggedIn() {
  return $axios.isLoggedIn()
}

function logout() {
  return $axios.logout()
}

async function login(username: string, password: string, router: Router) {
  return $axios.login(username, password, router)
}

async function tokenlogin() {
  return $axios.tokenlogin()
}

function requireLoggedIn() {
  if (isLoggedIn()) {
    return
  }
  useUserStore().setRedirectAfterLogin(useRoute().fullPath)
  useRouter().replace('/login')
}

function relogin(loginurl: string, redirect_after_login: string, router: Router) {
  const userStore = useUserStore()
  userStore.redirect_after_login = redirect_after_login
  router.push(loginurl)
}

function getUser() {
  return $axios.getUser()
}

export {
  $axios,
  login,
  tokenlogin,
  logout,
  relogin,
  isLoggedIn,
  requireLoggedIn,
  setRedirectAfterLogin,
  getUser,
}
