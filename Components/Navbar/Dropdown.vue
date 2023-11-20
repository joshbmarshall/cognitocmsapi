<template>
  <div v-click-away="close" class="relative flex">
    <div class="relative flex">
      <div
        class="
          relative
          z-10
          flex
          cursor-pointer
          select-none
          items-center
          py-2
          text-sm
          ease-out
        "
        :class="{ 'text-brand-500': !isHidden }"
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
      class="transition duration-150 ease-out"
    >
      <div
        v-if="!isHidden"
        class="absolute right-0 top-full mt-5 w-56 rounded-md border-2 border-gray-200 bg-white text-black dark:border-brand-500 dark:bg-darkbg-600 dark:text-white"
      >
        <div class="relative mx-auto flex max-w-7xl flex-col gap-2 p-4">
          <router-link v-for="link in links" :key="link.name" :to="link.link" class="block py-1">
            <div class="text-base">
              {{ link.name }}
            </div>
            <span v-for="childLink in link.children" :key="childLink.name">
              <router-link
                :to="childLink.link"
                class="block py-2 pl-1 font-medium text-gray-800 dark:text-gray-200"
              >
                {{ childLink.name }}
              </router-link>
            </span>
          </router-link>
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
