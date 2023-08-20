<template>
  <div class="relative">
    <div
      v-if="widget.templatevar.widget_background_image"
      class="absolute inset-0 bg-cover bg-center"
      :class="widgetBackgroundImageClass"
      :style="{ 'background-image': `url(${widgetBackgroundImageUrl})` }"
    />
    <page-builder-content v-if="widgetVisible" :widget="widget" :url-parts="urlParts" :class="pbcClass" />
  </div>
</template>

<script setup lang="ts">
import { CognitoImage } from '~cognito/models/Cognito/Image'
import { CognitoUrlParts } from '~cognito/models/Cognito/Page'
import { CognitoTime } from '~cognito/models/Cognito/Time'

const props = defineProps({
  widget: {
    required: true,
  },
  urlParts: {
    type: CognitoUrlParts,
    required: true,
  },
})

const widgetBackgroundImageUrl = computedAsync(async () => {
  const data = await new CognitoImage().find_one({
    url: props.widget.templatevar.widget_background_image,
    image_aspect: '16x9',
    image_width: 1920,
  })
  return data.url
})

const widgetBackgroundImageClass = computed(() => {
  let classes = ''

  classes += [
    { name: 'opacity-10', id: '10' },
    { name: 'opacity-30', id: '30' },
    { name: 'opacity-50', id: '50' },
    { name: 'opacity-70', id: '70' },
    { name: 'opacity-90', id: '90' },
    { name: 'opacity-100', id: '100' },
  ].find(e => e.id === props.widget.templatevar.widget_background_image_opacity)?.name

  classes += ` ${[
  { name: 'saturate-0', id: '0' },
  { name: 'saturate-50', id: '50' },
  { name: 'saturate-100', id: '100' },
].find(e => e.id === props.widget.templatevar.widget_background_image_saturation)?.name}`

  if (props.widget.templatevar.widget_background_image_fixed == 1) {
    classes += ' sm:bg-fixed'
  }

  return classes
})

const widgetVisible = computed(() => {
  if (props.widget.templatevar.widget_is_visible == '0') {
    return false
  }
  if (props.widget.templatevar.widget_hidden_before) {
    const hide_before = new CognitoTime(props.widget.templatevar.widget_hidden_before)
    if (hide_before.isFuture()) {
      return false
    }
  }
  if (props.widget.templatevar.widget_hidden_after) {
    const hide_after = new CognitoTime(props.widget.templatevar.widget_hidden_after)
    if (hide_after.isPast()) {
      return false
    }
  }
  return true
})

