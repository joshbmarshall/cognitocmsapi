<template>
  <cgn-button
    :color-brand="props.templatevar.button_colour == 'bnd'"
    :color-primary="props.templatevar.button_colour == 'pri'"
    :color-secondary="props.templatevar.button_colour == 'sec'"
    :color-success="props.templatevar.button_colour == 'suc'"
    :color-info="props.templatevar.button_colour == 'inf'"
    :color-warning="props.templatevar.button_colour == 'wrn'"
    :color-danger="props.templatevar.button_colour == 'dng'"
    :url="props.templatevar.button_url"
    :newtab="props.templatevar.open_in_new_tab"
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
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})

// TODO link to page or document
</script>
