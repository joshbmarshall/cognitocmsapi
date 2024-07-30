import { gql } from 'graphql-request'
import { $axios } from '~cognito/plugins/axios'
import type { PageWidgetTemplate } from '~cognito/models/Page/WidgetTemplate'
import { CognitoListPageContent } from '~cognito/models/Cognito/ListPage'

export function usePageEditor() {
  const pageStore = useListPageStore()
  const widgetTemplates = ref<PageWidgetTemplate[]>([])

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

  const addEditorWidget = (template: PageWidgetTemplate) => {
    const widget = ref<CognitoListPageContent>(new CognitoListPageContent())
    const highestSortOrder = pageStore.currentPage.pageContents.reduce((pre, cur) => {
      return (pre && pre.sort_order > cur.sort_order) ? pre : cur
    }).sort_order
    widget.value.sort_order = highestSortOrder + 1

    widget.value.name = 'new'
    widget.value.template = template.name

    const variables: { [key: string]: any } = {}
    template.fields.forEach((field) => {
      variables[field.name] = field.default_value
    })

    widget.value.variables = JSON.stringify(variables)

    pageStore.currentPage.pageContents.push(widget.value)
  }

  const getTemplate = (templateName: string): PageWidgetTemplate | undefined => {
    return widgetTemplates.value.find(template => template.name == templateName)
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

  onMounted(async () => {
    widgetTemplates.value = await loadWidgetTemplates()
  })

  return { widgetTemplates, loadWidgetTemplates, addEditorWidget, getTemplate, addWidget }
}
