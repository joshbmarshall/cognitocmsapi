import { CognitoImage } from './Image'
import { $axios } from '~cognito/plugins/axios'

class CognitoUser {
  id: number
  first_name: string
  last_name: string
  mobile_phone: string
  email: string
  image: CognitoImage
  newpassword: string
  thumbnail: string

  constructor(source?: Partial<CognitoUser>) {
    this.id = 0
    this.first_name = ''
    this.last_name = ''
    this.mobile_phone = ''
    this.email = ''
    this.image = new CognitoImage()
    this.newpassword = ''
    this.thumbnail = ''
    Object.assign(this, source)
  }

  async find_one(data: {
    image_aspect?: string
    image_width: number
    url: string
  }): Promise<CognitoUser> {
    const res = await $axios.get(`/api/v1/cognito/user/${data.url}`, {
      params: {
        image_aspect: data.image_aspect,
        image_width: data.image_width,
      },
    })
    return res.data
  }

  async getLoggedInUser(): Promise<CognitoUser> {
    const res = await $axios.get('/api/v1/cognito/user/authUser')
    return res.data.user
  }

  async recoverPassword(email: string): Promise<{
    success: boolean
    message: string
  }> {
    const res = await $axios.get('/api/v1/cognito/user/recoverPassword', {
      params: {
        email,
      },
    })
    return res.data
  }

  async checkRecoveryCode(data: {
    email: string
    code: string
  }): Promise<{
      newPassword: string
      message: string
    }> {
    const res = await $axios.get('/api/v1/cognito/user/recoverPasswordCheck', {
      params: {
        email: data.email,
        code: data.code,
      },
    })
    return res.data
  }

  /**
   * Get this user's credit balance for a supplier
   * @param supplier supplier id
   * @returns number the current balance for that supplier
   */
  async creditBalance(supplier: number): Promise<number> {
    const res = await $axios.get('/api/v1/cognito/user/creditBalance', {
      params: {
        supplier,
      },
    })
    return res.data.balance
  }
}

export { CognitoUser }
