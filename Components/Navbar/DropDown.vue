<template>
  <div v-click-away="close" class="relative flex">
    <div class="relative flex">
      <div
        class="
          relative
          z-10
          flex
          items-center
          transition-colors
          ease-out
          duration-200
          text-sm
          font-medium
          py-2
          cursor-pointer
          select-none
        "
        :class="
          isHidden
            ? 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
            : 'text-brand-500'
        "
        aria-expanded="false"
        @click="toggle()"
      >
        <span>{{ props.menu?.name }}</span>
        <i-heroicons-solid:chevron-down v-show="isHidden" class="ml-1" />
        <i-heroicons-solid:chevron-up v-show="!isHidden" class="ml-1" />
      </div>
    </div>
    <transition
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
      class="transition ease-out duration-150"
    >
      <div
        v-if="!isHidden"
        class="absolute top-full w-56 mt-5 right-0 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md"
      >
        <div class="max-w-7xl flex flex-col gap-2 p-4 mx-auto max-h-96 relative">
          <div v-for="link in links" :key="link.name" class="py-1">
            <router-link :to="link.link" class="text-base">
              {{ link.name }}
            </router-link>
            <span v-for="childLink in link.children" :key="childLink.name">
              <router-link
                :to="childLink.link"
                class="py-2 pl-1 block font-medium text-gray-800 dark:text-gray-200"
              >
                {{ childLink.name }}
              </router-link>
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { directive as vClickAway } from 'vue3-click-away'
import { CognitoMenu } from '~cognito/models/Cognito/Menu'

const props = defineProps({
  menu: {
    type: CognitoMenu,
  },
})
const isHidden = ref(true)

const links = computed(() => {
  return props.menu?.children.filter(link => !link.identifier)
})

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
