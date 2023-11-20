<template>
  <div v-if="widget.outer == 'core/html'" :class="props.containedClass">
    <cgn-page-builder-core-html :templatevar="widget.templatevar" />
  </div>
  <div v-else-if="widget.outer == 'core/heading'" :class="props.containedClass">
    <cgn-page-builder-core-heading :templatevar="widget.templatevar" />
  </div>
  <div v-else-if="widget.outer == 'core/faq'">
    <cgn-page-builder-faq :templatevar="widget.templatevar" :group="props.urlParts.item_url" :page="props.urlParts.url_parameter_2" />
  </div>
  <div v-else-if="widget.outer == 'core/raw_code'" :class="props.containedClass">
    <cgn-page-builder-core-raw-code :templatevar="widget.templatevar" />
  </div>
  <div v-else-if="widget.outer == 'core/form'" :class="props.containedClass">
    <cgn-page-builder-core-form :templatevar="widget.templatevar" />
  </div>
  <div v-else-if="widget.outer == 'core/google_map'" :class="props.containedClass">
    <cgn-page-builder-core-google-map :templatevar="widget.templatevar" />
  </div>
  <div v-else-if="widget.outer == 'core/button_link'" :class="props.containedClass">
    <cgn-page-builder-core-button-link :templatevar="widget.templatevar" />
  </div>
  <div v-else-if="widget.outer == 'core/image_with_content'" :class="props.containedClass">
    <cgn-page-builder-core-image-with-content :templatevar="widget.templatevar" />
  </div>
  <div v-else-if="widget.outer == 'core/person_list'" :class="props.uncontainedClass">
    <cgn-page-builder-core-person-list :templatevar="widget.templatevar" />
  </div>
  <div v-else-if="widget.outer == 'core/call_to_action'" :class="props.uncontainedClass">
    <cgn-page-builder-core-call-to-action :templatevar="widget.templatevar" />
  </div>
  <div v-else-if="widget.outer == 'core/hero_quote'" :class="props.uncontainedClass">
    <cgn-page-builder-core-hero-quote :templatevar="widget.templatevar" />
  </div>
  <div v-else-if="widget.outer == 'core/hero_testimonial'" :class="props.uncontainedClass">
    <cgn-page-builder-core-hero-testimonial :templatevar="widget.templatevar" />
  </div>
  <div v-else-if="widget.outer == 'core/gallery'" :class="props.uncontainedClass">
    <cgn-page-builder-core-gallery :templatevar="widget.templatevar" :contained-class="props.containedClass" />
  </div>
  <div v-else-if="widget.outer == 'core/gallery_group'" :class="props.containedClass">
    <cgn-page-builder-core-gallery-group :templatevar="widget.templatevar" />
  </div>
  <div v-else-if="widget.outer == 'core/link_children'" :class="props.uncontainedClass">
    <cgn-page-builder-link-children :templatevar="widget.templatevar" />
  </div>

  <div v-else-if="useUserStore().user.id">
    Unknown {{ widget.outer }}
  </div>
</template>

<script lang="ts">
import { CognitoUrlParts } from '~cognito/models/Cognito/Page'

class Templatevars {
}
class Widget {
  outer: string
  templatevar: Templatevars
  constructor() {
    this.outer = ''
    this.templatevar = new Templatevars()
  }
}
</script>

<script setup lang="ts">
const props = defineProps({
  widget: {
    type: Widget,
    required: true,
  },
  urlParts: {
    type: CognitoUrlParts,
    required: true,
  },
  containedClass: {
    type: String,
  },
  uncontainedClass: {
    type: String,
  },
})
</script>
