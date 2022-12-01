<template>
  <VuePdf v-for="page in numOfPages" :key="page" :src="pdfSrc" :page="page" />
</template>

<script setup lang="ts">
import type { VuePdfPropsType } from 'vue3-pdfjs/components/vue-pdf/vue-pdf-props'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import { VuePdf, createLoadingTask } from 'vue3-pdfjs/esm'

const props = defineProps({
  pdf: {
    type: String,
    required: true,
  },
})
const pdfSrc = ref<VuePdfPropsType['src']>('')
const numOfPages = ref(0)

const doload = () => {
  console.log('doload')
  if (!props.pdf) {
    return
  }
  pdfSrc.value = props.pdf
  const loadingTask = createLoadingTask(pdfSrc.value)
  loadingTask.promise.then((pdf: PDFDocumentProxy) => {
    numOfPages.value = pdf.numPages
  })
}

watch(() => props.pdf, () => doload())
onMounted(() => {
  doload()
})
</script>
