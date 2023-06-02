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
    <cgn-modal v-model="showModal" @close="stopStream()">
      <template #clean-content>
        <cgn-button is-label color-success fullwidth @click="takePhoto">
          Take photo
        </cgn-button>
        <div class="mx-auto my-3">
          <video ref="video" playsinline autoplay class="w-full transform -scale-x-100" />
          <canvas ref="canvas" class="hidden" />
        </div>
      </template>
    </cgn-modal>
  </div>
</template>

<script setup lang="ts">
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

let stream: MediaStream

const showModal = ref(false)
const uploadedthumb = ref('')
const is_completed = ref('')

const thumb = computed(() => {
  if (uploadedthumb.value) {
    return uploadedthumb.value
  }
  return props.thumbnail
})

const video = ref<HTMLVideoElement>()
const canvas = ref<HTMLCanvasElement>()

const constraints = {
  audio: false,
  video: true,
}

function gotStream(newstream: MediaStream) {
  if (video.value) {
    video.value.srcObject = newstream
  }
  stream = newstream
}

function stopStream() {
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop()
    })
  }
}

function takePhoto() {
  if (!canvas.value) {
    return
  }
  if (!video.value) {
    return
  }
  canvas.value.width = props.photoWidth
  canvas.value.height = props.photoWidth * video.value.videoHeight / video.value.videoWidth

  canvas.value.getContext('2d')?.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
  const imageData = canvas.value?.toDataURL('image/jpeg')
  uploadedthumb.value = imageData
  emit('update:modelValue', imageData)
  showModal.value = false
  stopStream()
  is_completed.value = 'yes'
  if (props.onSuccess) {
    props.onSuccess(imageData)
  }
}

function startPhoto() {
  showModal.value = true
  stopStream()
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch((e) => {
    console.log(e)
  })
}
</script>
