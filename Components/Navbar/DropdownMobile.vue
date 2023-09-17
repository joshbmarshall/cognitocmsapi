<template>
  <div v-click-away="close" class="flex flex-col">
    <button
      type="button"
      class="flex items-center justify-between py-2 text-left"
      :class="
        isHidden
          ? ''
          : 'text-brand-500'
      "
      @click="toggle()"
    >
      <span>{{ props.heading }}</span>
      <i-heroicons-solid:chevron-down v-if="isHidden" />
      <i-heroicons-solid:chevron-up v-else />
    </button>
    <transition
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
      class="transition duration-150 ease-in"
    >
      <div v-if="!isHidden" class="w-full pl-3">
        <div class="flex flex-col gap-y-2">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { directive as vClickAway } from 'vue3-click-away'

const props = defineProps({
  heading: {
    type: String,
  },
})
const isHidden = ref(true)

function toggle() {
  isHidden.value = !isHidden.value
}
function close() {
  isHidden.value = true
}
const router = useRouter()
router.beforeEach(() => {
  close()
})
</script>
