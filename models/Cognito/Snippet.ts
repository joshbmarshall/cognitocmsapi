import { CognitoBase } from './Base'

class CognitoSnippet extends CognitoBase {
  name: string
  content: string
  baseurl() {
    return '/api/v1/cognito/snippet'
  }

  constructor(source?: Partial<CognitoSnippet>) {
    super()
    this.name = ''
    this.content = ''
    Object.assign(this, source)
  }
}
export { CognitoSnippet }
