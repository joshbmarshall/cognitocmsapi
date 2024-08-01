<template>
  <div
    ref="optionsRef"
    class="flex flex-col gap-2 divide-y divide-gray-500 rounded-lg bg-gray-300 p-2 dark:bg-darkbg-800"
  >
    <div class="flex cursor-pointer items-center justify-between" @click="toggleOptions()">
      <div class="text-xl">
        Block Options
      </div>
      <i-heroicons-solid:chevron-up v-if="optionsOpen" />
      <i-heroicons-solid:chevron-down v-else />
    </div>
    <template v-if="optionsOpen">
      <div>
        <div class="text-lg">
          Visibility
        </div>
        <cgn-form-input v-model="widget.start_time" type="datetime-local" label="Start Time" />
        <cgn-form-input v-model="widget.end_time" type="datetime-local" label="End Time" />
        <label class="inline-block select-none text-sm text-gray-800 dark:text-gray-200">
          <input v-model="widget.hidden" type="checkbox">
          Hidden
        </label>
      </div>

      <div>
        <div class="text-lg">
          Colours
        </div>
        {{ widget.text_colour }}
        {{ widget.background_colour }}
      </div>

      <div>
        <div class="text-lg">
          Padding & Margin
        </div>
        {{ widget.padding_top }}
        {{ widget.padding_bottom }}
        {{ widget.padding_left }}
        {{ widget.padding_right }}

        {{ widget.margin_top }}
        {{ widget.margin_bottom }}
      </div>

      <div>
        <div class="text-lg">
          Background Image
        </div>
        {{ widget.background_image_fixed }}
        {{ widget.background_image_opacity }}
        {{ widget.background_image_saturation }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CognitoListPageContent } from '~cognito/models/Cognito/ListPage'

const widget = defineModel({ type: Object as PropType<CognitoListPageContent>, required: true })

const optionsRef = ref()
const optionsOpen = ref(false)

const toggleOptions = () => {
  optionsOpen.value = !optionsOpen.value
}
const closeOptions = () => {
  optionsOpen.value = false
}

onClickOutside(optionsRef, () => closeOptions())
</script>
