import type { CognitoImage } from './Image'

class CognitoListPageContent {
  id: number | null
  sort_order: number

  name: string
  template: string
  variables: string

  enabled: boolean | null
  display_start_time: string | null
  display_end_time: string | null

  text_colour: string
  background_colour: string

  background_image?: CognitoImage
  background_image_fixed: boolean
  background_image_opacity: string
  background_image_saturation: string

  padding_top: string
  padding_bottom: string
  padding_left: string
  padding_right: string

  margin_top: string
  margin_bottom: string

  deleted?: boolean

  constructor(source?: Partial<CognitoListPageContent>) {
    this.id = null
    this.sort_order = 0
    this.name = ''
    this.template = ''
    this.variables = ''
    this.text_colour = ''
    this.background_colour = ''
    this.background_image_fixed = false
    this.background_image_opacity = '100'
    this.background_image_saturation = '100'
    this.enabled = null
    this.display_start_time = null
    this.display_end_time = null
    this.padding_top = ''
    this.padding_bottom = ''
    this.padding_left = ''
    this.padding_right = ''
    this.margin_top = ''
    this.margin_bottom = ''
    Object.assign(this, source)
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
