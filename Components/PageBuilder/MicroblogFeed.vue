<template>
  <div>
    <div v-if="posts.length" class="py-3 text-xl font-bold">
      Latest Posts
      <span v-if="props.tag">
        #{{ props.tag }}
      </span>
    </div>
    <div v-for="post in posts" :key="post.id" class="mb-4">
      <div class="rounded-lg border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div v-if="post.image">
          <cgn-lazy-image :image="post.image" class="w-full rounded-t-lg" />
        </div>
        <div v-if="post.video" class="relative cursor-pointer">
          <div v-if="post.showVideo">
            <video :src="post.video.file" :poster="post.video.slate" autoplay controls class="w-full rounded-t-lg" />
          </div>
          <div v-else @click="post.showVideo = true">
            <img
              class="
                aspect-square
                w-full
                overflow-hidden
                rounded-t-lg
                object-cover
                object-center
                shadow-lg
                hover:shadow-xl
                " :src="post.video.slate"
            >
            <i-material-symbols:play-arrow-outline-rounded class="absolute top-0 h-full w-full" />
          </div>
        </div>
        <div class="bg-slate-100 p-1 text-right text-sm text-secondary-600 dark:bg-slate-700 dark:text-secondary-400">
          {{ post.published_at.format(props.dateformat) }}
        </div>
        <div class="prose max-w-none p-6 text-secondary-700 dark:prose-invert dark:text-secondary-400" v-html="post.content" />
        <div v-if="post.link">
          <cgn-button :url="post.link" class="mx-6">
            {{ post.link_text }}
          </cgn-button>
        </div>
        <div v-if="props.feedurl" class="text-right text-sm text-secondary-600 dark:text-secondary-400">
          <span v-for="tag, idx in post.tags" :key="idx" class="mx-1">
            <router-link :to="`${props.feedurl}/${encodeURIComponent(tag)}`" class="mr-1 hover:underline">#{{ tag }}</router-link>
          </span>
        </div>
      </div>
    </div>
    <div v-if="has_more_pages">
      <cgn-button class="w-full" @click="loadMore">
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
