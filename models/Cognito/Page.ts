import { CognitoBase } from './Base'

class CognitoPageWidget {
  outer: string
  inner: string
  type: string
  templatevars: {
    block_class: string
    visible: boolean
    hidden_before: string
    hidden_after: string
    anchor_name: string
  }

  constructor() {
    this.outer = ''
    this.inner = ''
    this.type = ''
    this.templatevars = {
      block_class: '',
      anchor_name: '',
      visible: false,
      hidden_before: '',
      hidden_after: '',
    }
  }
}

class CognitoPageBlock {
  id: string
  block_class: string
  width: number
  offset: number
  widgets: CognitoPageWidget[]

  constructor() {
    this.id = ''
    this.block_class = ''
    this.width = 0
    this.offset = 0
    this.widgets = []
  }
}

class CognitoPageRow {
  id: string
  row_class: string
  container_id: string
  container_class: string
  outer_class: string
  blocks: CognitoPageBlock[]

  constructor() {
    this.id = ''
    this.row_class = ''
    this.container_id = ''
    this.container_class = ''
    this.outer_class = ''
    this.blocks = []
  }
}

class CognitoPage extends CognitoBase {
  content: string
  name: string
  title: string
  meta_description: string
  rows: CognitoPageRow[]

  baseurl(): string {
    return '/api/v1/cognito/page'
  }

  constructor(source?: Partial<CognitoPage>) {
    super()
    this.content = ''
    this.name = ''
    this.title = ''
    this.meta_description = ''
    this.rows = []
    Object.assign(this, source)
  }
}

export { CognitoPage }
