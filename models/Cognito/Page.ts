import { CognitoBase } from './Base'
import pagebuilderdata from '~/pagebuilderdata.json'

class CognitoPageWidget {
  outer: string
  inner: string
  type: string
  templatevar: {
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
    this.templatevar = {
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
  slug: string
  title: string
  meta_description: string
  rows: CognitoPageRow[]
  updated_at: string

  baseurl(): string {
    return '/api/v1/cognito/page'
  }

  constructor(source?: Partial<CognitoPage>) {
    super()
    this.content = ''
    this.name = ''
    this.slug = ''
    this.title = ''
    this.meta_description = ''
    this.rows = []
    this.updated_at = ''
    Object.assign(this, source)
  }

  preloadPage(url: string) {
    const page = new CognitoPage(pagebuilderdata.data?.find(e => e.slug == url))
    if (!page.slug) {
      page.updated_at = 'Try load from server'
    }
    return page
  }

  async loadPage(url: string, pagebuilder: boolean) {
    const data = {
      url,
    }
    if (pagebuilder) {
      data.pb = 1
    }
    return await new CognitoPage().find_one(data)
  }
}

export { CognitoPage }
