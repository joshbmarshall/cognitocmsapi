import { CognitoBase } from './Base'

class CognitoFaq extends CognitoBase {
  name: string
  content: string

  baseurl(): string {
    return '/api/v1/cognito/faq'
  }

  constructor(source?: Partial<CognitoFaq>) {
    super()
    this.name = ''
    this.content = ''
    Object.assign(this, source)
  }
}

export { CognitoFaq }
