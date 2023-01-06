import { CognitoBase } from './Base'
import { $axios } from '~cognito/plugins/axios'

class CognitoMenu extends CognitoBase {
  name: string
  link: string
  target: string
  children: CognitoMenu[]

  baseurl(): string {
    return '/api/v1/cognito/menu'
  }

  constructor(source?: Partial<CognitoMenu>) {
    super()
    this.name = ''
    this.link = ''
    this.target = ''
    this.children = []
    Object.assign(this, source)
  }

  async getMenu(name: string): Promise<CognitoMenu[]> {
    const res = await $axios.post('/api/v1/cognito/menu/tree', { name })
    return res.data
  }
}

export { CognitoMenu }
