import { CognitoBase } from './Base'

class CognitoCountry extends CognitoBase {
  name: string
  code: string

  baseurl(): string {
    return '/api/v1/cognito/country'
  }

  constructor(source?: Partial<CognitoCountry>) {
    super()
    this.name = ''
    this.code = ''
    Object.assign(this, source)
  }
}

export { CognitoCountry }
