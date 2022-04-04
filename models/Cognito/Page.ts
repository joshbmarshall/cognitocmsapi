import { CognitoBase } from './Base'

class CognitoPage extends CognitoBase {
  content: string
  name: string
  title: string
  meta_description: string

  baseurl(): string {
    return '/api/v1/cognito/page'
  }

  constructor(source?: Partial<CognitoPage>) {
    super()
    this.content = ''
    this.name = ''
    this.title = ''
    this.meta_description = ''
    Object.assign(this, source)
  }
}

export { CognitoPage }
