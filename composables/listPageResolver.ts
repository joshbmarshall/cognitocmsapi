import { gql } from 'graphql-request'
import { $axios } from '~cognito/plugins/axios'
import { CognitoListPage } from '~cognito/models/Cognito/ListPage'
import initialData from '~/initialData.json'

export function useListPageResolver() {
  const resolveurlpath = (url: string | string[]): string => {
    if (typeof (url) === 'string') {
      return url
    }
    return url[0]
  }

  const getItemFromUrl = (url: string | string[]): string => {
    if (typeof (url) === 'string') {
      return ''
    }
    return url[1]
  }

  const preloadPage = async (urlToLoad: string | string[]): Promise <CognitoListPage> => {
    const url = resolveurlpath(urlToLoad)
    const page = new CognitoListPage(initialData.pages.data?.find(e => e.slug == url))
    if (!page.url) {
      page.updated_at = 'Try load from server'
    }
    page.item_url = getItemFromUrl(urlToLoad)

    // Use page in pinia if it exists
    const pagesStore = useListPagesStore()
    if (!pagesStore.pages) {
      await pagesStore.loadPages()
    }
    if (pagesStore.pages) {
      return pagesStore.findByUrl(url)
    }

    return page
  }

  const fragmentCognitoPage = gql`
    fragment cognitoPage on CognitoPage {
      id
      name
      url
      updated_at
      content
      pageContents {
        id
        sort_order
        name
        template
        variables
        enabled
        display_start_time
        display_end_time
        text_colour
        background_colour
        background_image_fixed
        background_image_opacity
        background_image_saturation
        padding_top
        padding_bottom
        padding_left
        padding_right
        margin_top
        margin_bottom
      }
    }`

  const loadPages = async (): Promise<CognitoListPage[]> => {
    const data = await $axios.graphql(gql`query pagesQuery {
      cognitoPages {
        ...cognitoPage
      }
    }`.concat(fragmentCognitoPage))
    return (data.cognitoPages)
  }

  const loadPage = async (urlToLoad: string | string[]): Promise <CognitoListPage> => {
    const url = resolveurlpath(urlToLoad)
    const data = await $axios.graphql(gql`query pageQuery($url: String!) {
      cognitoPage(whereEqual: {url: $url}) {
        ...cognitoPage
      }
    }`.concat(fragmentCognitoPage), {
      url,
    })
    const page = (data.cognitoPage)
    page.item_url = getItemFromUrl(urlToLoad)
    return page
  }

  return { resolveurlpath, getItemFromUrl, preloadPage, loadPages, loadPage }
}
