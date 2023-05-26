<template>
  <div class="p-6 sm:p-12 space-y-2 max-w-xl mx-auto text-center">
    <p class="text-2xl font-medium mb-10">
      Links
    </p>
    <div v-for="link in links" :key="link.id">
      <a :href="link.link" target="_blank">
        {{ link.name }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { CognitoLink } from '~cognito/models/Cognito/Link'

class Templatevars {
  top_level?: number
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})

const links = ref<CognitoLink[]>([])
const loadLinks = async () => {
  const data = await (new CognitoLink()).find_many({
    parent: props.templatevar.top_level,
  })
  links.value = data.data
}
onMounted(() => {
  loadLinks()
})
onServerPrefetch(async () => {
  await loadLinks()
})
</script>
