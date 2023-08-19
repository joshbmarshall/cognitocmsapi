<template>
  <div class="py-16">
    <div class="container mx-auto flex flex-col justify-between px-4 lg:flex-row lg:items-center">
      <div class="mb-14 xl:mb-0">
        <h1 class="pr-16 text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200 md:text-4xl lg:pr-0 xl:w-2/3 xl:text-5xl">
          {{ templatevar.heading }}
        </h1>
        <p class="mt-4 pr-16 text-base leading-normal text-gray-600 dark:text-gray-400 md:w-2/3 lg:w-3/4 lg:pr-0">
          {{ templatevar.subheading }}
        </p>
        <cgn-button v-if="templatevar.button_link" :url="templatevar.button_link" :templatevar-colour="templatevar.button_colour">
          {{ templatevar.button_text }}
        </cgn-button>
      </div>

      <div role="list" aria-label="Testimonials" class="grid flex-wrap items-start justify-center gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:w-1/2">
        <div v-for="testimonial in testimonials" :key="testimonial.id" role="listitem" class="rounded-lg bg-white p-4 shadow dark:bg-slate-700 xl:p-8">
          <i-codicon:quote />
          <div class="flex items-start justify-between pl-4 pt-4">
            <div class="mr-6">
              <div class="text-gray-600 dark:text-gray-400 xl:text-xl xl:leading-loose" v-html="testimonial.content" />
              <p class="mt-4 text-base font-semibold leading-none text-gray-800 dark:text-gray-200">
                {{ testimonial.name }}
              </p>
            </div>
            <cgn-lazy-image :image="testimonial.image" width="100" class="rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CognitoTestimonial } from '~cognito/models/Cognito/Testimonial'

class Templatevars {
  heading?: string
  subheading?: string
  button_link?: string
  button_text?: string
  button_colour?: string
  testimonials?: number[]
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})

const testimonials = ref<CognitoTestimonial[]>([])
async function loadTestimonials() {
  const data = await (new CognitoTestimonial()).find_many({
    page_size: 3,
    image_width: 100,
    image_aspect: 'Square',
    group: props.templatevar.testimonials,
  })
  testimonials.value = data.data
}
onMounted(() => {
  loadTestimonials()
})
onServerPrefetch(async () => {
  await loadTestimonials()
})
</script>
