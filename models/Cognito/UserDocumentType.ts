import { CognitoBase } from './Base'

class CognitoUserDocumentType extends CognitoBase {
  name: string
  baseurl(): string {
    return '/api/v1/cognito/userDocumentType'
  }

  constructor(source?: Partial<CognitoUserDocumentType>) {
    super()
    this.name = ''
    Object.assign(this, source)
  }
}

export { CognitoUserDocumentType }
