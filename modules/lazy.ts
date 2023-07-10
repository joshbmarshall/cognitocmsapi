import { lazy } from '~cognito/plugins/lazy'
import { type UserModule } from '~/types'

export const install: UserModule = ({ isClient, initialState, app }) => {
  if (isClient) {
    lazy()
  }
}
