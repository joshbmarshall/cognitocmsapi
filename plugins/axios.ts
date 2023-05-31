import type { Router } from 'vue-router'
import { isEcommerce } from '~/config'
import { useUserStore } from '~cognito/stores/user'

import { CgnAxios } from '~cognito/plugins/cgnAxios'

const $axios = new CgnAxios({ useCart: isEcommerce })

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

function relogin(loginurl: string, redirect_after_login: string, router: Router) {
  const userStore = useUserStore()
  userStore.redirect_after_login = redirect_after_login
  router.push(loginurl)
}

function getUser() {
  return $axios.getUser()
}

function setTitle(heading: string) {
  useHead({
    title: () => `${usePagesStore().currentDomain.seo_title_prefix} ${heading} ${usePagesStore().currentDomain.seo_title_suffix}`,
  })
}

export {
  $axios,
  login,
  tokenlogin,
  logout,
  relogin,
  isLoggedIn,
  setRedirectAfterLogin,
  getUser,
  setTitle,
}