const pbcClass = computed(() => {
  let wclass = ''
  if (props.widget.templatevar.widget_padding_top) {
    wclass += ' '
    const classes = {
      0: 'pt-0',
      px: 'pt-px',
      0.5: 'pt-0.5',
      1: 'pt-1',
      1.5: 'pt-1.5',
      2: 'pt-2',
      2.5: 'pt-2.5',
      3: 'pt-3',
      3.5: 'pt-3.5',
      4: 'pt-4',
      5: 'pt-5',
      6: 'pt-6',
      7: 'pt-7',
      8: 'pt-8',
      9: 'pt-9',
      10: 'pt-10',
      11: 'pt-11',
      12: 'pt-12',
      14: 'pt-14',
      16: 'pt-16',
      20: 'pt-20',
      24: 'pt-24',
      28: 'pt-28',
      32: 'pt-32',
      36: 'pt-36',
      40: 'pt-40',
      44: 'pt-44',
      48: 'pt-48',
      52: 'pt-52',
      56: 'pt-56',
      60: 'pt-60',
      64: 'pt-64',
      72: 'pt-72',
      80: 'pt-80',
      96: 'pt-96',
    }
    wclass += classes[props.widget.templatevar.widget_padding_top]
  }
  if (props.widget.templatevar.widget_padding_bottom) {
    wclass += ' '
    const classes = {
      0: 'pb-0',
      px: 'pb-px',
      0.5: 'pb-0.5',
      1: 'pb-1',
      1.5: 'pb-1.5',
      2: 'pb-2',
      2.5: 'pb-2.5',
      3: 'pb-3',
      3.5: 'pb-3.5',
      4: 'pb-4',
      5: 'pb-5',
      6: 'pb-6',
      7: 'pb-7',
      8: 'pb-8',
      9: 'pb-9',
      10: 'pb-10',
      11: 'pb-11',
      12: 'pb-12',
      14: 'pb-14',
      16: 'pb-16',
      20: 'pb-20',
      24: 'pb-24',
      28: 'pb-28',
      32: 'pb-32',
      36: 'pb-36',
      40: 'pb-40',
      44: 'pb-44',
      48: 'pb-48',
      52: 'pb-52',
      56: 'pb-56',
      60: 'pb-60',
      64: 'pb-64',
      72: 'pb-72',
      80: 'pb-80',
      96: 'pb-96',
    }
    wclass += classes[props.widget.templatevar.widget_padding_bottom]
  }
  if (props.widget.templatevar.widget_padding_left) {
    wclass += ' '
    const classes = {
      0: 'pl-0',
      px: 'pl-px',
      0.5: 'pl-0.5',
      1: 'pl-1',
      1.5: 'pl-1.5',
      2: 'pl-2',
      2.5: 'pl-2.5',
      3: 'pl-3',
      3.5: 'pl-3.5',
      4: 'pl-4',
      5: 'pl-5',
      6: 'pl-6',
      7: 'pl-7',
      8: 'pl-8',
      9: 'pl-9',
      10: 'pl-10',
      11: 'pl-11',
      12: 'pl-12',
      14: 'pl-14',
      16: 'pl-16',
      20: 'pl-20',
      24: 'pl-24',
      28: 'pl-28',
      32: 'pl-32',
      36: 'pl-36',
      40: 'pl-40',
      44: 'pl-44',
      48: 'pl-48',
      52: 'pl-52',
      56: 'pl-56',
      60: 'pl-60',
      64: 'pl-64',
      72: 'pl-72',
      80: 'pl-80',
      96: 'pl-96',
    }
    wclass += classes[props.widget.templatevar.widget_padding_left]
  }
  if (props.widget.templatevar.widget_padding_right) {
    wclass += ' '
    const classes = {
      0: 'pr-0',
      px: 'pr-px',
      0.5: 'pr-0.5',
      1: 'pr-1',
      1.5: 'pr-1.5',
      2: 'pr-2',
      2.5: 'pr-2.5',
      3: 'pr-3',
      3.5: 'pr-3.5',
      4: 'pr-4',
      5: 'pr-5',
      6: 'pr-6',
      7: 'pr-7',
      8: 'pr-8',
      9: 'pr-9',
      10: 'pr-10',
      11: 'pr-11',
      12: 'pr-12',
      14: 'pr-14',
      16: 'pr-16',
      20: 'pr-20',
      24: 'pr-24',
      28: 'pr-28',
      32: 'pr-32',
      36: 'pr-36',
      40: 'pr-40',
      44: 'pr-44',
      48: 'pr-48',
      52: 'pr-52',
      56: 'pr-56',
      60: 'pr-60',
      64: 'pr-64',
      72: 'pr-72',
      80: 'pr-80',
      96: 'pr-96',
    }
    wclass += classes[props.widget.templatevar.widget_padding_right]
  }
  if (props.widget.templatevar.widget_margin_top) {
    wclass += ' '
    const classes = {
      0: 'mt-0',
      px: 'mt-px',
      0.5: 'mt-0.5',
      1: 'mt-1',
      1.5: 'mt-1.5',
      2: 'mt-2',
      2.5: 'mt-2.5',
      3: 'mt-3',
      3.5: 'mt-3.5',
      4: 'mt-4',
      5: 'mt-5',
      6: 'mt-6',
      7: 'mt-7',
      8: 'mt-8',
      9: 'mt-9',
      10: 'mt-10',
      11: 'mt-11',
      12: 'mt-12',
      14: 'mt-14',
      16: 'mt-16',
      20: 'mt-20',
      24: 'mt-24',
      28: 'mt-28',
      32: 'mt-32',
      36: 'mt-36',
      40: 'mt-40',
      44: 'mt-44',
      48: 'mt-48',
      52: 'mt-52',
      56: 'mt-56',
      60: 'mt-60',
      64: 'mt-64',
      72: 'mt-72',
      80: 'mt-80',
      96: 'mt-96',
    }
    wclass += classes[props.widget.templatevar.widget_margin_top]
  }
  if (props.widget.templatevar.widget_margin_bottom) {
    wclass += ' '
    const classes = {
      0: 'mb-0',
      px: 'mb-px',
      0.5: 'mb-0.5',
      1: 'mb-1',
      1.5: 'mb-1.5',
      2: 'mb-2',
      2.5: 'mb-2.5',
      3: 'mb-3',
      3.5: 'mb-3.5',
      4: 'mb-4',
      5: 'mb-5',
      6: 'mb-6',
      7: 'mb-7',
      8: 'mb-8',
      9: 'mb-9',
      10: 'mb-10',
      11: 'mb-11',
      12: 'mb-12',
      14: 'mb-14',
      16: 'mb-16',
      20: 'mb-20',
      24: 'mb-24',
      28: 'mb-28',
      32: 'mb-32',
      36: 'mb-36',
      40: 'mb-40',
      44: 'mb-44',
      48: 'mb-48',
      52: 'mb-52',
      56: 'mb-56',
      60: 'mb-60',
      64: 'mb-64',
      72: 'mb-72',
      80: 'mb-80',
      96: 'mb-96',
    }
    wclass += classes[props.widget.templatevar.widget_margin_bottom]
  }
  if (props.widget.templatevar.widget_background_colour) {
    wclass += ' '
    const classes = {
      wht: 'bg-white',
      blk: 'bg-black',
      bnd: 'bg-brand-500',
      suc: 'bg-success-500',
      inf: 'bg-info-500',
      wrn: 'bg-warning-500',
      dng: 'bg-danger-500',
    }
    wclass += classes[props.widget.templatevar.widget_background_colour]
  }
  if (props.widget.templatevar.widget_text_colour) {
    wclass += ' '
    const classes = {
      wht: 'text-white',
      blk: 'text-black',
    }
    wclass += classes[props.widget.templatevar.widget_text_colour]
  }
  return wclass
})
</script>
