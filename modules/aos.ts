import AOS from 'aos'
import { type UserModule } from '~/types'
import 'aos/dist/aos.css'

export const install: UserModule = ({ isClient }) => {
  if (isClient) {
    AOS.init()
  }
}
