<template>
  <div v-if="crs" class="h-[80dvh] w-full">
    <LMap
      ref="map"
      v-model:zoom="zoom"
      :crs="crs"
      :center="[mapheight / 2, mapwidth / 2]"
      :min-zoom="-5"
    >
      <LImageOverlay :url="imageOverlayUrl" :bounds="bounds" />

      <LRectangle
        v-for="(rect, idx) in rects"
        :key="idx"
        :lat-lngs="rect.coordinates"
        :fill="true"
        :color="rect.fill"
        @click="selectSite(rect)"
      >
        <LTooltip>
          {{ rect.hoverText }}
        </LTooltip>
      </LRectangle>
      <LRectangle
        :lat-lngs="[
          [5, 5],
          [5, 10],
          [10, 10],
          [10, 5],
        ]"
        :fill="true"
        color="#35495d"
        @click="console.log('test')"
      >
        <LTooltip>name! </LTooltip>
      </LRectangle>
    </LMap>
  </div>
</template>

<script setup lang="ts">
import type L from 'leaflet'
import { computed, ref } from 'vue'
import 'leaflet/dist/leaflet.css'

import { LImageOverlay, LMap, LRectangle, LTooltip } from '@vue-leaflet/vue-leaflet'
import { useElementSize } from '@vueuse/core'
import { CognitoImage } from '~cognito/models/Cognito/Image'
import type { CognitoMapSite } from '~cognito/models/Cognito/MapSite'

const props = defineProps({
  selectedColour: {
    type: String,
    default: '#ee5555',
  },
  unselectedColour: {
    type: String,
    default: '#eeeeee',
  },
  unavailableColour: {
    type: String,
    default: '#aaaaaa',
  },
  hoverColour: {
    type: String,
    default: '#5555ee',
  },
  image: {
    type: CognitoImage,
  },
  multipleSelection: {
    type: Boolean,
    default: false,
  },
  forceSelectionArray: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Number, Array<string>, Array<number>],
    default: '',
  },
  sites: {
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])
const mapwidth = ref(2000)
const mapheight = computed(() => {
  if (!props.image) {
    return 0
  }
  return Math.round(mapwidth.value / props.image.width * props.image.height)
})
const imageOverlayUrl = computed(() => {
  if (!props.image?.url) {
    return ''
  }
  if (!props.image?.height) {
    return ''
  }
  const filename = props.image.url.split('/').pop() || ''
  return `${props.image.url.replace(filename, '')}${mapwidth.value}x${mapheight.value}:${filename}`
})
const zoom = ref(-1)

const bounds = computed(
  () =>
    [
      [0, 0],
      [mapheight.value, mapwidth.value],
    ] as L.LatLngBoundsLiteral,
)
const crs = ref(null)

const map = ref()

const outerDiv = ref()
const { width } = useElementSize(outerDiv)
const screenScale = 10000

const doEmit = (value: any) => {
  if (typeof value == 'object') {
    emit('update:modelValue', value)
  } else if (props.forceSelectionArray || value == 0) {
    emit('update:modelValue', [value])
  } else {
    emit('update:modelValue', value)
  }
}
const rects = ref<CognitoMapSite[]>([])

const setPositions = () => {
  rects.value.forEach((e) => {
    const mapscale = mapwidth.value / screenScale
    e.coordinates = [
      [mapheight.value - (e.pos_y) * mapscale, e.pos_x * mapscale],
      [mapheight.value - (e.pos_y + e.pos_height) * mapscale, e.pos_x * mapscale],
      [mapheight.value - (e.pos_y + e.pos_height) * mapscale, (e.pos_x + e.pos_width) * mapscale],
      [mapheight.value - (e.pos_y) * mapscale, (e.pos_x + e.pos_width) * mapscale],
    ]
  })
}

const setColours = () => {
  rects.value.forEach((e) => {
    let changeTo = props.unselectedColour
    if (!e.available) {
      changeTo = props.unavailableColour
    } else if (e.id == props.modelValue) {
      changeTo = props.selectedColour
    } else if (props.multipleSelection && props.modelValue.includes(e.id)) {
      changeTo = props.selectedColour
    }
    if (e.fill != changeTo) {
      e.fill = changeTo
    }
  })
}

const selectSite = (rect: CognitoMapSite) => {
  if (!rect.available) {
    return
  }
  if (props.multipleSelection) {
    let newValue = props.modelValue

    if (typeof (newValue) != 'object') {
      newValue = []
    }

    if (newValue.includes(rect.id)) {
      newValue.splice(newValue.indexOf(rect.id), 1)
    } else {
      newValue.push(rect.id)
    }
    doEmit(newValue)
  } else {
    if (rect.id == props.modelValue) {
      doEmit(0)
    } else {
      doEmit(rect.id)
    }
  }
}

watch(() => props.modelValue, () => {
  setPositions()
  setColours()
}, {
  deep: true,
})

watch(() => width.value, () => {
  setPositions()
  setColours()
})

onMounted(async () => {
  const Leaflet = await import('leaflet')
  crs.value = Leaflet.CRS.Simple
  rects.value = props.sites
  rects.value.forEach((e: CognitoMapSite) => {
    e.is_hovered = false
    e.align = 'left'
  })
  if (props.multipleSelection) {
    if (typeof (props.modelValue) != 'object') {
      doEmit([])
    }
  } else {
    if (typeof (props.modelValue) == 'object') {
      doEmit(0)
    }
  }
  setPositions()
  setColours()
})
</script>
