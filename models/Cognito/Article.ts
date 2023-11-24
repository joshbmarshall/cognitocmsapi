import { CognitoImage } from './Image'
import type { CognitoGroup } from './Group'
import { CognitoBase } from './Base'
import type { CognitoPageRow } from './Page'
import { CognitoTime } from './Time'

class CognitoArticle extends CognitoBase {
  author: string
  name: string
  blurb: string
  content: string
  slug: string
  title: string
  meta_description: string
  image: CognitoImage
  groups: CognitoGroup[]
  publish_time: CognitoTime
  reading_time: number
  rows: CognitoPageRow[]

  baseurl() {
    return '/api/v1/cognito/article'
  }

  constructor(source?: Partial<CognitoArticle>) {
    super()
    this.author = ''
    this.name = ''
    this.blurb = ''
    this.content = ''
    this.slug = ''
    this.title = ''
    this.meta_description = ''
    this.image = new CognitoImage()
    this.groups = []
    this.publish_time = new CognitoTime()
    this.reading_time = 0
    this.rows = []
    Object.assign(this, source)
  }
}

export { CognitoArticle }
