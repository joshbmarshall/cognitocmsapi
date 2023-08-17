<template>
  <div class="prose mx-auto max-w-5xl space-y-2 p-6 text-gray-700 dark:prose-invert dark:text-gray-200 sm:p-12 lg:col-start-1 lg:row-start-1">
    <h1 class="font-display text-2xl font-semibold">
      Frequently asked questions
    </h1>
    <div class="prose max-w-none dark:prose-invert" v-html="templatevar.pagecontent" />
    <div class="divide-y-2 divide-gray-300 dark:divide-brand-600">
      <div v-for="faq in faqs" :ref="(el) => addRef(el, faq.id)" :key="faq.id" class="group cursor-pointer py-4" @click="select_faq(faq.id)">
        <div class="flex flex-row justify-between group-hover:text-brand-600 dark:group-hover:text-brand-300">
          <div class="select-none text-xl">
            {{ faq.name }}
          </div>
          <div>
            <i-heroicons-outline:x-circle v-if="selected_faq == faq.id" class="h-6 w-6" />
            <i-heroicons-outline:plus-circle v-else class="h-6 w-6" />
          </div>
        </div>
        <div v-if="selected_faq == faq.id" class="prose p-2 dark:prose-invert" v-html="faq.content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CognitoFaq } from '~cognito/models/Cognito/Faq'

class Templatevars {
  heading?: string
  pagecontent?: string
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
const faqs = ref<CognitoFaq[]>([])

const faqRefs = ref([])

const addRef = (element, faq_id: number) => {
  if (faqRefs.value.find(e => e.element == element)) {
    return
  }
  // If element isn't already in the array
  faqRefs.value.push({ element, id: faq_id })
}

const selected_faq = ref()
const select_faq = (faq_id: number) => {
  if (selected_faq.value == faq_id) {
    selected_faq.value = null
    return
  }
  selected_faq.value = faq_id

  scrollToFaq(faq_id)
}

const scrollToFaq = (id: number) => {
  nextTick(() => {
    faqRefs.value.find(e => e.id === id).element.scrollIntoView({
      behavior: 'smooth',
    })
  })
}

const loadFaqs = async () => {
  const data = await new CognitoFaq().find_many({
    group: props.templatevar.group,
  })
  faqs.value = data.data
}
onMounted(() => {
  loadFaqs()
})
onServerPrefetch(async () => {
  await loadFaqs()
})
</script>
