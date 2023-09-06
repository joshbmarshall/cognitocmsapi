<template>
  <div class="mx-auto flex max-w-7xl flex-wrap gap-2 p-2">
    <div v-for="tag in tags" :key="tag.name" class="border-l-2 border-brand-500 py-0.5 pl-2 pr-0.5 text-black shadow transition-shadow duration-300 hover:shadow-md dark:bg-darkbg-500 dark:text-white">
      <cgn-link :to="`/shop/bytag/${tag.name}`">
        <div class="flex text-base text-black dark:text-white">
          <span>{{ tag.name }}</span>
          <span class="pl-1 text-xs">{{ tag.countModel }}</span>
        </div>
      </cgn-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gql } from 'graphql-request'
import { $axios } from '~cognito/plugins/axios'

const props = defineProps({
  model: {
    type: String,
    required: true,
  },
})

const tags = ref<{
  name: string
  countModel: number
}[]>([])
const loadTags = async () => {
  const data = await $axios.graphql(gql`query tagCloudQuery($modelType: String!){
    cognitoTags {
      name
      countModel(model:$modelType)
    }
  }`, {
    modelType: props.model,
  })
  tags.value = data.cognitoTags.sort((a, b) => a.countModel < b.countModel)
}

onMounted(() => loadTags())
onServerPrefetch(async () => await loadTags())
</script>
