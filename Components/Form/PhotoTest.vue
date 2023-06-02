<template>
  <div>
    <video ref="video" playsinline autoplay class="w-full transform -scale-x-100" />
    <button @click="takePhoto">
      Take snapshot
    </button>
    <canvas ref="canvas" class="hidden" />
    <img :src="dataURL">
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

const video = ref<HTMLVideoElement>()
const canvas = ref<HTMLCanvasElement>()
const dataURL = ref('')

const constraints = {
  audio: false,
  video: true,
}

function handleSuccess(stream: MediaProvider) {
  if (video.value) {
    video.value.srcObject = stream
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
  dataURL.value = imageData
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name)
}

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = 480
    canvas.value.height = 360
  }
  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError)
})
</script>
