<template>
  <div v-if="props.templatevar.heading" class="prose dark:prose-dark mx-auto max-w-6xl">
    <h1>{{ props.templatevar.heading }}</h1>
    <p v-if="props.templatevar.subheading">
      {{ props.templatevar.subheading }}
    </p>
  </div>
  <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 max-w-6xl p-2 mx-auto gap-2">
    <div v-for="gallery in galleries" :key="gallery.url" class="group bg-black overflow-hidden relative" @click="selectGallery(gallery)">
      <div class="space-y-2 text-white mx-auto lg:max-w-none lg:row-start-1 lg:col-start-1">
        <div :class="outerClass(gallery.slides[0])" class="relative aspect-square">
          <div class="absolute inset-0 bg-center bg-cover transition-opacity duration-300 group-hover:opacity-50" :class="[imageClass(gallery.slides[0])]" :style="{ 'background-image': `url(${gallery.slides[0].image.url})` }" />
        </div>
      </div>
      <div v-if="gallery.heading" class="absolute right-0 bottom-0 p-2 text-right translate-y-full group-hover:translate-y-0 text-white transition-transform duration-300">
        <div class="text-2xl font-semibold font-display">
          {{ gallery.heading }}
        </div>
        <div v-if="gallery.sub_heading" class="font-semibold font-display">
          {{ gallery.sub_heading }}
        </div>
      </div>
    </div>
  </div>

  <div ref="miniGallery" class="pt-4">
    <div v-if="selectedGallery.heading" class="prose dark:prose-dark mx-auto max-w-6xl">
      <h1>{{ selectedGallery.heading }}</h1>
      <p v-if="selectedGallery.subheading">
        {{ selectedGallery.subheading }}
      </p>
    </div>
    <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 max-w-6xl p-2 mx-auto gap-2">
      <div v-for="slide in selectedGallery.slides" :key="slide.id" class="group bg-black overflow-hidden relative" @click="selectedSlide = slide; modal_open = true">
        <div class="space-y-2 text-white mx-auto lg:max-w-none lg:row-start-1 lg:col-start-1">
          <div :class="outerClass(slide)" class="relative aspect-square">
            <div class="absolute inset-0 bg-center bg-cover transition-opacity duration-300 group-hover:opacity-50" :class="[imageClass(slide)]" :style="{ 'background-image': `url(${slide.image.url})` }" />
          </div>
        </div>
        <div v-if="slide.heading" class="absolute right-0 bottom-0 p-2 text-right translate-y-full group-hover:translate-y-0 text-white transition-transform duration-300">
          <div class="text-2xl font-semibold font-display">
            {{ slide.heading }}
          </div>
          <div v-if="slide.sub_heading" class="font-semibold font-display">
            {{ slide.sub_heading }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <cgn-modal v-model="modal_open">
    <template #clean-content>
      <div class="mr-4">
        <h1 class="text-2xl md:text-4xl font-semibold font-display">
          {{ selectedSlide.heading }}
        </h1>
        <div v-if="selectedSlide.sub_heading" class="text-xl font-semibold font-display">
          {{ selectedSlide.sub_heading }}
        </div>
      </div>
      <div v-if="selectedSlide.content" class="prose-invert max-w-none pb-2" v-html="selectedSlide.content" />
      <div :class="outerClass(selectedSlide)" class="relative aspect-[16/9]">
        <cgn-lazy-image :image="selectedSlide.image" extra-aspect="16x9" class="w-full" />
      </div>
    </template>
    <template v-if="selectedSlide.link_button_text" #button-footer>
      <div class="p-2 w-full">
        <cgn-button color-brand fullwidth :url="selectedSlide.link" :newtab="selectedSlide.link_target == 'blank'">
          {{ selectedSlide.link_button_text }}
        </cgn-button>
      </div>
    </template>
  </cgn-modal>
</template>

<script lang="ts">
import { CognitoGallery } from '~cognito/models/Cognito/Gallery'
import { CognitoSlide } from '~cognito/models/Cognito/Slide'

class Templatevars {
  heading?: string
  subheading?: string
  group?: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})

const galleries = ref<CognitoGallery[]>([])

const miniGallery = ref()

const selectedGallery = ref<CognitoGallery>(new CognitoGallery())

function outerClass(slide: CognitoSlide) {
  return new CognitoSlide(slide).outerClass()
}
function imageClass(slide: CognitoSlide) {
  return new CognitoSlide(slide).imageClass()
}

const selectedSlide = ref(new CognitoSlide())
const modal_open = ref(false)

const selectGallery = (gallery: CognitoGallery) => {
  selectedGallery.value = gallery
  miniGallery.value.scrollIntoView({
    behavior: 'smooth',
  })
}

onMounted(() => {
  new CognitoGallery().find_many({
    group: props.templatevar.group,
  }).then((data) => {
    galleries.value = data.mapped
  })
})
</script>
