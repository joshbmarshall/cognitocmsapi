import { CognitoBase } from './Base'

class CognitoImage extends CognitoBase {
  placeholder: string
  url: string
  webp_url: string

  baseurl(): string {
    return '/api/v1/cognito/image'
  }

  constructor(source?: Partial<CognitoImage>) {
    super()
    this.placeholder = ''
    this.url = ''
    this.webp_url = ''
    Object.assign(this, source)
  }
}

export { CognitoImage }
