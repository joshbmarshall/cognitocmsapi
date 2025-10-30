<template>
  <div id="turnstile-box" ref="turnstileBox" />
</template>

<script setup lang="ts">
// https://github.com/Astrian/cfturnstile-vue3
const props = defineProps({
  sitekey: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: false,
  },
  cData: {
    type: String,
    required: false,
  },
  execution: {
    type: String as PropType<'render' | 'execute'>,
    required: false,
  },
  theme: {
    type: String as PropType<'light' | 'dark' | 'auto'>,
    required: false,
  },
  language: {
    type: String,
    required: false,
  },
  tabindex: {
    type: Number,
    required: false,
  },
  responseField: {
    type: String,
    required: false,
  },
  responseFieldName: {
    type: String,
    required: false,
  },
  size: {
    type: String as PropType<'normal' | 'flexible' | 'compact'>,
    required: false,
  },
  retry: {
    type: String as PropType<'auto' | 'never'>,
    required: false,
  },
  retryInterval: {
    type: Number,
    required: false,
  },
  refreshExpired: {
    type: String as PropType<'auto' | 'manual' | 'never'>,
  },
  refreshTimeout: {
    type: String as PropType<'auto' | 'manual' | 'never'>,
    required: false,
  },
  appearance: {
    type: String as PropType<'always' | 'execute' | 'interaction-only'>,
    required: false,
  },
  feedbackEnabled: {
    type: Boolean,
    required: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'callback',
  'expiredCallback',
  'errorCallback',
  'beforeInteractiveCallback',
  'afterInteractiveCallback',
  'unsupportedCallback',
  'timeoutCallback',
])
// const turnstileBox = ref(null)
onMounted(() => {
  if (window.turnstile === null || !window.turnstile) {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }
  renderTurnstile()
})

function renderTurnstile() {
  window.onloadTurnstileCallback = () => {
    window.turnstile?.render('#turnstile-box', {
      'sitekey': props.sitekey,
      'callback': (response: string) => {
        emit('update:modelValue', response)
        emit('callback', response)
      },
      'expired-callback': () => emit('expiredCallback'),
      'error-callback': (response: string) => emit('errorCallback', response),
      'action': props.action,
      'cData': props.cData,
      'execution': props.execution ?? 'render',
      'before-interactive-callback': () => emit('beforeInteractiveCallback'),
      'after-interactive-callback': () => emit('afterInteractiveCallback'),
      'unsupported-callback': () => emit('unsupportedCallback'),
      'theme': props.theme ?? 'auto',
      'language': props.language ?? 'auto',
      'tabindex': props.tabindex ?? 0,
      'timeout-callback': () => emit('timeoutCallback'),
      'response-field': props.responseField,
      'response-field-name': props.responseFieldName,
      'size': props.size,
      'retry': props.retry,
      'retry-interval': props.retryInterval,
      'refresh-expired': props.refreshExpired,
      'refresh-timeout': props.refreshTimeout,
      'apperance': props.appearance,
      'feedback-enabled': props.feedbackEnabled,
    })
  }
}
</script>
