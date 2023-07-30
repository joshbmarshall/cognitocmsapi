<template>
  <div class="mx-auto max-w-7xl">
    <cgn-pdf :pdf="pdfSrc" />
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'
import { CognitoBase } from '~cognito/models/Cognito/Base'

const props = defineProps({
  pdfcode: {
    type: String,
    required: true,
  },
})
const pdfSrc = ref('')
onMounted(() => {
  const url = new CognitoBase({}).fileDownloadUrl(props.pdfcode)
  pdfSrc.value = `${config.baseURL}${url}`
})
</script>
