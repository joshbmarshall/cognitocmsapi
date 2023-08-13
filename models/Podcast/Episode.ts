import { CognitoBase } from '../Cognito/Base'
import { CognitoImage } from '../Cognito/Image'
import { CognitoTime } from '../Cognito/Time'

class PodcastEpisode extends CognitoBase {
  season: number
  episode: number
  name: string
  url: string
  description: string
  cover_art: CognitoImage
  media_url: string
  length: number
  display_start_time: CognitoTime

  baseurl() {
    return '/api/v1/podcast/episode'
  }

  constructor(source?: Partial<PodcastEpisode>) {
    super()
    this.season = 0
    this.episode = 0
    this.name = ''
    this.url = ''
    this.description = ''
    this.cover_art = new CognitoImage()
    this.media_url = ''
    this.length = 0
    Object.assign(this, source)
    this.display_start_time = new CognitoTime(source?.display_start_time)
  }
}

export { PodcastEpisode }
