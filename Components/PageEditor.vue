<template>
  <div
    class="size-full overflow-y-scroll overscroll-contain bg-darkbg-500 p-2 shadow-xl shadow-slate-700 dark:shadow-black"
  >
    <div class="flex items-center justify-between pb-2 text-xl">
      <span>Edit {{ pageStore.currentPage.name }}</span>
      <i-heroicons-solid:x class="cursor-pointer" @click="emit('closeEditor')" />
    </div>
    <cgn-button color-success fullwidth class="flex items-center justify-center gap-1" @click="openAddWidgetModal()">
      <i-heroicons-solid:plus /> Add widget
    </cgn-button>
    <div v-for="widget in pageStore.currentPage.pageContents" :key="widget.name">
      {{ widget.name }} {{ widget.template }}
    </div>
    <!-- TODO make the current iterator work for new system
    <div v-for="row in pageStore.currentPage.rows" :key="row.id">
      <div v-for="block in row.blocks" :key="block.id">
        <div v-for="widget, idx in block.widgets" :key="idx">
          <div v-for="templatevar, tvname in widget.templatevar" :key="tvname">
            <cgn-widget-edit
              v-model="widget.templatevar[tvname]" :widget-name="widget.outer" :var-name="tvname"
              :widgets="widgets"
            />
          </div>
        </div>
      </div>
    </div>
    -->
    <cgn-modal v-model="addWidgetModalOpen">
      <template #clean-content>
        <div class="grid grid-cols-3 gap-2">
          <cgn-button
            v-for="template in pageEditor.widgetTemplates.value"
            :key="template.name" color-brand
            class="flex items-center gap-1" @click="addWidget(template)"
          >
            <i-heroicons-solid:plus /> {{ template.name }}
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
const pageEditor = usePageEditor()

const addWidgetModalOpen = ref(false)

const openAddWidgetModal = () => {
  addWidgetModalOpen.value = true
}

const addWidget = (template: PageWidgetTemplate) => {
  addWidgetModalOpen.value = false
  pageEditor.addEditorWidget(template)
}
</script>
