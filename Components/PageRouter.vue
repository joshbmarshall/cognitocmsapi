<template>
  <router-view v-if="!showPageEditor" />
  <div v-else class="flex">
    <div class="w-3/4">
      <router-view />
    </div>
    <div class="fixed right-0 top-0 z-50 h-screen w-1/4">
      <cgn-page-editor :widgets="widgets" @close-editor="showPageEditor = false" />
    </div>
  </div>
  <div v-if="canShowPageEditor" class="absolute left-1 top-1 z-50 cursor-pointer">
    <i-heroicons-solid:pencil v-if="!showPageEditor" @click="showPageEditor = true" />
  </div>
  <cgn-toast-output />
</template>

<script setup lang="ts">
import { CognitoWidget } from '~cognito/models/Cognito/Widget'

const showPageEditor = ref(false)
const widgets = ref<CognitoWidget[]>([])

const canShowPageEditor = computed(() => {
  return widgets.value.length > 0
})

onMounted(async () => {
  new CognitoWidget().getList().then((data) => {
    widgets.value = data
  })
})
</script>
