<template>
  <div v-if="widget.template == 'core/html'">
    <cgn-page-builder-core-html :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/heading'">
    <cgn-page-builder-core-heading :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/faq'">
    <cgn-page-builder-faq :templatevar="variables" :group="props.urlParts.item_url" :page="props.urlParts.url_parameter_2" />
  </div>
  <div v-else-if="widget.template == 'core/raw_code'">
    <cgn-page-builder-core-raw-code :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/form'">
    <cgn-page-builder-core-form :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/google_map'">
    <cgn-page-builder-core-google-map :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/button_link'">
    <cgn-page-builder-core-button-link :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/image_with_content'">
    <cgn-page-builder-core-image-with-content :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/person_list'">
    <cgn-page-builder-core-person-list :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/call_to_action'">
    <cgn-page-builder-core-call-to-action :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/hero_quote'">
    <cgn-page-builder-core-hero-quote :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/hero_testimonial'">
    <cgn-page-builder-core-hero-testimonial :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/testimonial_grid'">
    <cgn-page-builder-core-testimonial-grid :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/gallery'">
    <cgn-page-builder-core-gallery :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/gallery_group'">
    <cgn-page-builder-core-gallery-group :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/gift_voucher_purchase'">
    <cgn-page-builder-core-gift-voucher-purchase :templatevar="variables" />
  </div>
  <div v-else-if="widget.template == 'core/link_children'">
    <cgn-page-builder-link-children :templatevar="variables" />
  </div>

  <div v-else-if="useUserStore().user.id">
    Unknown {{ widget.template }}
  </div>
</template>

<script setup lang="ts">
import type { CognitoListPageContent } from '~cognito/models/Cognito/ListPage'
import { CognitoUrlParts } from '~cognito/models/Cognito/Page'

const props = defineProps({
  widget: {
    type: Object as PropType<CognitoListPageContent>,
    required: true,
  },
  urlParts: {
    type: CognitoUrlParts,
    required: true,
  },
})

const variables = computed(() => {
  return JSON.parse(props.widget.variables || '{}')
})
</script>
