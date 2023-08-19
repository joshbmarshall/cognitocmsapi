<template>
  <label v-if="isLabel" :class="buttonClass">
    <slot />
  </label>
  <router-link v-else-if="redirectLogin" :class="buttonClass" to="/login">
    <slot />
  </router-link>
  <component
    :is="url.startsWith('http') ? 'a' : 'router-link'"
    v-else-if="url && !disabled"
    :to="url"
    :href="url"
    :type="submit ? 'submit' : undefined"
    :target="newtab ? '_blank' : ''"
    :class="buttonClass"
  >
    <slot />
  </component>
  <button v-else :type="submit ? 'submit' : undefined" :class="buttonClass" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
  },
  extraClasses: {
    type: String,
    default: '',
  },
  isLabel: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  submit: {
    type: Boolean,
    default: false,
  },
  newtab: {
    type: Boolean,
    default: false,
  },
  sizeLarge: {
    type: Boolean,
    default: false,
  },
  fullwidth: {
    type: Boolean,
    default: false,
  },
  redirectLogin: {
    type: Boolean,
    default: false,
  },
  colorWhite: {
    type: Boolean,
    default: false,
  },
  colorBlack: {
    type: Boolean,
    default: false,
  },
  colorBrand: {
    type: Boolean,
    default: false,
  },
  colorDanger: {
    type: Boolean,
    default: false,
  },
  colorWarning: {
    type: Boolean,
    default: false,
  },
  colorSuccess: {
    type: Boolean,
    default: false,
  },
  colorInfo: {
    type: Boolean,
    default: false,
  },
  colorPrimary: {
    type: Boolean,
    default: false,
  },
  colorSecondary: {
    type: Boolean,
    default: false,
  },
  templatevarColour: {
    type: String,
    default: '',
  },
})

const buttonClass = computed(() => {
  let classes = ''
  classes += props.sizeLarge ? 'cgn-button-large' : 'cgn-button'
  classes += props.fullwidth ? ' block w-full' : ' inline-block'

  if (props.disabled) {
    classes += ' cursor-not-allowed opacity-50'
  } else {
    classes += ' cursor-pointer'
  }
  if (props.templatevarColour == 'dng' || props.colorDanger) {
    classes += ' bg-danger-500 hover:bg-danger-600 text-on-danger dark:hover:bg-danger-400'
  }
  if (props.templatevarColour == 'wrn' || props.colorWarning) {
    classes += ' bg-warning-500 hover:bg-warning-600 text-on-warning dark:hover:bg-warning-400'
  }
  if (props.templatevarColour == 'suc' || props.colorSuccess) {
    classes += ' bg-success-500 hover:bg-success-600 text-on-success dark:hover:bg-success-400'
  }
  if (props.templatevarColour == 'inf' || props.colorInfo) {
    classes += ' bg-info-500 hover:bg-info-600 text-on-info dark:hover:bg-info-400'
  }
  if (props.templatevarColour == 'pri' || props.colorPrimary) {
    classes += ' bg-primary-500 hover:bg-primary-600 text-on-primary dark:hover:bg-primary-400'
  }
  if (props.templatevarColour == 'sec' || props.colorSecondary) {
    classes += ' bg-secondary-500 hover:bg-secondary-600 text-on-secondary dark:hover:bg-secondary-400'
  }
  if (props.templatevarColour == 'bnd' || props.colorBrand) {
    classes += ' bg-brand-500 hover:bg-brand-600 text-on-brand dark:hover:bg-brand-400'
  }
  if (props.templatevarColour == 'wht' || props.colorWhite) {
    classes += ' bg-white text-gray-500'
  }
  if (props.templatevarColour == 'blk' || props.colorBlack) {
    classes += ' bg-black text-gray-500'
  }
  return classes
})

onMounted(() => {
  if (props.redirectLogin && !useUserStore().isLoggedIn()) {
    useUserStore().setRedirectAfterLogin(useRoute().fullPath)
  }
})

/* tailwind.css
.cgn-button {
  @apply shadow py-1.5 px-4 text-center select-none rounded-lg my-2
}
.cgn-button-large {
  @apply shadow py-3 px-8 text-center select-none rounded-xl my-2 text-lg
}
*/
</script>
