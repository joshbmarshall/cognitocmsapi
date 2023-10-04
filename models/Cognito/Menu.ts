import { CognitoBase } from './Base'
import { CognitoImage } from './Image'
import { $axios } from '~cognito/plugins/axios'

class CognitoMenu extends CognitoBase {
  name: string
  link: string
  target: string
  identifier: string
  button_link: string
  button_text: string
  image: CognitoImage
  children: CognitoMenu[]

  baseurl(): string {
    return '/api/v1/cognito/menu'
  }

  constructor(source?: Partial<CognitoMenu>) {
    super()
    this.name = ''
    this.link = ''
    this.target = ''
    this.identifier = ''
    this.button_link = ''
    this.button_text = ''
    this.image = new CognitoImage()
    this.children = []
    Object.assign(this, source)
  }

  async getMenu(name: string, image_aspect?: string, image_width?: string): Promise<CognitoMenu[]> {
    return (await $axios.post('/api/v1/cognito/menu/tree', { name, image_aspect, image_width }))?.data ?? []
  }
}

export { CognitoMenu }
