import { CognitoBase } from '../Cognito/Base'
import { CognitoImage } from '../Cognito/Image'
import { PodcastEpisode } from './Episode'

class PodcastChannel extends CognitoBase {
  title: string
  description: string
  cover_art: CognitoImage
  episodes: PodcastEpisode[]
  amazon_url?: string
  deezer_url?: string
  google_podcast_url?: string
  iheart_url?: string
  itunes_url?: string
  samsung_cast_url?: string
  spotify_url?: string
  tune_in_url?: string

  baseurl() {
    return '/api/v1/podcast/channel'
  }

  constructor(source?: Partial<PodcastChannel>) {
    super()
    this.title = ''
    this.description = ''
    this.cover_art = new CognitoImage()
    this.episodes = []
    Object.assign(this, source)
    if (source?.episodes) {
      this.episodes = source.episodes.map(e => new PodcastEpisode(e))
    }
  }
}

export { PodcastChannel }
