<template>
  {{ widget.sort_order }}

  <div>
    <label class="inline-block select-none text-sm text-gray-800 dark:text-gray-200">
      <input v-model="widget.hidden" type="checkbox">
      Hidden
    </label>
    <cgn-form-input v-model="widget.start_time" type="datetime-local" label="Start Time" />
    <cgn-form-input v-model="widget.end_time" type="datetime-local" label="End Time" />
  </div>

  {{ widget.text_colour }}
  {{ widget.background_colour }}

  {{ widget.padding_top }}
  {{ widget.padding_bottom }}
  {{ widget.padding_left }}
  {{ widget.padding_right }}

  {{ widget.margin_top }}
  {{ widget.margin_bottom }}

  {{ widget.background_image_fixed }}
  {{ widget.background_image_opacity }}
  {{ widget.background_image_saturation }}
</template>

<script setup lang="ts">
import type { CognitoListPageContent } from '~cognito/models/Cognito/ListPage'

const widget = defineModel({ type: Object as PropType<CognitoListPageContent>, required: true })
</script>
