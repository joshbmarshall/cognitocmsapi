import { $axios } from '~cognito/plugins/axios'

class CognitoSitemap {
  async getRoutes(): Promise<{
    url: string
    priority: number
    model: string
    lastmod: string
  }[]> {
    const res = await $axios.get('/api/v1/cognito/page/sitemap')
    return res.data
  }
}

export { CognitoSitemap }
