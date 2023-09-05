<template>
  <div class="flex flex-col gap-6 p-6">
    <div v-for="(person, index) in people" :key="index" class="flex flex-col sm:flex-row sm:p-6" :class="{ 'sm:justify-end': index % 2 }">
      <cgn-lazy-image :image="person.photo" class="aspect-[4/3] sm:w-1/2 sm:px-4" :class="{ 'sm:order-last': index % 2 }" />
      <div class="flex flex-col sm:w-1/2" :class="{ 'sm:items-end sm:text-right': index % 2 }">
        <div class="font-title text-3xl font-semibold uppercase">
          {{ person.first_name }}
        </div>
        <div class="font-title text-xl uppercase">
          {{ person.last_name }}
        </div>
        <div>{{ person.title }}</div>
        <div class="prose prose-p:my-0" v-html="person.description" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CognitoPerson } from '~cognito/models/Cognito/Person'

const people = ref<CognitoPerson[]>([])
async function loadPeople() {
  const data = await new CognitoPerson().find_many({
    page_size: 64,
    image_aspect: '4x3',
    image_width: 900,
  })
  people.value = data.data
}
onMounted(() => {
  loadPeople()
})
onServerPrefetch(async () => {
  await loadPeople()
})
</script>
