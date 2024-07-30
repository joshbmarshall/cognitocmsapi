<template>
  <div ref="widgetRef" class="rounded-lg bg-gray-200 px-2 dark:bg-darkbg-700" :class="{ 'text-muted': widget.deleted }" @click="openWidget()">
    <div class="flex items-center justify-between py-2 text-xl">
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
          <cgn-form-input-text
            v-if="field.type == 'string'" v-model="widgetVariables[field.name]"
            :label="field.display_name" class="!my-0"
          />
          <div v-else-if="field.type == 'html'">
            <cgn-form-label :label="field.display_name" />
            <cgn-tip-tap v-model="widgetVariables[field.name]" />
          </div>
          <cgn-form-checkbox
            v-else-if="field.type == 'bool'" v-model="widgetVariables[field.name]"
            :label="field.display_name"
          />
          <div v-else>
            {{ field.display_name }}
            <div class="text-muted text-sm">
              Unknkown type: '{{ field.type }}'
            </div>
          </div>
        </div>
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
import type { CognitoListPageContent } from '~cognito/models/Cognito/ListPage'
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

watch(() => widgetVariables.value, () => {
  widget.value.variables = JSON.stringify(widgetVariables.value)
}, { deep: true })

const openWidget = () => {
  widgetOpen.value = true
}
const closeWidget = () => {
  widgetOpen.value = false
}

onClickOutside(widgetRef, () => closeWidget())
</script>
