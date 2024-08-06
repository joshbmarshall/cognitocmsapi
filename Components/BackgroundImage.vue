<template>
  <cgn-image
    v-if="props.imageHash"
    class="size-full bg-cover bg-center" :class="{ 'sm:bg-fixed': props.parallax }" background
    :image-hash="props.imageHash" :field="props.field" :width="props.width" :aspect="props.aspect"
    :extension="props.extension" :lazy="props.lazy"
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
  field: {
    type: String,
    default: 'image',
  },
  width: {
    type: Number,
    default: 500,
  },
  aspect: {
    type: String,
    default: '16x9',
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
