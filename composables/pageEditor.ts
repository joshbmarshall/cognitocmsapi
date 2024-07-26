import { gql } from 'graphql-request'
import { $axios } from '~cognito/plugins/axios'
import type { PageWidgetTemplate } from '~cognito/models/Page/WidgetTemplate'

export function usePageEditor() {
  const pageStore = useListPageStore()

  const loadWidgetTemplates = async (): Promise<PageWidgetTemplate[]> => {
    const data = await $axios.graphql(gql`query widgetTemplateQuery {
    cognitoMisc {
      pageContentThemes {
        name
        fields {
          name
          display_name
          type
          default_value
          description
        }
      }
    }
  }`)
    return (data.cognitoMisc.pageContentThemes)
  }

  const addWidget = async (templateName: string, page_id?: number): Promise<number> => {
    if (!page_id) {
      page_id = pageStore.currentPage.id
    }
    const data = await $axios.graphql(gql`mutation createWidgetQuery($page_id: Int!, $name: String!, $template: String!) {
    createCognitoPageContent(
      page_id: $page_id
      name: $name
      template: $template) {
      id
    }
  }`, {
      page_id,
      name: 'new',
      template: templateName,
    })
    pageStore.refreshPage(page_id)
    return (data.createCognitoPageContent.id)
  }

  return { loadWidgetTemplates, addWidget }
}
