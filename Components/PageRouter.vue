<template>
  <div :class="{ 'w-3/4': showPageEditor }">
    <router-view />
  </div>
  <div v-if="showPageEditor" class="fixed right-0 top-0 z-50 h-screen w-1/4">
    <cgn-page-editor :widgets="widgets" @close-editor="showPageEditor = false" />
  </div>
  <div v-if="canShowPageEditor && !showPageEditor" class="absolute left-1 top-1 z-50 hidden cursor-pointer rounded-full bg-white/50 p-1 dark:bg-black/50 sm:block" @click="showPageEditor = true">
    <i-heroicons-solid:pencil class="text-black dark:text-white" />
  </div>
  <cgn-toast-output />
</template>

<script setup lang="ts">
import { CognitoWidget } from '~cognito/models/Cognito/Widget'
import { config } from '~/config'

const showPageEditor = ref(false)
const widgets = ref<CognitoWidget[]>([])

const canShowPageEditor = computed(() => {
  if (!config.listPageContentFeature) {
    return false
  }
  return widgets.value.length > 0
})

onMounted(async () => {
  new CognitoWidget().getList().then((data) => {
    widgets.value = data
  })
})
// TODO replace cognitowidget getlist check with a proper user is admin check
</script>
