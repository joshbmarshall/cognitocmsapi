import { CognitoBase } from './Base'

class CognitoLink extends CognitoBase {
  name: string
  link: string
  icon: string

  baseurl(): string {
    return '/api/v1/cognito/link'
  }

  constructor(source?: Partial<CognitoLink>) {
    super()
    this.name = ''
    this.link = ''
    this.icon = ''
    Object.assign(this, source)
  }
}

export { CognitoLink }
