import { Client } from 'typesense'
import { $axios } from '~cognito/plugins/axios'

class CognitoCTypesenseSettings {
  host: string
  port: number
  protocol: string
  apiKey: string

  constructor() {
    this.host = ''
    this.port = 443
    this.protocol = 'https'
    this.apiKey = ''
  }

  async getSettings() {
    if (this.host) {
      return
    }
    const res = await $axios.get('/api/v1/cognito/cTypesense/searchSettings')
    this.host = res.data.host
    this.port = res.data.port
    this.protocol = res.data.protocol
    this.apiKey = res.data.apiKey
  }
}

class CognitoCTypesenseHighlights {
  field: string
  matched_tokens: string[]
  snippet: string

  constructor() {
    this.field = ''
    this.matched_tokens = []
    this.snippet = ''
  }
}

class CognitoCTypesenseHits {
  document: Object
  highlights: CognitoCTypesenseHighlights[]
  text_match: number

  constructor() {
    this.document = {}
    this.highlights = []
    this.text_match = 0
  }
}

class CognitoCTypesense {
  found: number
  hits: CognitoCTypesenseHits[]
  out_of: number
  page: number
  search_time_ms: number
  private static typesensedata = new CognitoCTypesenseSettings()

  constructor(source?: Partial<CognitoCTypesense>) {
    this.found = 0
    this.hits = []
    this.out_of = 0
    this.page = 1
    this.search_time_ms = 0
    Object.assign(this, source)
  }

  async search(data: {
    collectionName: string
    query: string
    query_by: string
    page: number
    per_page?: number
  }): Promise<CognitoCTypesense> {
    if (!data.per_page) {
      data.per_page = 20
    }

    await CognitoCTypesense.typesensedata.getSettings()

    const typesense = new Client({
      nodes: [
        {
          host: CognitoCTypesense.typesensedata.host,
          port: CognitoCTypesense.typesensedata.port,
          protocol: CognitoCTypesense.typesensedata.protocol,
        }],
      apiKey: CognitoCTypesense.typesensedata.apiKey,
      connectionTimeoutSeconds: 10,
    })

    const res = await typesense.collections(data.collectionName).documents().search({
      q: data.query,
      query_by: data.query_by,
      per_page: data.per_page,
      page: data.page,
    })
    return new CognitoCTypesense(res)
  }
}

export { CognitoCTypesense }
