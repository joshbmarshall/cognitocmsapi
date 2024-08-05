<template>
  <div>
    <cgn-form-label :label="props.name" />
    <div v-if="imageHash" class="relative flex justify-center overflow-hidden rounded-md bg-gray-300 dark:bg-darkbg-800">
      <cgn-image :image-hash="imageHash" :width="100" aspect="raw" />
      <div class="absolute right-0 top-0 m-1 cursor-pointer rounded-full bg-black/50 p-1" @click="deleteImage()">
        <i-heroicons-solid:trash />
      </div>
    </div>
    <form class="my-2 flex" @submit.prevent="changeImage(imageField)">
      <cgn-form-input v-model="imageField" input-class="py-3" class="!my-0 flex-1" type="text" :placeholder="modelValue" />
      <cgn-button class="ml-1" color-success submit>
        <i-heroicons-solid:plus />
      </cgn-button>
    </form>
    <cgn-button color-info>
      Upload
    </cgn-button>
  </div>
</template>

<script setup lang="ts">
import { gql } from 'graphql-request'
import { nanoid } from 'nanoid'
import { $axios } from '~cognito/plugins/axios'

const props = defineProps({
  name: {
    type: String,
  },
})
const modelValue = defineModel<any>()
const imageHash = defineModel<string>('imageHash', { default: '' })

const imageField = ref('')

const isNumeric = (value: string) => {
  return /^-?\d+$/.test(value)
}

const getImageHash = async (id: number) => {
  const data = await $axios.graphql(gql`query getImageById($id: ID) {
    cognitoImage(id: $id) {
      imageHash
    }
  }`, {
    id,
  })
  return (data.cognitoImage.imageHash)
}
const createImageHash = async (image: string) => {
  const name = nanoid()
  const data = await $axios.graphql(gql`mutation createImage($image: String!, $name: String!) {
    createCognitoImage(image: $image, name: $name) {
      id
      imageHash
    }
  }`, {
    image,
    name,
  })
  return (data.createCognitoImage)
}

const changeImage = async (image: any) => {
  if (!image) {
    return
  }
  if (isNumeric(image)) {
    imageHash.value = await getImageHash(image)
    modelValue.value = image
    imageField.value = ''
    return
  }
  const data = await createImageHash(image)
  imageHash.value = data.imageHash
  modelValue.value = data.id
  imageField.value = ''
}

const deleteImage = () => {
  modelValue.value = 'delete'
  imageHash.value = ''
}
</script>
