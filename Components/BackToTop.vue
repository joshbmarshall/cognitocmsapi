<template>
  <transition
    enter-from-class="translate-x-[200%]"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-[200%]"
    class="transition duration-500 ease-in-out"
  >
    <div v-if="y > 100" class="fixed bottom-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-on-brand" @click="scrollToTop">
      <i-heroicons-solid:arrow-up />
    </div>
  </transition>
</template>

<script setup lang="ts">
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const { y } = useWindowScroll()
</script>
