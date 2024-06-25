import { CognitoBase } from './Base'
import type { CognitoFormQuestion } from './FormQuestion'
import { $axios } from '~cognito/plugins/axios'

class CognitoForm extends CognitoBase {
  id: number
  name: string
  url: string
  use_captcha: boolean
  data: any[]
  must_be_logged_on: boolean
  cost: number
  questions: CognitoFormQuestion[]

  baseurl(): string {
    return '/api/v1/cognito/form'
  }

  constructor(source?: Partial<CognitoForm>) {
    super()
    this.id = 0
    this.name = ''
    this.url = ''
    this.use_captcha = false
    this.must_be_logged_on = false
    this.cost = 0
    this.questions = []
    this.data = []
    Object.assign(this, source)
  }

  async submit(data: any) {
    const res = await $axios.post(`${this.baseurl()}/submit/${this.id}`, { data, url: btoa(location.href) })
    return res.data
  }
}

export { CognitoForm }
