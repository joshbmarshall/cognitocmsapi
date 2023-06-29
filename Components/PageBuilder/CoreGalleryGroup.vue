<template>
  <pre class="text-xs">
  {{ galleries }}
  </pre>
</template>

<script lang="ts">
import { CognitoGallery } from '~cognito/models/Cognito/Gallery'

class Templatevars {
  group?: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})

const galleries = ref<CognitoGallery[]>([])

onMounted(() => {
  new CognitoGallery().find_many({
    group: props.templatevar.group,
  }).then((data) => {
    galleries.value = data.mapped
  })
})
</script>
