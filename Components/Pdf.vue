<template>
  <VuePdfEmbed annotation-layer text-layer :source="pdfSrc" />
</template>

<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const props = defineProps({
  pdf: {
    type: String,
    required: true,
  },
})
const pdfSrc = ref<VuePdfPropsType['src']>('')
const doload = () => {
  if (!props.pdf) {
    return
  }
  pdfSrc.value = props.pdf
}

watch(() => props.pdf, () => doload())
onMounted(() => {
  doload()
})
</script>
