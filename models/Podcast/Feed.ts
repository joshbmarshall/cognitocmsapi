import { parse } from 'rss-to-json'

class PodcastEnclosure {
  url: string
  length: number
  type: string
  constructor(source?: Partial<PodcastEnclosure>) {
    this.url = ''
    this.length = 0
    this.type = 'audio/mpeg'
    Object.assign(this, source)
  }
}

class PodcastEpisode {
  author: string
  content: string
  created: number
  description: string
  enclosures: PodcastEnclosure[]
  id: string
  published: number
  title: string
  itunes_image: {
    href: string
  }

  constructor(source?: Partial<PodcastEpisode>) {
    this.author = ''
    this.content = ''
    this.created = 0
    this.description = ''
    this.enclosures = []
    this.id = ''
    this.published = 0
    this.title = ''
    this.itunes_image = {
      href: '',
    }
    Object.assign(this, source)
  }
}

class PodcastFeed {
  title: string
  description: string
  link: string
  image: string
  items: PodcastEpisode[]

  constructor(source?: Partial<PodcastFeed>) {
    this.title = ''
    this.description = ''
    this.link = ''
    this.image = ''
    this.items = []

    Object.assign(this, source)
  }

  async fetchFeed(url: string) {
    const data = await parse(url)
    return new PodcastFeed(data)
  }
}

export { PodcastFeed }
