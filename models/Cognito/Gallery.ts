import { CognitoBase } from './Base'
import { CognitoSlide } from './Slide'

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
    if (source?.slides) {
      this.slides = source.slides.map(e => new CognitoSlide(e))
    }
  }
}

export { CognitoGallery }
