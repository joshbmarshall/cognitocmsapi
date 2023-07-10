import AOS from 'aos'
import { type UserModule } from '~/types'
import 'aos/dist/aos.css'

export const install: UserModule = ({ isClient, initialState, app }) => {
  if (isClient) {
    AOS.init()
  }
}
