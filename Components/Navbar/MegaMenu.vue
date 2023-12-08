<template>
  <div v-click-away="close" class="flex">
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
          font-medium
          transition-colors
          duration-200
          ease-out
        "
        :class="
          isHidden
            ? ''
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
      class="transition duration-150 ease-out"
    >
      <div
        v-if="!isHidden"
        class="absolute inset-x-0 top-full"
        :class="menu?.image ? 'bg-gray-800 text-white' : 'bg-white dark:bg-darkbg-500'"
      >
        <cgn-lazy-image class="absolute inset-0 h-full w-full object-cover opacity-40 saturate-50" force-size :image="menu?.image" />
        <div class="relative mx-auto flex max-h-96 max-w-7xl gap-8 p-8">
          <div v-for="megaLink in megaLinks" :key="megaLink.name">
            <router-link :to="megaLink.link" class="text-lg">
              {{ megaLink.name }}
            </router-link>
            <div v-for="link in megaLink.children" :key="link.name" class="py-1 text-gray-200 hover:text-gray-100">
              <router-link :to="link.link">
                {{ link.name }}
              </router-link>
            </div>
          </div>
          <div>
            <div v-for="link in links" :key="link.name" class="py-1">
              <router-link :to="link.link" class="text-base">
                {{ link.name }}
              </router-link>
            </div>
          </div>
          <cgn-button v-if="menu?.button_text" color-brand :url="menu.button_link" class="text-lg">
            {{ menu.button_text }}
          </cgn-button>
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

const megaLinks = computed(() => {
  return props.menu?.children.filter(link => link.children.length > 0)
})

const links = computed(() => {
  return props.menu?.children.filter(link => link.children.length < 1)
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
