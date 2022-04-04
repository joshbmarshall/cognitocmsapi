import { CognitoImage } from './Image'
import type { CognitoGroup } from './Group'
import { CognitoBase } from './Base'

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
    Object.assign(this, source)
  }
}

export { CognitoArticle }
