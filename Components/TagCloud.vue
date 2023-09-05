<template>
  <div v-for="tag in tags" :key="tag.name">
    <cgn-link :to="`/shop/byurl/${tag.name}`">
      {{ tag.name }}
      ({{ tag.countModel }})
    </cgn-link>
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
