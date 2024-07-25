<template>
  <div class="size-full overflow-y-scroll overscroll-contain bg-darkbg-500 p-2 shadow-xl shadow-slate-700 dark:shadow-black">
    <div class="flex items-center justify-between text-lg">
      <span>Edit {{ pageStore.currentPage.name }}</span>
      <i-heroicons-solid:x class="cursor-pointer" @click="emit('closeEditor')" />
    </div>
    <div v-for="row in pageStore.currentPage.rows" :key="row.id">
      <div v-for="block in row.blocks" :key="block.id">
        <div v-for="widget, idx in block.widgets" :key="idx">
          <div v-for="templatevar, tvname in widget.templatevar" :key="tvname">
            <cgn-widget-edit
              v-model="widget.templatevar[tvname]" :widget-name="widget.outer" :var-name="tvname"
              :widgets="props.widgets"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CognitoWidget } from '~cognito/models/Cognito/Widget'

const props = defineProps({
  widgets: {
    type: Array<CognitoWidget>,
  },
})

const emit = defineEmits(['closeEditor'])

const pageStore = usePageStore()
</script>
