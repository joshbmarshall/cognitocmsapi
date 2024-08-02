<template>
  <div>
    <cgn-form-label class="cgn-input-wrapper" :label="props.label">
      <select
        v-model="modelValue" class="cgn-input-field block w-full bg-white p-2"
      >
        <option value="">
          -- None --
        </option>
        <option v-for="option in dropdownOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </cgn-form-label>
  </div>
</template>

<script setup lang="ts">
import { gql } from 'graphql-request'
import { $axios } from '~cognito/plugins/axios'

const props = defineProps({
  label: {
    type: String,
  },
})

const modelValue = defineModel()

const dropdownOptions = ref([])

const getOptions = async () => {
  const data = await $axios.graphql(gql`query pagesQuery {
      cognitoMisc {
        modellist
      }
    }`)
  return (data.cognitoMisc.modellist)
}

onMounted(async () => {
  dropdownOptions.value = await getOptions()
})
</script>
