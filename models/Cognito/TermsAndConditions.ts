import { CognitoBase } from './Base'

class CognitoTermsAndConditions extends CognitoBase {
  name: string
  content: string
  adult_terms_for_minor_content: string

  baseurl(): string {
    return '/api/v1/cognito/termsAndConditions'
  }

  constructor(source?: Partial<CognitoTermsAndConditions>) {
    super()
    this.content = ''
    this.name = ''
    this.adult_terms_for_minor_content = ''
    Object.assign(this, source)
  }
}

export { CognitoTermsAndConditions }
