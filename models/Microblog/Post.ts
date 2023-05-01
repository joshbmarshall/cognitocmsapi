import { CognitoBase } from '../Cognito/Base'
import type { CognitoImage } from '../Cognito/Image'
import { CognitoTime } from '../Cognito/Time'
import type { CognitoVideo } from '../Cognito/Video'

class MicroblogPost extends CognitoBase {
  published_at: CognitoTime
  content: string
  link?: string
  link_text?: string
  image?: CognitoImage
  video?: CognitoVideo
  showVideo: boolean
  tags: string[]

  baseurl(): string {
    return '/api/v1/microblog/post'
  }

  constructor(source?: Partial<MicroblogPost>) {
    super()
    this.content = ''
    this.showVideo = false
    this.tags = []
    Object.assign(this, source)
    this.published_at = new CognitoTime(source?.published_at)
  }
}

export { MicroblogPost }
