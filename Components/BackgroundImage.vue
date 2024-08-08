<template>
  <cgn-image
    v-if="props.imageHash"
    class="size-full bg-cover bg-center" :class="{ 'sm:bg-fixed': props.parallax }"
    :image-hash="props.imageHash" :width="props.width" :aspect="props.aspect"
    :extension="props.extension" :lazy="props.lazy" :parallax="props.parallax" background
  >
    <slot />
  </cgn-image>
  <div v-else class="size-full bg-cover bg-center" :class="{ 'bg-fixed': props.parallax }">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  imageHash: {
    type: String,
  },
  width: {
    type: Number,
    default: 500,
  },
  aspect: {
    type: String,
  },
  extension: {
    type: String,
  },
  lazy: {
    type: Boolean,
    default: true,
  },
  parallax: {
    type: Boolean,
  },
})
</script>
