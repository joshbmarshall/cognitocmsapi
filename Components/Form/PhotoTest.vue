<template>
  <div>
    TEST

    <video ref="video" playsinline autoplay />
    <button @click="takePhoto">
      Take snapshot
    </button>
    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
// Put variables in global scope to make them available to the browser console.
const video = ref<HTMLVideoElement>()
const canvas = ref<HTMLCanvasElement>()

const constraints = {
  audio: false,
  video: true,
}

function handleSuccess(stream: MediaProvider) {
  console.log(stream)
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
  canvas.value.width = video.value.videoWidth
  canvas.value.height = video.value.videoHeight

  canvas.value.getContext('2d')?.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
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
