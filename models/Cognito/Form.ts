import { CognitoBase } from './Base'

class CognitoForm extends CognitoBase {
  id: number
  name: string
  url: string
  use_captcha: boolean

  baseurl(): string {
    return '/api/v1/cognito/form'
  }

  constructor(source?: Partial<CognitoForm>) {
    super()
    this.id = 0
    this.name = ''
    this.url = ''
    this.use_captcha = false
    Object.assign(this, source)
  }
}

export { CognitoForm }
