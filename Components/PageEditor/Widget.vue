<template>
  <div
    ref="widgetRef" class="relative rounded-lg bg-gray-200 px-2 dark:bg-darkbg-700"
    @click="openWidget()"
  >
    <div class="absolute right-0 top-0 flex overflow-hidden rounded-bl rounded-tr-lg">
      <i-heroicons-solid:trash v-if="widget.deleted" class="bg-danger-500 text-on-danger" />
      <i-heroicons-solid:plus v-else-if="widget.id === null" class="bg-success-500 text-on-success" />
      <i-heroicons-solid:eye-slash v-if="!widgetVisible" class="bg-warning-500 text-on-warning" />
    </div>
    <div
      class="flex cursor-pointer items-center justify-between py-2 text-xl"
      :class="{ 'text-muted': widget.deleted || !widgetVisible }"
    >
      <cgn-form-input-text v-if="widgetOpen && !widget.deleted" v-model="widget.name" class="!my-0" />
      <div v-else>
        {{ widget.name }}
      </div>
      <div>
        {{ widget.template }}
      </div>
    </div>
    <div v-if="widgetOpen" class="border-t border-gray-500 py-2">
      <div v-if="!widget.deleted" class="flex flex-col gap-2 pb-2">
        <div v-for="field in props.template?.fields" :key="field.name">
          <cgn-page-editor-widget-variable v-model="widgetVariables[field.name]" :template-field="field" />
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
import type { PageWidgetTemplate } from '~cognito/models/Page/WidgetTemplate'

const props = defineProps({
  template: {
    type: Object as PropType<PageWidgetTemplate>,
  },
})

const widget = defineModel({ type: Object as PropType<CognitoListPageContent>, required: true })

const widgetRef = ref()
const widgetOpen = ref(false)

const widgetVariables = ref(JSON.parse(widget.value.variables))

const openWidget = () => {
  widgetOpen.value = true
}
const closeWidget = () => {
  widgetOpen.value = false
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
  widgetVariables.value = JSON.parse(widget.value.variables)
})

onClickOutside(widgetRef, () => closeWidget())
</script>
