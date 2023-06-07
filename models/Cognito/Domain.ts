import { CognitoBase } from './Base'
import { CognitoImage } from './Image'
import { $axios } from '~cognito/plugins/axios'

class CognitoDomain extends CognitoBase {
  name: string
  favicon: CognitoImage
  favicon_dark?: CognitoImage
  theme_colour: string
  dark_theme_colour: string
  seo_title_suffix: string
  seo_title_prefix: string
  google_analytics_key: string
  google_tag_manager: string
  google_site_verification: string
  bing_site_verification: string
  facebook_pixel: string
  matomo_site_url: string
  matomo_site_id: string
  organisation_name: string
  organisation_abn: string
  organisation_logo: CognitoImage
  organisation_logo_dark?: CognitoImage
  organisation_address: string
  organisation_email: string
  organisation_phone: string
  facebook_link: string
  twitter_link: string
  instagram_link: string
  linkedin_link: string
  youtube_link: string
  pinterest_link: string
  github_link: string
  xing_link: string
  skype_link: string

  baseurl(): string {
    return '/api/v1/cognito/domain'
  }

  constructor(source?: Partial<CognitoDomain>) {
    super()
    this.name = ''
    this.favicon = new CognitoImage()
    this.theme_colour = ''
    this.dark_theme_colour = ''
    this.seo_title_prefix = ''
    this.seo_title_suffix = ''
    this.google_analytics_key = ''
    this.google_tag_manager = ''
    this.google_site_verification = ''
    this.bing_site_verification = ''
    this.facebook_pixel = ''
    this.matomo_site_url = ''
    this.matomo_site_id = ''
    this.organisation_name = ''
    this.organisation_abn = ''
    this.organisation_logo = new CognitoImage()
    this.organisation_address = ''
    this.organisation_email = ''
    this.organisation_phone = ''
    this.facebook_link = ''
    this.twitter_link = ''
    this.instagram_link = ''
    this.linkedin_link = ''
    this.youtube_link = ''
    this.pinterest_link = ''
    this.github_link = ''
    this.xing_link = ''
    this.skype_link = ''
    Object.assign(this, source)
  }

  async currentDomain(): Promise<CognitoDomain> {
    const data = await $axios.get(`${this.baseurl()}/currentDomain`)
    return data.data
  }
}

export { CognitoDomain }
