import { CognitoBase } from './Base'

class CognitoFormQuestion extends CognitoBase {
  id: number
  form_id: number
  name: string
  label: string
  help_text: string
  tab: string
  field_type: string
  content: string
  max_height?: number
  required: boolean
  image_aspect_id?: number
  image_size_id?: number

  baseurl() {
    return '/api/v1/cognito/formQuestion'
  }

  constructor(source?: Partial<CognitoFormQuestion>) {
    super()
    this.id = 0
    this.form_id = 1
    this.name = ''
    this.label = ''
    this.help_text = ''
    this.tab = ''
    this.field_type = ''
    this.content = ''
    this.required = false
    Object.assign(this, source)
  }
}

export { CognitoFormQuestion }
