class CognitoFormBuilderValue {
  label: string
  value: string
  selected: boolean

  constructor(source?: Partial<CognitoFormBuilderValue>) {
    this.label = ''
    this.value = ''
    this.selected = false
    Object.assign(this, source)
  }
}

class CognitoFormBuilder {
  type: string
  required: boolean
  label: string
  className: string
  name: string
  access: boolean
  curvalue: string | boolean
  subtype?: string
  multiple?: boolean
  other?: boolean
  values?: CognitoFormBuilderValue[]

  constructor(source?: Partial<CognitoFormBuilder>) {
    this.type = ''
    this.required = false
    this.label = ''
    this.className = ''
    this.name = ''
    this.curvalue = false
    this.access = false
    Object.assign(this, source)
  }
}

export { CognitoFormBuilder }
