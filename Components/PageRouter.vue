<template>
  <router-view v-if="!showPageEditor" />
  <div v-else class="flex">
    <div class="h-screen w-3/4 overflow-y-scroll">
      <router-view />
    </div>
    <div class="relative h-screen w-1/4 overflow-y-scroll shadow-xl shadow-slate-700 dark:shadow-black">
      <i-heroicons-solid:x v-if="showPageEditor" class="absolute right-1 top-1 cursor-pointer" @click="showPageEditor = false" />
      <div class="p-2">
        Edit page
        <div v-for="row in pageStore.currentPage.rows" :key="row.id">
          <div v-for="block in row.blocks" :key="block.id">
            <div v-for="widget, idx in block.widgets" :key="idx">
              <div v-for="templatevar, tvname in widget.templatevar" :key="tvname">
                <cgn-widget-edit v-model="widget.templatevar[tvname]" :widget-name="widget.outer" :var-name="tvname" :widgets="widgets" />
              </div>
            </div>
          </div>
        </div>
        <cgn-form-dropdown v-model="widgetName" :options="widgetList" label="Widget" />
      </div>
    </div>
  </div>
  <div v-if="canShowPageEditor" class="absolute left-1 top-1 cursor-pointer">
    <i-heroicons-solid:pencil v-if="!showPageEditor" @click="showPageEditor = true" />
  </div>
  <div class="pointer-events-none fixed inset-x-0 top-0 z-50 p-2">
    <div v-for="toast in useToastStore().toasts" :key="toast.id" class="ml-auto w-full max-w-sm">
      <cgn-alert-success v-if="toast.type == 'success'">
        {{ toast.message }}
      </cgn-alert-success>
      <cgn-alert-info v-if="toast.type == 'info'">
        {{ toast.message }}
      </cgn-alert-info>
      <cgn-alert-danger v-if="toast.type == 'fail'">
        {{ toast.message }}
      </cgn-alert-danger>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CognitoWidget } from '~cognito/models/Cognito/Widget'
import { useToastStore } from '~cognito/stores/toast'

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
  return widgets.value.find(e => e.name == widgetName.value)
})
const pageStore = usePageStore()

onMounted(async () => {
  new CognitoWidget().getList().then((data) => {
    widgets.value = data
  })
})
</script>
