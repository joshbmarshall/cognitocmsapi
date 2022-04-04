import { CognitoBase } from './Base'

class CognitoFormSubmit extends CognitoBase {
  id: number
  form_id: number
  details: Object

  baseurl() {
    return '/api/v1/cognito/formSubmit'
  }

  constructor(source?: Partial<CognitoFormSubmit>) {
    super()
    this.id = 0
    this.form_id = 1
    this.details = {}
    Object.assign(this, source)
  }
}

export { CognitoFormSubmit }
