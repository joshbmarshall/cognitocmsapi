import { CognitoBase } from '~cognito/models/Cognito/Base'
import type { CognitoTermsAndConditions } from '~cognito/models/Cognito/TermsAndConditions'
import { $axios } from '~cognito/plugins/axios'

class SignonType extends CognitoBase {
  name: string
  url: string
  success_content: string
  indemnities: CognitoTermsAndConditions[]

  baseurl() {
    return '/api/v1/signon/type'
  }

  constructor(source?: Partial<SignonType>) {
    super()
    this.name = ''
    this.url = ''
    this.success_content = ''
    this.indemnities = []
    Object.assign(this, source)
  }

  async getDetails(extra_term_ids: number[]): Promise<SignonType> {
    const res = await $axios.post(`${this.baseurl()}/getDetails`, {
      id: this.url,
      extra_term_ids,
    })
    return res.data
  }
}

export { SignonType }
