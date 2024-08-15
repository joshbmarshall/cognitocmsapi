<template>
  <div
    ref="widgetRef" class="relative rounded-lg bg-gray-200 dark:bg-darkbg-700"
    @click="openWidget()"
  >
    <div class="absolute right-0 top-0 flex overflow-hidden rounded-bl rounded-tr-lg">
      <i-heroicons-solid:trash v-if="widget.deleted" class="bg-danger-500 text-on-danger" />
      <i-heroicons-solid:plus v-else-if="widget.id === null" class="bg-success-500 text-on-success" />
      <i-heroicons-solid:eye-slash v-if="!widgetVisible" class="bg-warning-500 text-on-warning" />
    </div>
    <div class="flex flex-row">
      <div class="handle flex cursor-grab items-center text-lg" @click.stop>
        <i-mdi:drag-vertical class="border-r border-gray-400" />
      </div>
      <div
        class="flex flex-1 cursor-pointer items-center justify-between gap-2 overflow-hidden p-2 text-xl"
        :class="{ 'text-muted': widget.deleted || !widgetVisible }"
      >
        <cgn-form-input-text v-if="widget.editing && !widget.deleted" v-model="widget.name" class="!my-0" />
        <div v-else class="text-nowrap">
          {{ widget.name }}
        </div>
        <div class="overflow-hidden text-ellipsis text-nowrap text-sm" :title="widget.template">
          {{ widget.template }}
        </div>
      </div>
    </div>
    <div v-if="widget.editing" class="border-t border-gray-500 p-2">
      <div v-if="!widget.deleted" class="flex flex-col gap-2 pb-2">
        <div v-for="field in props.template?.fields" :key="field.name">
          <cgn-page-editor-widget-variable
            v-model="widgetVariables[field.name]"
            v-model:image-hash="widgetVariables.image_hashes[field.name]"
            :template-field="field"
          />
        </div>
        <cgn-page-editor-widget-options v-model="widget" />
      </div>
      <cgn-button v-if="widget.deleted" color-warning fullwidth @click="widget.deleted = false">
        Restore
      </cgn-button>
      <cgn-button v-else color-danger fullwidth @click="widget.deleted = true">
        Delete
      </cgn-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { compareAsc } from 'date-fns'
import type { CognitoListPageContent } from '~cognito/models/Cognito/ListPage'
import { CognitoTime } from '~cognito/models/Cognito/Time'
import type { PageBlockTemplate } from '~cognito/models/Page/BlockTemplate'

const props = defineProps({
  template: {
    type: Object as PropType<PageBlockTemplate>,
  },
})

const widget = defineModel<CognitoListPageContent>({ required: true })

const widgetRef = ref()

const widgetVariables = ref(JSON.parse(widget.value.variables || '{}'))

const openWidget = () => {
  widget.value.editing = true
}
const closeWidget = () => {
  widget.value.editing = false
}

const currentTime = useNow({ interval: 60000 })
const widgetVisible = computed(() => {
  if (widget.value.hidden) {
    return false
  }
  if (widget.value.start_time) {
    const hide_before = new CognitoTime(widget.value.start_time)
    if (compareAsc(currentTime.value, hide_before.time) == -1) {
      return false
    }
  }
  if (widget.value.end_time) {
    const hide_after = new CognitoTime(widget.value.end_time)
    if (compareAsc(hide_after.time, currentTime.value) == -1) {
      return false
    }
  }
  return true
})

watch(() => widgetVariables.value, () => {
  widget.value.variables = JSON.stringify(widgetVariables.value)
}, { deep: true })

watch(() => widget.value.variables, () => {
  widgetVariables.value = JSON.parse(widget.value.variables || '{}')
})

onClickOutside(widgetRef, () => closeWidget())
</script>
