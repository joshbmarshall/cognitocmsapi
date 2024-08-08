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
      <cgn-form-input v-model="imageField" input-class="py-3" class="!my-0 flex-1" type="text" placeholder="Paste image or URL" @paste="event => pasteImage(event)" />
      <cgn-button class="ml-1" color-success submit>
        <i-heroicons-solid:plus />
      </cgn-button>
    </form>
    <cgn-upload-image
      v-slot="slot" v-model="uploadedFile"
      :on-success="uploadFile"
    >
      <cgn-button color-info fullwidth is-label>
        Upload
        <input type="file" class="hidden" @change="slot.upload">
      </cgn-button>
      <div>
        <cgn-progress v-if="slot.progress > 0" :progress="slot.progress" />
      </div>
    </cgn-upload-image>
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
const uploadedFile = ref('')

const isNumeric = (value: string) => {
  return /^-?\d+$/.test(value)
}

const getImageHash = async (id: number) => {
  const data = await $axios.graphql(gql`query getImageById($id: ID) {
    cognitoImage(id: $id) {
      imageHashes {
        image
      }
    }
  }`, {
    id,
  })
  return (data.cognitoImage.imageHashes.image)
}
const createImageHash = async (image: string) => {
  const name = nanoid()
  const data = await $axios.graphql(gql`mutation createImage($image: String!, $name: String!) {
    createCognitoImage(image: $image, name: $name, is_temporary: true) {
      id
      imageHashes {
        image
      }
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
  imageHash.value = data.imageHashes.image
  modelValue.value = data.id
  imageField.value = ''
}

const deleteImage = () => {
  modelValue.value = 'delete'
  imageHash.value = ''
}

const uploadFile = async () => {
  const data = await createImageHash(uploadedFile.value)
  imageHash.value = data.imageHashes.image
  modelValue.value = data.id
  imageField.value = ''
}

const pasteImage = async (event: ClipboardEvent) => {
  const { clipboardData } = event
  if (!clipboardData) {
    return
  }

  for (let index = 0; index < clipboardData.items.length; index++) {
    const clipboardItem = clipboardData.items[index]
    if (!clipboardItem.type.startsWith('image')) {
      continue
    }
    const blob = clipboardItem.getAsFile()
    if (!blob) {
      continue
    }

    const arrayBuffer = await blob.arrayBuffer()
    let string = ''
    new Uint8Array(arrayBuffer).forEach((byte) => {
      string += String.fromCharCode(byte)
    })

    const data = await createImageHash(`base64,${btoa(string)}`)
    imageHash.value = data.imageHashes.image
    modelValue.value = data.id
    imageField.value = ''
  }
}
</script>
