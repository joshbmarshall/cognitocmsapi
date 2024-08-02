<template>
  <div ref="searchRef" class="relative w-full" @click="loadOptions()">
    <cgn-form-input v-model="searchTerm" :placeholder="searchValue" :label="label" />
    <div
      v-if="searchResults.length > 0"
      class="absolute top-14 z-10 mt-4 flex max-h-96 w-full flex-col overflow-y-auto rounded-md shadow-lg"
    >
      <div
        v-if="props.emptyName"
        class="cursor-pointer select-none bg-gray-100 p-3 dark:bg-gray-800"
        @click.stop="clearInput()"
      >
        {{ props.emptyName }}
      </div>
      <div
        v-for="(option, index) in searchResults" :key="option.id" class="cursor-pointer select-none p-3"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'"
        @click.stop="selectOption(option)"
      >
        {{ option.value }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gql } from 'graphql-request'
import { $axios } from '~cognito/plugins/axios'

const props = defineProps({
  model: {
    type: String,
  },
  variable: {
    type: String,
  },
  label: {
    type: String,
  },
  emptyName: {
    type: String,
    default: '-- Select --',
  },
})

const searchId = defineModel('id')
const searchValue = defineModel<string>('value')

const searchRef = ref()

const searchTerm = ref('')
const searchResults = ref<{ id: any, value: string }[]>([])

const queryOptions = async (search: string): Promise<{ id: any, value: string }[]> => {
  const data = await $axios.graphql(gql`query dropdownSearchQuery($model: String, $variable: String, $search: String) {
      cognitoMisc {
        dropdownSearch(model: $model, variable: $variable, search: $search) {
          id
          value
        }
      }
    }`, {
    model: props.model,
    variable: props.variable,
    search,
  })
  return (data.cognitoMisc.dropdownSearch)
}

const loadOptions = async () => {
  searchResults.value = await queryOptions(searchTerm.value)
}

const closeOptions = () => {
  searchResults.value = []
}

const selectOption = (option: { id: number, value: string }) => {
  searchId.value = option.id
  searchValue.value = option.value
  searchTerm.value = ''
  closeOptions()
}

const clearInput = () => {
  searchId.value = ''
  searchValue.value = props.emptyName
  searchTerm.value = ''
  closeOptions()
}

watch(() => searchTerm.value, async () => {
  if (searchTerm.value.length < 1) {
    return
  }
  loadOptions()
})

onMounted(async () => {
  if (!searchValue.value) {
    const data = await queryOptions('')
    searchValue.value = data.find(option => option.id == searchId.value)?.value || props.emptyName
  }
})

onClickOutside(searchRef, () => closeOptions())
</script>
