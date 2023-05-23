import { $axios } from '~cognito/plugins/axios'

class CognitoWidgetField {
  description: string
  name: string
  tab: string
  type: string
  constructor() {
    this.description = ''
    this.name = ''
    this.tab = ''
    this.type = ''
  }
}
class CognitoWidget {
  name: string
  fields: CognitoWidgetField[]

  constructor() {
    this.name = ''
    this.fields = []
  }

  async getList(): Promise<CognitoWidget[]> {
    const res = await $axios.get('/api/v1/cognito/page/widgetList')
    return res.data
  }
}

export { CognitoWidget, CognitoWidgetField }
