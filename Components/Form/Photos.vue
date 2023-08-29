<template>
  <div class="space-y-2">
    <label class="block select-none pl-1 text-sm text-gray-800 dark:text-gray-200">{{ label }}</label>
    <div class="flex flex-wrap">
      <div v-for="photo in photos" :key="photo.id" class="w-1/2 p-2 sm:w-1/3 md:w-1/6">
        <div class="flex aspect-square">
          <div class="flex items-center justify-center overflow-hidden rounded bg-secondary-100 dark:bg-darkbg-500">
            <img :src="photo.uploadthumb" class="h-48 w-48 object-contain">
          </div>
        </div>
        <cgn-progress v-if="!photo.is_completed" :progress="photo.uploadProgress" />
      </div>
    </div>
    <div>
      <cgn-button is-label color-brand>
        {{ fileButtonLabel }}
        <input
          type="file"
          accept="image/*"
          :required="required"
          class="hidden"
          multiple
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
</template>

<script setup lang="ts">
import { CognitoUpload } from '~cognito/models/Cognito/Upload'

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
  width: {
    type: Number,
    default: 300,
  },
})
const emit = defineEmits(['update:modelValue'])
const is_completed = ref('')
const photos = ref<CognitoUpload[]>([])

const upload = (e) => {
  // Get the selected files from the input element
  for (let index = 0; index < e.target.files.length; index++) {
    const file = e.target.files[index]
    const item = reactive(new CognitoUpload({
      file,
    }))
    photos.value.push(item)
    item.startUpload()
  }
}
watch (() => photos, () => {
  emit('update:modelValue', photos.value.map(e => e.uuid))
}, {
  deep: true,
})
</script>
