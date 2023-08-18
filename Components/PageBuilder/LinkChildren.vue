<template>
  <div class="mx-auto max-w-xl space-y-2 p-6 text-center sm:p-12">
    <p class="mb-10 text-2xl font-medium">
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
