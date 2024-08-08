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
          options
        }
      }
    }
  }`)
    return (data.cognitoMisc.pageContentThemes)
  }

  const getTemplate = (templateName: string): PageWidgetTemplate | undefined => {
    return widgetTemplates.value.find(template => template.name == templateName)
  }

  const addEditorWidget = (template: PageWidgetTemplate) => {
    const widget = ref<CognitoListPageContent>(new CognitoListPageContent())
    const highestSortOrder = pageStore.currentPage.pageContents.map(widget => widget.sort_order).reduce((pre, cur) => {
      return (pre > cur) ? pre : cur
    }, 1)
    widget.value.sort_order = highestSortOrder + 1

    widget.value.name = 'new'
    widget.value.template = template.name

    const variables: { [key: string]: any } = {}
    variables.image_hashes = {}
    template.fields.forEach((field) => {
      variables[field.name] = field.default_value
      if (field.type == '\\Cognito\\Image') {
        variables.image_hashes[field.name] = ''
      }
    })

    widget.value.variables = JSON.stringify(variables)

    pageStore.currentPage.pageContents.push(widget.value)
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
    return (data.createCognitoPageContent.id)
  }
  const updateWidget = async (widget: CognitoListPageContent, page_id?: number): Promise<number> => {
    if (!page_id) {
      page_id = pageStore.currentPage.id
    }
    const data = await $axios.graphql(gql`mutation updateWidgetQuery(
      $id: Int!,
      $page_id: Int,
      $sort_order: Int,
      $name: String,
      $variables: String,
      $hidden: Boolean,
      $start_time: String,
      $end_time: String,
      $text_colour: String,
      $background_colour: String,
      $padding_top: String,
      $padding_bottom: String,
      $padding_left: String,
      $padding_right: String,
      $margin_top: String,
      $margin_bottom: String,
      $background_image_fixed: Boolean,
      $background_image_opacity: String,
      $background_image_saturation: String,
      $aos_type: String,
      $aos_easing: String,
      $aos_offset: String,
      $aos_duration: String,
      $aos_delay: String,
      $anchor_name: String,
    ) {
      updateCognitoPageContent(
        id: $id
        page_id: $page_id
        sort_order: $sort_order
        name: $name
        variables: $variables
        hidden: $hidden
        start_time: $start_time
        end_time: $end_time
        text_colour: $text_colour
        background_colour: $background_colour
        padding_top: $padding_top
        padding_bottom: $padding_bottom
        padding_left: $padding_left
        padding_right: $padding_right
        margin_top: $margin_top
        margin_bottom: $margin_bottom
        background_image_fixed: $background_image_fixed
        background_image_opacity: $background_image_opacity
        background_image_saturation: $background_image_saturation
        aos_type: $aos_type
        aos_easing: $aos_easing
        aos_offset: $aos_offset
        aos_duration: $aos_duration
        aos_delay: $aos_delay
        anchor_name: $anchor_name
      ) {
        id
      }
    }`, {
      id: widget.id,
      page_id,
      sort_order: widget.sort_order,
      name: widget.name,
      variables: widget.variables,
      hidden: widget.hidden,
      start_time: widget.start_time,
      end_time: widget.end_time,
      text_colour: widget.text_colour,
      background_colour: widget.background_colour,
      padding_top: widget.padding_top,
      padding_bottom: widget.padding_bottom,
      padding_left: widget.padding_left,
      padding_right: widget.padding_right,
      margin_top: widget.margin_top,
      margin_bottom: widget.margin_bottom,
      background_image_fixed: widget.background_image_fixed,
      background_image_opacity: widget.background_image_opacity,
      background_image_saturation: widget.background_image_saturation,
      aos_type: widget.aos_type,
      aos_easing: widget.aos_easing,
      aos_offset: widget.aos_offset,
      aos_duration: widget.aos_duration,
      aos_delay: widget.aos_delay,
      anchor_name: widget.anchor_name,
    })
    return (data.updateCognitoPageContent.id)
  }
  const deleteWidget = async (id: number) => {
    await $axios.graphql(gql`mutation deleteWidgetQuery($id: Int!) {
      deleteCognitoPageContent(id: $id)
    }`, {
      id,
    })
    return (null)
  }

  const savePageChanges = async () => {
    await Promise.all(pageStore.currentPage.pageContents.map(async (widget) => {
      if (widget.id === null) {
        if (widget.deleted) {
          // newly created then deleted, nothing needs to be done
          return
        }
        // new widget, we need to add it before updating
        widget.id = await addWidget(widget.template)
      }
      if (widget.deleted) {
        await deleteWidget(widget.id)
        return
      }
      // update widget with information
      await updateWidget(widget)
    }))
    return pageStore.refreshPage(pageStore.currentPage.id)
  }

  const cancelPageChanges = async () => {
    return pageStore.refreshPage(pageStore.currentPage.id)
  }

  onMounted(async () => {
    widgetTemplates.value = await loadWidgetTemplates()
  })

  return {
    widgetTemplates,
    loadWidgetTemplates,
    addEditorWidget,
    getTemplate,
    addWidget,
    updateWidget,
    savePageChanges,
    cancelPageChanges,
  }
}
// TODO background image for widgets
