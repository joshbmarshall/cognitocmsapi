<template>
  <div class="space-y-2">
    <label class="block select-none pl-1 text-sm text-gray-800 dark:text-gray-200">{{ label }}</label>
    <div class="flex items-center space-x-6">
      <div v-if="thumb" class="shrink-0">
        <img class="h-16 w-16 rounded-full bg-white object-cover" :src="thumb" :width="width">
      </div>
      <div>
        <input
          type="file"
          class="block w-full text-sm text-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 dark:file:bg-blue-600 dark:file:hover:bg-blue-700"
          accept="image/*"
          @change="upload"
        >
      </div>
    </div>
    <FormProgress v-if="progress > 0" :progress="progress" />
  </div>
</template>

<script setup lang="ts">
import * as tus from 'tus-js-client'
import { nanoid } from 'nanoid'
import { baseURL } from '~/config'

const props = defineProps({
  label: {
    type: String,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  url: {
    type: String,
    default: '/cms',
  },
  required: {
    type: Boolean,
    default: false,
  },
  onSuccess: {
    type: Function,
  },
  thumbnail: {
    type: String,
  },
  width: {
    type: Number,
    default: 300,
  },
})
const progress = ref(0)
const filename = ref('')
const uploadedthumb = ref('')

const thumb = computed(() => {
  if (uploadedthumb.value) {
    return uploadedthumb.value
  }
  return props.thumbnail
})
const emit = defineEmits(['update:modelValue'])
const upload = (e) => {
  // Get the selected file from the input element
  const file: File = e.target.files[0]
  if (!file) {
    return
  }

  // display uploading file as thumbnail
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedthumb.value = e.target.result
  }
  reader.readAsDataURL(file)

  filename.value = ''
  progress.value = 0

  const uuid = nanoid()

  // Create a new tus upload
  const upload = new tus.Upload(file, {
    // Endpoint is the upload creation URL from your tus server
    endpoint: `${baseURL}/cms/cognito/tus`,
    // Retry delays will enable tus-js-client to automatically retry on errors
    retryDelays: [0, 3000, 5000, 10000, 20000],
    // Attach additional meta data about the file for the server
    metadata: {
      // filename: file.name,
      filename: uuid,
      filetype: file.type,
    },
    // Upload again if asked to
    removeFingerprintOnSuccess: true,
    // Callback for errors which cannot be fixed using retries
    onError(error) {
      console.log(`Failed because: ${error}`)
    },
    // Callback for reporting upload progress
    onProgress(bytesUploaded, bytesTotal) {
      progress.value = Math.round(bytesUploaded / bytesTotal * 100)
    },
    // Callback for once the upload is completed
    onSuccess() {
      filename.value = upload.file.name
      emit('update:modelValue', uuid)
      if (props.onSuccess) {
        props.onSuccess(uuid, upload.file.name)
      }
      setTimeout(() => {
        progress.value = 0
      }, 1000)
    },
  })

  // Start the upload
  upload.start()
}
</script>
