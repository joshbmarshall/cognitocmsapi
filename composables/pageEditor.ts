import { gql } from 'graphql-request'
import type { PageWidgetTemplate } from '~cognito/models/Page/WidgetTemplate'
import { $axios } from '~cognito/plugins/axios'

export function usePageEditor() {
  const pageStore = usePageStore()

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
    const data = await $axios.graphql(gql`mutation createWidgetQuery($page_id: Int!, $name: String!, $template: String!) {
    createCognitoPageContent(
      page_id: $page_id
      name: $name
      template: $template) {
      id
    }
  }`, {
      page_id: page_id || pageStore.currentPage.id,
      name: 'new',
      template: templateName,
    })
    return (data.createCognitoPageContent.id)
  }

  return { loadWidgetTemplates, addWidget }
}
