<template>
  <div>
    <div v-if="props.templatevar.heading" class="prose dark:prose-dark">
      <h1>{{ props.templatevar.heading }}</h1>
      <p v-if="props.templatevar.subheading">
        {{ props.templatevar.subheading }}
      </p>
    </div>
    <div class="grid grid-cols-3 gap-2 pt-2 md:grid-cols-4 lg:grid-cols-5">
      <div v-for="gallery in galleries" :key="gallery.url" class="group relative overflow-hidden bg-black" @click="selectGallery(gallery)">
        <div v-if="gallery.slides.length">
          <div class="mx-auto space-y-2 text-white lg:col-start-1 lg:row-start-1 lg:max-w-none">
            <div :class="outerClass(gallery.slides[0])" class="relative aspect-square">
              <cgn-lazy-image :image="gallery.slides[0].image" class="absolute inset-0 h-full object-cover object-center transition-opacity duration-300 group-hover:opacity-50" :class="[imageClass(gallery.slides[0])]" />
            </div>
          </div>
          <div v-if="gallery.heading" class="absolute bottom-0 right-0 translate-y-full p-2 text-right text-white transition-transform duration-300 group-hover:translate-y-0">
            <div class="font-display font-semibold sm:text-2xl">
              {{ gallery.heading }}
            </div>
            <div v-if="gallery.sub_heading" class="font-display text-sm font-semibold sm:text-base">
              {{ gallery.sub_heading }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div ref="miniGallery" class="pt-4">
      <div v-if="selectedGallery.heading" class="prose mx-auto max-w-6xl dark:prose-dark">
        <h1>{{ selectedGallery.heading }}</h1>
        <p v-if="selectedGallery.subheading">
          {{ selectedGallery.subheading }}
        </p>
      </div>
      <div class="mx-auto grid max-w-6xl grid-cols-3 gap-2 pt-2 md:grid-cols-4 lg:grid-cols-5">
        <div v-for="slide in selectedGallery.slides" :key="slide.id" class="group relative overflow-hidden bg-black" @click="selectedSlide = slide; modal_open = true">
          <div class="mx-auto space-y-2 text-white lg:col-start-1 lg:row-start-1 lg:max-w-none">
            <div :class="outerClass(slide)" class="relative aspect-square">
              <cgn-lazy-image :image="slide.image" class="absolute inset-0 h-full object-cover object-center transition-opacity duration-300 group-hover:opacity-50" :class="[imageClass(slide)]" />
            </div>
          </div>
          <div v-if="slide.heading" class="absolute bottom-0 right-0 translate-y-full p-2 text-right text-white transition-transform duration-300 group-hover:translate-y-0">
            <div class="font-display font-semibold sm:text-2xl">
              {{ slide.heading }}
            </div>
            <div v-if="slide.sub_heading" class="font-display text-sm font-semibold sm:text-base">
              {{ slide.sub_heading }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <cgn-modal v-model="modal_open" fullheight>
      <template #clean-content>
        <div class="mr-4">
          <h1 class="font-display text-2xl font-semibold md:text-4xl">
            {{ selectedSlide.heading }}
          </h1>
          <div v-if="selectedSlide.sub_heading" class="font-display text-xl font-semibold">
            {{ selectedSlide.sub_heading }}
          </div>
        </div>
        <div v-if="selectedSlide.content" class="prose-invert max-w-none pb-2" v-html="selectedSlide.content" />
        <div :class="outerClass(selectedSlide)" class="relative aspect-[16/9]">
          <cgn-lazy-image :image="selectedSlide.image" extra-aspect="16x9" class="w-full" />
        </div>
      </template>
      <template v-if="selectedSlide.link_button_text" #button-footer>
        <div class="w-full p-2">
          <cgn-button color-brand fullwidth :url="selectedSlide.link" :newtab="selectedSlide.link_target == 'blank'">
            {{ selectedSlide.link_button_text }}
          </cgn-button>
        </div>
      </template>
    </cgn-modal>
  </div>
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
    image_width: 300,
    image_aspect: '1x1',
    extra_aspects: ['16x9'],
  }).then((data) => {
    galleries.value = data.mapped
  })
})
</script>
