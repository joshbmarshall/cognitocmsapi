<template>
  <div
    :id="props.block.anchor_name"
    :data-aos="props.block.aos_type"
    :data-aos-easing="props.block.aos_easing"
    :data-aos-offset="props.block.aos_offset"
    :data-aos-duration="props.block.aos_duration"
    :data-aos-delay="props.block.aos_delay"
    class="relative" :class="backgroundColourClass"
  >
    <cgn-background-image
      v-if="props.block.imageHashes?.background_image"
      class="absolute inset-0" :class="backgroundImageClass" :parallax="props.block.background_image_fixed"
      :image-hash="props.block.imageHashes?.background_image"
    />
    <cgn-image v-else-if="props.block.background_video_id" v-slot="{ src }" class="absolute inset-0" :image-hash="props.block.background_video?.imageHashes?.slate || ''" :width="500" custom>
      <video
        :poster="src"
        autoplay
        loop
        muted
        playsinline
        class="size-full object-cover object-center"
        :class="backgroundImageClass"
        :src="videoUrl.getUrl(props.block.background_video_id)"
      >
        <source
          type="video/mp4"
        >
      </video>
    </cgn-image>
    <page-builder-list-content
      v-if="visible" :widget="props.block" :url-parts="urlParts"
      :class="[pageClasses, { 'cgn-contained-class': !props.block.full_width }]"
    />
  </div>
</template>

<script setup lang="ts">
import { compareAsc } from 'date-fns'
import type { CognitoListPageContent } from '~cognito/models/Cognito/ListPage'
import { CognitoUrlParts } from '~cognito/models/Cognito/Page'
import { CognitoTime } from '~cognito/models/Cognito/Time'

const props = defineProps({
  block: {
    type: Object as PropType<CognitoListPageContent>,
    required: true,
  },
  urlParts: {
    type: CognitoUrlParts,
    required: true,
  },
})

const videoUrl = useVideoUrl()

const backgroundImageClass = computed(() => {
  const classes = []

  const opacity = {
    '': '',
    '10': 'opacity-10',
    '30': 'opacity-30',
    '50': 'opacity-50',
    '70': 'opacity-70',
    '90': 'opacity-90',
    '100': 'opacity-100',
  }
  classes.push(opacity[props.block.background_image_opacity as keyof typeof opacity])

  const saturation = {
    '': '',
    '0': 'saturate-0',
    '50': 'saturate-50',
    '100': 'saturate-100',
  }
  classes.push(saturation[props.block.background_image_saturation as keyof typeof saturation])

  return classes
})

const backgroundColourClass = computed(() => {
  const classes = []
  if (props.block.background_colour) {
    const background_colour = {
      wht: 'bg-white',
      blk: 'bg-black',
      bnd: 'bg-brand-500',
      pri: 'bg-primary-500',
      sec: 'bg-secondary-500',
      suc: 'bg-success-500',
      inf: 'bg-info-500',
      wrn: 'bg-warning-500',
      dng: 'bg-danger-500',
    }
    classes.push(background_colour[props.block.background_colour as keyof typeof background_colour])
  }
  return classes
})

const currentTime = useNow({ interval: 60000 })
const visible = computed(() => {
  if (props.block.editing) {
    // if editor has the block open, then display it for easier editing
    return true
  }
  if (props.block.hidden) {
    return false
  }
  if (props.block.start_time) {
    const hide_before = new CognitoTime(props.block.start_time)
    if (compareAsc(currentTime.value, hide_before.time) == -1) {
      return false
    }
  }
  if (props.block.end_time) {
    const hide_after = new CognitoTime(props.block.end_time)
    if (compareAsc(hide_after.time, currentTime.value) == -1) {
      return false
    }
  }
  return true
})

const pageClasses = computed(() => {
  const classes = []
  if (props.block.padding_top) {
    const padding_top = {
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
    classes.push(padding_top[props.block.padding_top as keyof typeof padding_top])
  }
  if (props.block.padding_bottom) {
    const padding_bottom = {
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
    classes.push(padding_bottom[props.block.padding_bottom as keyof typeof padding_bottom])
  }
  if (props.block.padding_left) {
    const padding_left = {
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
    classes.push(padding_left[props.block.padding_left as keyof typeof padding_left])
  }
  if (props.block.padding_right) {
    const padding_right = {
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
    classes.push(padding_right[props.block.padding_right as keyof typeof padding_right])
  }
  if (props.block.margin_top) {
    const margin_top = {
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
    classes.push(margin_top[props.block.margin_top as keyof typeof margin_top])
  }
  if (props.block.margin_bottom) {
    const margin_bottom = {
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
    classes.push(margin_bottom[props.block.margin_bottom as keyof typeof margin_bottom])
  }
  if (props.block.text_colour) {
    const text_colour = {
      wht: 'text-white',
      blk: 'text-black',
      bnd: 'text-brand-500',
      pri: 'text-primary-500',
      sec: 'text-secondary-500',
      suc: 'text-success-500',
      inf: 'text-info-500',
      wrn: 'text-warning-500',
      dng: 'text-danger-500',
    }
    classes.push(text_colour[props.block.text_colour as keyof typeof text_colour])
  }

  if (props.block.imageHashes?.background_image) {
    classes.push('relative')
  }
  return classes
})

/* tailwind.css
.cgn-contained-class {
  @apply px-6 py-2 mx-auto max-w-5xl
}
*/
</script>
