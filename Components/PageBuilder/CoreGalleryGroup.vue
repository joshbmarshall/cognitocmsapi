<template>
  <div>
    <div v-if="props.templatevar.heading" class="prose dark:prose-dark">
      <h1>{{ props.templatevar.heading }}</h1>
      <p v-if="props.templatevar.subheading">
        {{ props.templatevar.subheading }}
      </p>
    </div>
    <div v-if="galleries.length > 1" class="grid grid-cols-3 gap-2 pt-2 md:grid-cols-4 lg:grid-cols-5">
      <div v-for="gallery in galleries" :key="gallery.url" class="group relative overflow-hidden bg-black" @click="selectGallery(gallery.id)">
        <div v-if="gallery.slides.length">
          <div class="mx-auto space-y-2 text-white lg:col-start-1 lg:row-start-1 lg:max-w-none">
            <div :class="outerClass(gallery.slides[0])" class="relative aspect-square">
              <cgn-lazy-image :image="gallery.slides[0].image" class="absolute inset-0 aspect-square h-full overflow-hidden object-cover object-center transition-opacity duration-300 group-hover:opacity-50" :class="[imageClass(gallery.slides[0])]" />
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
      <cgn-photoswipe class="mx-auto grid max-w-6xl grid-cols-3 gap-2 pt-2 md:grid-cols-4 lg:grid-cols-5">
        <a
          v-for="slide in selectedGallery.slides"
          :key="slide.id"
          :href="slide.image.getScaledUrl(2000)"
          data-pswp-width="2000"
          :data-pswp-height="slide.image.getScaledHeight(2000)"
          data-cropped="true"
          class="group relative overflow-hidden bg-black"
        >
          <div class="mx-auto space-y-2 text-white lg:col-start-1 lg:row-start-1 lg:max-w-none">
            <div :class="outerClass(slide)" class="relative aspect-square">
              <cgn-lazy-image :image="slide.image" class="absolute inset-0 aspect-square h-full overflow-hidden object-cover object-center transition-opacity duration-300 group-hover:opacity-50" :class="[imageClass(slide)]" />
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
        </a>
      </cgn-photoswipe>
    </div>
  </div>
</template>

<script lang="ts">
import { gql } from 'graphql-request'
import { $axios } from '~cognito/plugins/axios'
import { CognitoGallery } from '~cognito/models/Cognito/Gallery'
import { CognitoSlide } from '~cognito/models/Cognito/Slide'

class Templatevars {
  heading?: string
  subheading?: string
  group?: string
  aspect?: string
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

const selectGallery = async (gallery_id: number) => {
  const data = await $axios.graphql(gql`query cognitoGalleryQuery($id: ID, $aspect: String){
    cognitoGallery(id: $id) {
      url
      heading
      sub_heading
      slides {
        image(image_width: 400, image_aspect: $aspect) {
          url
          width
          height
        }
      }
    }
  }`, {
    id: gallery_id,
    aspect: props.templatevar.aspect,
  })

  selectedGallery.value = new CognitoGallery(data.cognitoGallery)

  if (galleries.value.length > 1) {
    miniGallery.value.scrollIntoView({
      behavior: 'smooth',
    })
  }
}

const loadGalleries = async () => {
  const data = await $axios.graphql(gql`query cognitoGallerysQuery($group: String!){
    cognitoGallerys(byGroup: $group) {
      id
      url
      heading
      sub_heading
      slides(first: 1) {
        image(image_width: 400, image_aspect: "16x9") {
          url
          width
          height
        }
      }
    }
  }`, {
    group: props.templatevar.group,
  })
  galleries.value = data.cognitoGallerys
}

onMounted(async () => {
  await loadGalleries()
  if (galleries.value.length == 1) {
    selectGallery(galleries.value[0].id)
  }
})
</script>
