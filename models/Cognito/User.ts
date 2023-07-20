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

  baseurl(): string {
    return '/api/v1/cognito/user'
  }

  async find_one(data: {
    image_aspect?: string
    image_width: number
    url: string
  }): Promise<CognitoUser> {
    const res = await $axios.get(`${this.baseurl()}/${data.url}`, {
      params: {
        image_aspect: data.image_aspect,
        image_width: data.image_width,
      },
    })
    return res.data
  }

  async getLoggedInUser(api?): Promise<CognitoUser> {
    if (!api) {
      api = $axios
    }
    try {
      const res = await api.get(`${this.baseurl()}/authUser`)
      return res.data.user
    } catch (error) {
      return new CognitoUser()
    }
  }

  async sendLoginLink(email: string): Promise<{
    success: boolean
    message: string
  }> {
    const fingerprint = useUserStore().getAuthFingerprint()
    const res = await $axios.post(`${this.baseurl()}/sendLoginLink`, {
      email,
      fingerprint,
    })
    return res.data
  }

  async signup(data: {
    email: string
    first_name: string
    last_name: string
  }): Promise<{
    success: boolean
    message: string
  }> {
    const res = await $axios.post(`${this.baseurl()}/registerLink`, {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      fingerprint: useUserStore().getAuthFingerprint(),
    })
    return res.data
  }

  async recoverPassword(email: string): Promise<{
    success: boolean
    message: string
  }> {
    const res = await $axios.get(`${this.baseurl()}/recoverPassword`, {
      params: {
        email,
      },
    })
    return res.data
  }

  async checkRecoveryCode(data: {
    email: string
    code: string
    newpassword?: string
  }): Promise<{
    newPassword: string
    message: string
  }> {
    const res = await $axios.get(`${this.baseurl()}/recoverPasswordCheck`, {
      params: {
        email: data.email,
        code: data.code,
        newpassword: data.newpassword,
      },
    })
    return res.data
  }

  async loginRecoveryCode(data: {
    email: string
    code: string
  }): Promise<{
    tokens: {
      access_token: string
      refresh_token: string
    }
    message: string
  }> {
    const res = await $axios.get('/api/v1/cognito/user/loginRecoveryCode', {
      params: {
        email: data.email,
        code: data.code,
        fingerprint: useUserStore().auth_fingerprint,
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
    const res = await $axios.get(`${this.baseurl()}/creditBalance?supplier=${supplier}`)
    return res.data.balance
  }

  async getProfile(): Promise<CognitoUser> {
    const res = await $axios.get(`${this.baseurl()}/myAccount`)
    return res.data
  }

  async uploadImage(image: string): Promise<{
    success: boolean
    error: string
  }> {
    const res = await $axios.post(`${this.baseurl()}/uploadImage`, { image })
    $axios.getUser()
    return res.data
  }
}

export { CognitoUser }
