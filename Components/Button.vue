<template>
  <label v-if="isLabel" class="cursor-pointer" :class="buttonClass">
    <slot />
  </label>
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
  fullwidth: {
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
})

const buttonClass = computed(() => {
  let classes = 'cgn-button'
  classes += props.fullwidth ? ' block w-full' : ' inline-block'

  if (props.disabled) {
    classes += ' cursor-not-allowed opacity-50'
  }
  if (props.colorDanger) {
    classes += ' bg-danger-500 hover:bg-danger-600 text-on-danger dark:hover:bg-danger-400'
  }
  if (props.colorWarning) {
    classes += ' bg-warning-500 hover:bg-warning-600 text-on-warning dark:hover:bg-warning-400'
  }
  if (props.colorSuccess) {
    classes += ' bg-success-500 hover:bg-success-600 text-on-success dark:hover:bg-success-400'
  }
  if (props.colorInfo) {
    classes += ' bg-info-500 hover:bg-info-600 text-on-info dark:hover:bg-info-400'
  }
  if (props.colorPrimary) {
    classes += ' bg-primary-500 hover:bg-primary-600 text-on-primary dark:hover:bg-primary-400'
  }
  if (props.colorSecondary) {
    classes += ' bg-secondary-500 hover:bg-secondary-600 text-on-secondary dark:hover:bg-secondary-400'
  }
  if (props.colorBrand) {
    classes += ' bg-brand-500 hover:bg-brand-600 text-on-brand dark:hover:bg-brand-400'
  }
  return classes
})

/* tailwind.css
.cgn-button {
  @apply shadow py-1.5 px-4 text-center select-none rounded-lg my-2 text-white
}
*/
</script>
