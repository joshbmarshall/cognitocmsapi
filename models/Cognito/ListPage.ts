class CognitoListPageContent {
  name: string
  template: string
  variables: string
  text_colour: string
  background_colour: string

  constructor() {
    this.name = ''
    this.template = ''
    this.variables = ''
    this.text_colour = ''
    this.background_colour = ''
  }
}

class CognitoListPage {
  id: number
  name: string
  url: string
  item_url: string
  content: string
  pageContents: CognitoListPageContent[]
  updated_at: string

  constructor(source?: Partial<CognitoListPage>) {
    this.id = 0
    this.name = ''
    this.url = ''
    this.item_url = ''
    this.content = ''
    this.pageContents = []
    this.updated_at = ''
    Object.assign(this, source)
  }
}

export { CognitoListPage, CognitoListPageContent }
