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
        <cgn-button is-label color-brand @click="startPhoto">
          {{ fileButtonLabel }}
        </cgn-button>
        <input
          v-model="is_completed"
          type="text"
          :required="required"
          class="hidden"
        >
      </div>
    </div>
    <cgn-modal v-model="showModal" @close="stopCamera()">
      <template #clean-content>
        <cgn-button is-label color-success fullwidth @click="takePhoto">
          Take photo
        </cgn-button>
        <div class="mx-auto">
          <video ref="video" muted autoplay class="w-full transform -scale-x-100" />
          <canvas ref="canvas" class="hidden" :width="props.photoWidth" :height="canvasHeight" />
        </div>
        <div v-if="cameras.length > 1" class="px-2 py-1">
          <cgn-button
            v-for="camera, camid of cameras"
            :key="camera.deviceId"
            class="inline-block mr-2"
            :color-brand="currentCamera === camera.deviceId"
            is-label
            @click="useCamera(camera.deviceId)"
          >
            Cam {{ camid + 1 }}
          </cgn-button>
        </div>
      </template>
    </cgn-modal>
  </div>
</template>

<script setup lang="ts">
import { useDevicesList, useUserMedia } from '@vueuse/core'

const props = defineProps({
  label: {
    type: String,
  },
  fileButtonLabel: {
    type: String,
    default: 'Take Photo',
  },
  modelValue: {
    type: [String, Number],
    default: '',
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
  photoWidth: {
    type: Number,
    default: 500,
  },
})

const emit = defineEmits(['update:modelValue'])

const showModal = ref(false)
const uploadedthumb = ref('')
const is_completed = ref('')

const thumb = computed(() => {
  if (uploadedthumb.value) {
    return uploadedthumb.value
  }
  return props.thumbnail
})

const currentCamera = ref<string>()
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value)) {
      currentCamera.value = cameras.value[0]?.deviceId
    }
  },
})

const video = ref<HTMLVideoElement>()
const canvas = ref<HTMLCanvasElement>()
const { stream, enabled } = useUserMedia({
  constraints: {
    video: {
      deviceId: currentCamera,
      facingMode: 'user',
    },
  },
})

const canvasHeight = ref(500)
watchEffect(() => {
  if (video.value) {
    video.value.srcObject = stream.value!
  }
})

function useCamera(camera_id: string) {
  enabled.value = false
  currentCamera.value = camera_id
  nextTick(() => {
    enabled.value = true
  })
}

function startPhoto() {
  showModal.value = true
  enabled.value = true
}
function takePhoto() {
  if (!video.value?.clientWidth) {
    return
  }
  canvasHeight.value = props.photoWidth * video.value.clientHeight / video.value.clientWidth

  nextTick(() => {
    const context = canvas.value?.getContext('2d')

    // Make a 500px image
    const width = props.photoWidth
    const height = width * video.value?.clientHeight / video.value?.clientWidth
    context?.drawImage(video.value, 0, 0, width, height)
    const imageData = canvas.value?.toDataURL('image/jpeg')

    uploadedthumb.value = imageData
    emit('update:modelValue', imageData)
    showModal.value = false
    enabled.value = false
    is_completed.value = 'yes'
    if (props.onSuccess) {
      props.onSuccess(imageData)
    }
  })
}

function stopCamera() {
  enabled.value = false
}
</script>
