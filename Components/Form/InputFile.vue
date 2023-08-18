1<template>
  <div class="space-y-2">
    <cgn-form-label class="cgn-input-wrapper" :label="label" :required="required">
      <div class="flex items-center space-x-6">
        <div>
          <input
            type="file"
            class="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700 dark:file:bg-blue-600 dark:file:hover:bg-blue-700"
            disabled-accept="image/*"
            @change="upload"
          >
        </div>
      </div>
    </cgn-form-label>
    <cgn-progress v-if="progress > 0" :progress="progress" />
  </div>
</template>

<script setup lang="ts">
import * as tus from 'tus-js-client'
import { nanoid } from 'nanoid'
import { config } from '~/config'

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
})
const emit = defineEmits(['update:modelValue'])
const progress = ref(0)
const filename = ref('')
const upload = (e) => {
  // Get the selected file from the input element
  const file: File = e.target.files[0]
  if (!file) {
    return
  }
  filename.value = ''
  progress.value = 0

  const uuid = nanoid()

  // Create a new tus upload
  const upload = new tus.Upload(file, {
    // Endpoint is the upload creation URL from your tus server
    endpoint: `${config.baseURL}/cms/cognito/tus`,
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
