import { CognitoBase } from './Base'
import { CognitoImage } from './Image'

class CognitoSlide extends CognitoBase {
  name: string
  image: CognitoImage
  sub_heading_1: string
  sub_heading_2: string
  content: string
  footer: string
  link: string
  link_button_text: string
  link_target: string

  baseurl(): string {
    return '/api/v1/cognito/slide'
  }

  constructor(source?: Partial<CognitoSlide>) {
    super()
    this.name = ''
    this.image = new CognitoImage()
    this.sub_heading_1 = ''
    this.sub_heading_2 = ''
    this.content = ''
    this.footer = ''
    this.link = ''
    this.link_button_text = ''
    this.link_target = ''
    Object.assign(this, source)
  }
}

export { CognitoSlide }
