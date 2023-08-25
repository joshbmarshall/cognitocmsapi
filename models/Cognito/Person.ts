import { CognitoBase } from './Base'
import { CognitoImage } from './Image'

class CognitoPerson extends CognitoBase {
  photo: CognitoImage
  first_name: string
  last_name: string
  title: string
  description: string

  baseurl(): string {
    return '/api/v1/cognito/person'
  }

  constructor(source?: Partial<CognitoPerson>) {
    super()
    this.photo = new CognitoImage()
    this.first_name = ''
    this.last_name = ''
    this.title = ''
    this.description = ''
    Object.assign(this, source)
  }
}

export { CognitoPerson }
