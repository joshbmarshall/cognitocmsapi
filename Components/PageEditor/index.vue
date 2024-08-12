<template>
  <div
    class="flex size-full flex-col bg-white p-2 shadow-xl shadow-slate-700 dark:bg-darkbg-500 dark:shadow-black"
  >
    <div class="flex items-center justify-between pb-2 text-xl">
      <span>Edit {{ pageStore.currentPage.name }}</span>
      <i-heroicons-solid:x class="cursor-pointer" @click="emit('closeEditor')" />
    </div>
    <cgn-button color-success fullwidth class="flex items-center justify-center gap-1" @click="openAddWidgetModal()">
      <i-heroicons-solid:plus /> Add widget
    </cgn-button>
    <div class="flex flex-1 flex-col gap-2 overflow-y-scroll overscroll-contain py-2">
      <cgn-page-editor-widget
        v-for="(widget, index) in pageStore.currentPage.pageContents" :key="widget.sort_order"
        v-model="pageStore.currentPage.pageContents[index]" :template="pageEditor.getTemplate(widget.template)"
      />
    </div>
    <div class="flex overflow-hidden rounded-md shadow">
      <cgn-button color-success fullwidth class="!rounded-none !shadow-none" @click="savePageChanges()">
        Save
      </cgn-button>
      <cgn-button color-secondary fullwidth class="!rounded-none !shadow-none" @click="cancelPageChanges()">
        Cancel
      </cgn-button>
    </div>
    <cgn-modal v-model="addWidgetModalOpen">
      <template #clean-content>
        <div class="grid grid-cols-3 gap-2">
          <cgn-button
            v-for="template in pageEditor.widgetTemplates.value"
            :key="template.name" color-brand
            class="flex items-center gap-1" :title="template.name"
            @click="addWidget(template)"
          >
            <i-heroicons-solid:plus />
            <div class="max-w-[90%] overflow-hidden text-ellipsis text-nowrap">
              {{ template.name }}
            </div>
          </cgn-button>
        </div>
      </template>
    </cgn-modal>
  </div>
</template>

<script setup lang="ts">
import type { PageWidgetTemplate } from '~cognito/models/Page/WidgetTemplate'

const emit = defineEmits(['closeEditor'])

const pageStore = useListPageStore()
const toastStore = useToastStore()
const pageEditor = usePageEditor()

const addWidgetModalOpen = ref(false)

const openAddWidgetModal = () => {
  addWidgetModalOpen.value = true
}

const addWidget = (template: PageWidgetTemplate) => {
  addWidgetModalOpen.value = false
  pageEditor.addEditorWidget(template)
}

const savePageChanges = async () => {
  await pageEditor.savePageChanges()
  toastStore.addToast('Page Saved', 'success', 2500)
}
const cancelPageChanges = async () => {
  await pageEditor.cancelPageChanges()
  toastStore.addToast('Changes Cancelled', 'info', 2500)
}
</script>
