<template>
  <div class="grid gap-6 py-4 md:grid-cols-2">
    <div v-for="testimonial in testimonials" :key="testimonial.id" class="rounded-md bg-gray-200 p-6 pb-3 dark:bg-darkbg-500">
      <div class="relative p-2">
        <svg class="absolute left-0 top-0 h-6 w-6 -translate-x-3 -translate-y-2 text-darkbg-600" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
        <div class="relative" v-html="testimonial.content" />
        <div>
          <div class="font-medium">
            {{ testimonial.name }}
          </div>
          <div class="text-sm">
            {{ testimonial.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gql } from 'graphql-request'
import { CognitoTestimonial } from '~cognito/models/Cognito/Testimonial'
import { $axios } from '~cognito/plugins/axios'

const testimonials = ref<CognitoTestimonial[]>([])

async function loadTestimonials() {
  const data = await $axios.graphql(gql`
  {
  cognitoTestimonials {
    id
    name
    title
    content
  }
  }
  `)
  testimonials.value = new CognitoTestimonial().map(data.cognitoTestimonials)
}

onMounted(() => {
  loadTestimonials()
})

onServerPrefetch(async () => {
  await loadTestimonials()
})
</script>
