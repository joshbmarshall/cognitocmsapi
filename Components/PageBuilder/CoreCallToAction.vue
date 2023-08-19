<template>
  <div class="mx-auto space-y-2 lg:col-start-1 lg:row-start-1 lg:max-w-none">
    <div class="relative">
      <div class="absolute inset-0 bg-cover bg-center" :style="{ 'background-image': `url(${url})` }" />
      <div class="relative flex flex-col items-center justify-center gap-2 md:flex-row" :class="textClass">
        <cgn-lazy-image v-if="templatevar.left_image" :image-id="templatevar.left_image" image-width="300" image-aspect="16:9" class="w-full md:w-1/2" />
        <div class="w-full p-4 md:w-1/2 md:p-8">
          <div class="pb-2 font-display text-xl font-semibold xl:text-4xl">
            {{ templatevar.heading }}
          </div>
          <div v-if="templatevar.subheading" class="mb-2 font-display text-xl font-semibold">
            {{ templatevar.subheading }}
          </div>
          <div v-if="templatevar.html" class="prose-invert max-w-none pb-2" v-html="templatevar.html" />
          <cgn-button v-if="templatevar.button_link" :url="templatevar.button_link" :templatevar-colour="templatevar.button_colour">
            {{ templatevar.button_text }}
          </cgn-button>
        </div>
        <cgn-lazy-image v-if="templatevar.right_image" :image-id="templatevar.right_image" image-width="300" image-aspect="16:9" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CognitoImage } from '~cognito/models/Cognito/Image'

class Templatevars {
  heading?: string
  subheading?: string
  html?: string
  background_image?: string
  left_image?: string
  right_image?: string
  text_colour?: string
  button_link?: string
  button_text?: string
  button_colour?: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})

const textClass = computed(() => {
  if (props.templatevar.text_colour == 'wht') {
    return 'text-white'
  }
  if (props.templatevar.text_colour == 'blk') {
    return 'text-black'
  }
  return ''
})

const url = ref('')
const loadImage = async () => {
  if (props.templatevar.background_image) {
    // url.value = props.templatevar.background_image
    await new CognitoImage().find_one({
      url: props.templatevar.background_image,
      image_aspect: '16x9',
      image_width: 1920,
    })
      .then((data) => {
        if (data.url) {
          url.value = data.url
        }
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
