<template>
  <div :style="parallaxStyle" class="bg-cover bg-fixed bg-center">
    <div class="absolute z-0 h-[500px] w-full bg-slate-900 opacity-40" />
    <div class="z-1 relative" :class="props.class">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CognitoImage } from '~cognito/models/Cognito/Image'

const props = defineProps({
  imageId: {
    type: Number,
    default: 0,
  },
  imageAspect: {
    type: String,
    default: '16x9',
  },
  imageWidth: {
    type: Number,
    default: 1920,
  },
  class: {
    type: String,
    default: '',
  },
})

const webp = ref('')
const url = ref('')
const placeholder = ref('')

const parallaxStyle = computed(() => {
  return {
    'background-image': `url(${url.value})`,
    'min-height': '500px',
  }
})

const loadImage = async () => {
  if (props.imageId && props.imageAspect && props.imageWidth) {
    await new CognitoImage().find_one({
      url: props.imageId,
      image_aspect: props.imageAspect,
      image_width: props.imageWidth,
    })
      .then((data) => {
        webp.value = data.webp_url
        url.value = data.url
        placeholder.value = data.placeholder
      })
  }
}
onMounted(() => {
  loadImage()
})
onServerPrefetch(async () => {
  await loadImage()
})
</script>
