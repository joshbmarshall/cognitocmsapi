<template>
  <router-view v-if="!showPageEditor" />
  <div v-else class="flex">
    <div class="w-3/4 h-screen overflow-y-scroll">
      <router-view />
    </div>
    <div class="w-1/4 relative shadow-xl shadow-slate-700 dark:shadow-black h-screen overflow-y-scroll">
      <i-heroicons-solid:x v-if="showPageEditor" class="absolute right-1 top-1 cursor-pointer" @click="showPageEditor = false" />
      <div class="p-2">
        Edit page
        <cgn-form-dropdown v-model="widgetName" :options="widgetList" label="Widget" />
        <pre class="text-xs">{{ selectedWidget }}</pre>
      </div>
    </div>
  </div>
  <div v-if="canShowPageEditor" class="absolute left-1 top-1 cursor-pointer">
    <i-heroicons-solid:pencil v-if="!showPageEditor" @click="showPageEditor = true" />
  </div>
</template>

<script setup lang="ts">
import { CognitoWidget } from '~cognito/models/Cognito/Widget'

const showPageEditor = ref(false)
const widgets = ref<CognitoWidget[]>([])
const canShowPageEditor = computed(() => {
  return widgets.value.length > 0
})
const widgetList = computed(() => {
  return widgets.value.map((e) => {
    return {
      id: e.name,
      name: e.name,
    }
  })
})
const widgetName = ref('')
const selectedWidget = computed(() => {
  return widgets.value.filter(e => e.name == widgetName.value)
})

onMounted(async () => {
  new CognitoWidget().getList().then((data) => {
    widgets.value = data
  })
})
</script>
