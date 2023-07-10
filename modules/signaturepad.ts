import VueSignaturePad from 'vue-signature-pad'
import { type UserModule } from '~/types'

export const install: UserModule = ({ isClient, initialState, app }) => {
  app.use(VueSignaturePad)
}
