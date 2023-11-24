import { useRegisterSW } from 'virtual:pwa-register/vue'
import { type UserModule } from '~/types'
import { isLoggedIn, setRedirectAfterLogin } from '~cognito/plugins/axios'

export const install: UserModule = ({ router, isClient }) => {
  const {
    needRefresh,
    updateServiceWorker,
  } = useRegisterSW()

  router.beforeEach((to, from, next) => {
    if (isClient) {
      window.scrollTo(0, 0)
      if (needRefresh.value) {
        updateServiceWorker()
      }
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isLoggedIn()) {
        setRedirectAfterLogin(to.path)
        next('/login')
        return
      }
    }
    next()
  })
}
