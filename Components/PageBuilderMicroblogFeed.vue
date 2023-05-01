<template>
  <div>
    <div v-for="post, index in posts" :key="post.id" class="mb-4">
      <div class="text-right mb-1 text-sm">
        {{ post.published_at.format(props.dateformat) }}
      </div>
      <div v-if="post.image">
        <cgn-lazy-image :image="post.image" class="w-full" />
      </div>
      <div v-if="post.video" class="relative cursor-pointer">
        <div v-if="post.showVideo">
          <video :src="post.video.file" :poster="post.video.slate" autoplay controls class="w-full" />
        </div>
        <div v-else @click="post.showVideo = true">
          <img
            class="
                rounded-lg
                shadow-lg
                hover:shadow-xl
                aspect-square
                w-full
                object-cover
                object-center
                overflow-hidden
                " :src="post.video.slate"
          >
          <i-material-symbols:play-arrow-outline-rounded class="absolute top-0 w-full h-full" />
        </div>
      </div>
      <div class="prose dark:prose-invert max-w-none my-3" v-html="post.content" />
      <div v-if="post.link">
        <cgn-button :url="post.link">
          {{ post.link_text }}
        </cgn-button>
      </div>
      <div v-if="props.feedurl" class="text-right text-sm text-secondary-600 dark:text-secondary-400">
        <span v-for="tag, idx in post.tags" :key="idx" class="mx-1">
          <router-link :to="`${props.feedurl}/${encodeURIComponent(tag)}`" class="hover:underline mr-1">#{{ tag }}</router-link>
        </span>
      </div>
      <hr v-if="index < posts.length - 1" class="mx-auto max-w-xs py-3 mt-4">
    </div>
    <div v-if="has_more_pages">
      <cgn-button @click="loadMore">
        Load More
      </cgn-button>
    </div>
  </div>
</template>

<script lang="ts">
import { MicroblogPost } from '~cognito/models/Microblog/Post'
class Templatevars {
  posts_per_page?: number
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
  dateformat: {
    type: String,
    default: 'dd MMM Y',
  },
  feedurl: {
    type: String,
  },
  imageAspect: {
    type: String,
    default: '16x9',
  },
  tag: {
    type: String,
  },
})

const posts = ref<MicroblogPost[]>([])
const curpage = ref(1)
const numpages = ref(0)

const has_more_pages = computed(() => {
  return curpage.value < numpages.value
})

const loadMore = () => {
  curpage.value++
  loadPosts()
}

const loadPosts = async () => {
  const data = await new MicroblogPost().find_many({
    page_size: props.templatevar.posts_per_page,
    page: curpage.value,
    image_aspect: props.imageAspect,
    image_width: 400,
    tag: props.tag,
  })
  numpages.value = data.num_pages
  posts.value.push(...data.mapped)
}
onMounted(() => {
  loadPosts()
})
onServerPrefetch(async () => {
  await loadPosts()
})
</script>
