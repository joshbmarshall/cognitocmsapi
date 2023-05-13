import { $axios } from '~cognito/plugins/axios'
class CognitoWidget {
  name: string

  constructor() {
    this.name = ''
  }

  async getList(): Promise<CognitoWidget[]> {
    const res = await $axios.get('/api/v1/cognito/page/widgetList')
    return res.data
  }
}

export { CognitoWidget }
