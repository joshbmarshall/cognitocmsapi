<template>
  <cgn-button
    :templatevar-colour="props.templatevar.button_colour"
    :url="button_url"
    :newtab="props.templatevar.open_in_new_tab"
    :fullwidth="props.templatevar.full_width"
  >
    {{ props.templatevar.button_text }}
  </cgn-button>
</template>

<script lang="ts">
class Templatevars {
  button_text?: string
  button_colour?: string
  button_url?: string
  link_to_page?: string
  link_to_document?: string
  open_in_new_tab?: boolean
  full_width?: boolean
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})

const button_url = computed(() => {
  if (props.templatevar.link_to_document) {
    // TODO link to document
  }
  if (props.templatevar.link_to_page) {
    return `/${usePagesStore().findById(props.templatevar.link_to_page)?.slug}`
  }
  return props.templatevar.button_url
})
</script>
