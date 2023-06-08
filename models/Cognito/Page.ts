import { CognitoBase } from './Base'
import pagebuilderdata from '~/pagebuilderdata.json'

class CognitoUrlParts {
  full_url: string
  page_url: string
  item_url: string
  url_parameter_2: string
  url_parameter_3: string

  constructor() {
    this.full_url = ''
    this.page_url = ''
    this.item_url = ''
    this.url_parameter_2 = ''
    this.url_parameter_3 = ''
  }

  getUrlParameter(url: string | string[], parameter_number: number): string {
    if (typeof (url) === 'string') {
      if (parameter_number) {
        return ''
      }
      return url
    }
    if (parameter_number > url.length) {
      return ''
    }
    return url[parameter_number]
  }

  getFullUrl(url: string | string[]): string {
    if (typeof (url) === 'string') {
      return `/${url}`
    }
    return `/${url.join('/')}`
  }

  parse(urlToLoad: string | string[]): CognitoUrlParts {
    const item = new CognitoUrlParts()
    item.full_url = this.getFullUrl(urlToLoad)
    item.page_url = this.getUrlParameter(urlToLoad, 0)
    item.item_url = this.getUrlParameter(urlToLoad, 1)
    item.url_parameter_2 = this.getUrlParameter(urlToLoad, 2)
    item.url_parameter_3 = this.getUrlParameter(urlToLoad, 3)
    return item
  }
}

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
  row_type: string

  constructor() {
    this.id = ''
    this.row_class = ''
    this.container_id = ''
    this.container_class = ''
    this.outer_class = ''
    this.row_type = 'columns'
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

  resolveurlpath(url: string | string[]): string {
    if (typeof (url) === 'string') {
      return url
    }
    return url[0]
  }

  getItemFromUrl(url: string | string[]): string {
    if (typeof (url) === 'string') {
      return ''
    }
    return url[1]
  }

  async preloadPage(urlToLoad: string | string[]): Promise<CognitoPage> {
    const url = this.resolveurlpath(urlToLoad)
    const page = new CognitoPage(pagebuilderdata.data?.find(e => e.slug == url))
    if (!page.slug) {
      page.updated_at = 'Try load from server'
    }
    page.item_url = this.getItemFromUrl(urlToLoad)

    // Use page in pinia if it exists
    const pagesStore = usePagesStore()
    if (!pagesStore.pages) {
      await pagesStore.loadPages()
    }
    if (pagesStore.pages) {
      return new CognitoPage(pagesStore.pages.find(e => url === e.slug))
    }

    return page
  }

  async loadPages() {
    const data = await new CognitoPage().find_many({
      page_size: 100,
      pb: 1,
    })
    return data.data
  }

  async loadPage(urlToLoad: string | string[], pagebuilder: boolean): Promise<CognitoPage> {
    const url = this.resolveurlpath(urlToLoad)
    const data = {
      url,
    }
    if (pagebuilder) {
      data.pb = 1
    }
    const page = await new CognitoPage().find_one(data)
    page.item_url = this.getItemFromUrl(urlToLoad)
    return page
  }
}

export { CognitoPage, CognitoPageRow, CognitoUrlParts }
