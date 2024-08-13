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
        <cgn-page-editor-dropdown-search
          v-model:id="widget.text_colour"
          model="\Cognito\PageContent" variable="text_colour" label="Text Colour"
        />
        <cgn-page-editor-dropdown-search
          v-model:id="widget.background_colour"
          model="\Cognito\PageContent" variable="background_colour" label="Background Colour"
        />
      </div>

      <div>
        <div class="text-lg">
          Padding & Margin
        </div>
        <cgn-page-editor-dropdown-search
          v-model:id="widget.padding_top"
          model="\Cognito\PageContent" variable="padding_top" label="Padding Top"
        />
        <cgn-page-editor-dropdown-search
          v-model:id="widget.padding_bottom"
          model="\Cognito\PageContent" variable="padding_bottom" label="Padding Bottom"
        />
        <cgn-page-editor-dropdown-search
          v-model:id="widget.padding_left"
          model="\Cognito\PageContent" variable="padding_left" label="Padding Left"
        />
        <cgn-page-editor-dropdown-search
          v-model:id="widget.padding_right"
          model="\Cognito\PageContent" variable="padding_right" label="Padding Right"
        />

        <cgn-page-editor-dropdown-search
          v-model:id="widget.margin_top"
          model="\Cognito\PageContent" variable="margin_top" label="Margin Top"
        />
        <cgn-page-editor-dropdown-search
          v-model:id="widget.margin_bottom"
          model="\Cognito\PageContent" variable="margin_bottom" label="Margin Bottom"
        />

        <label class="inline-block select-none text-sm text-gray-800 dark:text-gray-200">
          <input v-model="widget.full_width" type="checkbox">
          Full Width
        </label>
      </div>

      <div>
        <div class="text-lg">
          Background
        </div>
        <cgn-page-editor-image-upload
          v-if="widget.imageHashes"
          v-model="widget.background_image"
          v-model:image-hash="widget.imageHashes.background_image"
          name="Background Image"
        />
        <label class="inline-block select-none text-sm text-gray-800 dark:text-gray-200">
          <input v-model="widget.background_image_fixed" type="checkbox">
          Background Image Fixed
        </label>
        <cgn-page-editor-dropdown-search
          v-model:id="widget.background_video_id"
          model="\Cognito\Video" label="Background Video"
        />
        <cgn-page-editor-dropdown-search
          v-model:id="widget.background_image_opacity" empty-name=""
          model="\Cognito\PageContent" variable="background_image_opacity" label="Background Image Opacity"
        />
        <cgn-page-editor-dropdown-search
          v-model:id="widget.background_image_saturation" empty-name=""
          model="\Cognito\PageContent" variable="background_image_saturation" label="Background Image Saturation"
        />
      </div>

      <div>
        <div class="text-lg">
          Animate On Scroll
        </div>
        <cgn-page-editor-dropdown-search
          v-model:id="widget.aos_type"
          model="\Cognito\PageContent" variable="aos_type" label="AOS Type"
        />
        <cgn-page-editor-dropdown-search
          v-model:id="widget.aos_easing"
          model="\Cognito\PageContent" variable="aos_easing" label="AOS Easing"
        />
        <cgn-form-input v-model="widget.aos_offset" type="number" :min-amount="0" label="AOS Offset" />
        <cgn-form-input v-model="widget.aos_duration" type="number" :min-amount="0" label="AOS Duration" />
        <cgn-form-input v-model="widget.aos_delay" type="number" :min-amount="0" label="AOS Delay" />
      </div>

      <div>
        <div class="text-lg">
          Advanced
        </div>
        <cgn-form-input-text v-model="widget.anchor_name" label="Anchor Name" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import AOS from 'aos'
import type { CognitoListPageContent } from '~cognito/models/Cognito/ListPage'

const widget = defineModel({ type: Object as PropType<CognitoListPageContent>, required: true })

const optionsRef = ref()
const optionsOpen = ref(false)

const toggleOptions = () => {
  optionsOpen.value = !optionsOpen.value
}

watch(() => widget.value.aos_type, () => {
  AOS.refreshHard()
})
</script>
