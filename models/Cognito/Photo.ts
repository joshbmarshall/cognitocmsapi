import { CognitoBase } from './Base'
import { CognitoImage } from './Image'

class CognitoPhoto extends CognitoBase {
  name: string
  description: string
  image: CognitoImage

  baseurl(): string {
    return '/api/v1/cognito/photo'
  }

  constructor(source?: Partial<CognitoPhoto>) {
    super()
    this.name = ''
    this.description = ''
    this.image = new CognitoImage()
    Object.assign(this, source)
  }
}

export { CognitoPhoto }
