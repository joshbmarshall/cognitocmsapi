<template>
  <div class="flex flex-row gap-4">
    <span v-if="facebook" class="cursor-pointer" title="Share on Facebook" @click="shareFacebook()">
      <i-entypo-social:facebook-with-circle />
    </span>
    <span v-if="twitter" class="cursor-pointer" title="Share on Twitter" @click="shareTwitter()">
      <i-entypo-social:twitter-with-circle />
    </span>
    <span v-if="linkedin" class="cursor-pointer" title="Share on Linkedin" @click="shareLinkedin()">
      <i-entypo-social:linkedin-with-circle />
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    default: '',
  },
  origin: {
    type: String,
    default: '',
  },
  facebook: {
    type: Boolean,
    default: false,
  },
  twitter: {
    type: Boolean,
    default: false,
  },
  linkedin: {
    type: Boolean,
    default: false,
  },
})

const shareurl = () => {
  let origin = props.origin
  if (typeof window != 'undefined') {
    if (!origin) {
      origin = window.location.origin
    }
    return origin + props.url
  }
}

const shareFacebook = () => {
  if (typeof window != 'undefined') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareurl()}`)
  }
}
const shareTwitter = () => {
  if (typeof window != 'undefined') {
    window.open(`https://twitter.com/intent/tweet?text=${props.description}&url=${shareurl()}&via=${props.origin}`)
  }
}
const shareLinkedin = () => {
  if (typeof window != 'undefined') {
    window.open(`http://www.linkedin.com/shareArticle?mini=true&amp;ro=true&amp;title=${props.title}&url=${props.url}&summary=${props.description}&source=${props.source}&armin=armin`)
  }
}
</script>
