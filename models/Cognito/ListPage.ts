class CognitoListPageContent {
  id: number | null
  sort_order: number

  name: string
  template: string
  variables: string

  hidden: boolean | null
  start_time: any
  end_time: any

  text_colour: string
  background_colour: string

  padding_top: string
  padding_bottom: string
  padding_left: string
  padding_right: string
  margin_top: string
  margin_bottom: string

  full_width: boolean

  imageHashes: {
    background_image?: string
  }

  background_image: string
  background_image_fixed: boolean
  background_image_opacity: string
  background_image_saturation: string

  background_video_id: any
  background_video: {
    imageHashes: {
      slate?: string
    }
  }

  aos_type: string
  aos_easing: string
  aos_offset: string
  aos_duration: string
  aos_delay: string

  anchor_name: string

  editing?: boolean
  deleted?: boolean

  constructor(source?: Partial<CognitoListPageContent>) {
    this.id = null
    this.sort_order = 0
    this.name = ''
    this.template = ''
    this.variables = ''
    this.hidden = false
    this.start_time = null
    this.end_time = null
    this.text_colour = ''
    this.background_colour = ''
    this.padding_top = ''
    this.padding_bottom = ''
    this.padding_left = ''
    this.padding_right = ''
    this.margin_top = ''
    this.margin_bottom = ''
    this.full_width = false
    this.imageHashes = {}
    this.background_image = ''
    this.background_image_fixed = false
    this.background_image_opacity = '100'
    this.background_image_saturation = '100'
    this.background_video_id = null
    this.background_video = {
      imageHashes: {},
    }
    this.aos_type = ''
    this.aos_easing = ''
    this.aos_offset = ''
    this.aos_duration = ''
    this.aos_delay = ''
    this.anchor_name = ''
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
