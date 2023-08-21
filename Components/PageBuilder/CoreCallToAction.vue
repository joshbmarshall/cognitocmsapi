<template>
  <div class="mx-auto space-y-2 lg:col-start-1 lg:row-start-1 lg:max-w-none">
    <div class="flex flex-col items-center justify-center gap-2 md:flex-row">
      <cgn-lazy-image v-if="templatevar.left_image" :image-id="templatevar.left_image" image-width="300" image-aspect="16:9" class="w-full md:w-1/2" />
      <div class="w-full p-4 md:w-1/2 md:p-8">
        <div class="font-display pb-2 text-xl font-semibold xl:text-4xl">
          {{ templatevar.heading }}
        </div>
        <div v-if="templatevar.subheading" class="font-display mb-2 text-xl font-semibold">
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
</template>

<script lang="ts">
class Templatevars {
  heading?: string
  subheading?: string
  html?: string
  left_image?: string
  right_image?: string
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
</script>
