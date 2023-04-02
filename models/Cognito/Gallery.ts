import { CognitoBase } from './Base'
import type { CognitoSlide } from './Slide'

class CognitoGallery extends CognitoBase {
  name: string
  url: string
  slides: CognitoSlide[]

  baseurl(): string {
    return '/api/v1/cognito/gallery'
  }

  constructor(source?: Partial<CognitoGallery>) {
    super()
    this.name = ''
    this.url = ''
    this.slides = []
    Object.assign(this, source)
  }
}

export { CognitoGallery }
