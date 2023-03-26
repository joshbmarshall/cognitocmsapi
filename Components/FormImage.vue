<template>
  <div class="space-y-2">
    <label class="block select-none pl-1 text-sm text-gray-800 dark:text-gray-200">{{ label }}</label>
    <div class="flex items-center space-x-4">
      <div v-if="thumb" class="shrink-0">
        <img class="h-16 w-16 rounded-full bg-white object-cover" :src="thumb" :width="width">
      </div>
      <div v-else>
        <i-heroicons-outline:user-circle class="h-16 w-16 text-gray-500" />
      </div>
      <div>
        <cgn-button is-label color-brand>
          {{ fileButtonLabel }}
          <input
            type="file"
            accept="image/*"
            capture="camera"
            :required="required"
            class="hidden"
            @change="upload"
          >
        </cgn-button>
        <input
          v-model="is_completed"
          type="text"
          :required="required"
          class="hidden"
        >
      </div>
    </div>
    <cgn-progress v-if="showProgress" :progress="progress" />
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
  fileButtonLabel: {
    type: String,
    default: 'Browse...',
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
const emit = defineEmits(['update:modelValue'])
const progress = ref(0)
const filename = ref('')
const uploadedthumb = ref('')
const is_completed = ref('')

const thumb = computed(() => {
  if (uploadedthumb.value) {
    return uploadedthumb.value
  }
  return props.thumbnail
})

const showProgress = computed(() => {
  return progress.value > 0
})
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
      is_completed.value = ''
    },
    // Callback for reporting upload progress
    onProgress(bytesUploaded, bytesTotal) {
      progress.value = Math.round(bytesUploaded / bytesTotal * 100)
      is_completed.value = ''
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
        is_completed.value = 'yes'
      }, 1000)
    },
  })

  // Start the upload
  upload.start()
}
</script>
