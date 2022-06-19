import { CognitoBase } from './Base'
import { CognitoImage } from './Image'

class CognitoTestimonial extends CognitoBase {
  content: string
  name: string
  title: string
  image: CognitoImage
  rating: number

  baseurl(): string {
    return '/api/v1/cognito/testimonial'
  }

  constructor(source?: Partial<CognitoTestimonial>) {
    super()
    this.content = ''
    this.name = ''
    this.title = ''
    this.image = new CognitoImage()
    this.rating = 0
    Object.assign(this, source)
  }
}

export { CognitoTestimonial }
