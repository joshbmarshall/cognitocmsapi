<template>
  <div class="mx-auto my-3">
    <video ref="video" playsinline autoplay class="w-full transform" />
    <canvas ref="canvas" class="hidden" />
  </div>
</template>

<script setup lang="ts">
import jsQR from 'jsqr'

const emit = defineEmits(['update:modelValue', 'decoded'])
let timer = 0

let stream: MediaStream
const video = ref<HTMLVideoElement>()
const canvas = ref<HTMLCanvasElement>()

const constraints = {
  audio: false,
  video: {
    facingMode: 'environment',
  },
}

function gotStream(newstream: MediaStream) {
  if (video.value) {
    video.value.srcObject = newstream
  }
  stream = newstream
}

function stopStream() {
  clearInterval(timer)
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop()
    })
  }
}

function checkQrCode() {
  if (!canvas.value) {
    return
  }
  if (!video.value) {
    return
  }
  if (video.value.videoWidth == 0) {
    return
  }

  canvas.value.width = video.value.videoWidth
  canvas.value.height = video.value.videoWidth

  canvas.value.getContext('2d')?.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
  const imageData = canvas.value?.getContext('2d')?.getImageData(0, 0, canvas.value.width, canvas.value.height)

  const code = jsQR(imageData?.data, canvas.value.width, canvas.value.height, {
    inversionAttempts: 'dontInvert',
  })

  if (code) {
    emit('update:modelValue', code.data)
    emit('decoded', code.data)
    stopStream()
  }
}

function startPhoto() {
  stopStream()
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch((e) => {
    console.log(e)
  })
  timer = setInterval(() => {
    checkQrCode()
  }, 250)
}
onMounted(() => {
  startPhoto()
})
</script>
