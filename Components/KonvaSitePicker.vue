<template>
  <div ref="outerDiv" class="relative">
    <div
      :style="{
        width: `${width}px`,
        height: `${height}px`,
      }"
      class="absolute"
    >
      <cgn-lazy-image :image="props.image" class="w-full" />
    </div>
    <v-stage
      v-if="width"
      :config="{
        width,
        height: width / props.aspect,
      }"
    >
      <v-layer>
        <template v-for="rect in rects" :key="rect.id">
          <v-rect
            :config="rect"
            @mouseover="handleMouseOver(rect)"
            @mouseout="handleMouseOut(rect)"
            @click="selectSite(rect)"
            @touchstart="selectSite(rect)"
          />
        </template>
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { CognitoImage } from '~cognito/models/Cognito/Image'

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
  strokeColour: {
    type: String,
    default: '#000000',
  },
  opacity: {
    type: String,
    default: '0.5',
  },
  image: {
    type: [CognitoImage, Object],
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  aspect: {
    type: Number,
    default: 1,
  },
})
const emit = defineEmits(['update:modelValue'])

const outerDiv = ref()
const { width, height } = useElementSize(outerDiv)

const screenScale = 10000

const rects = ref([
  {
    id: 1,
    pos_x: 200,
    pos_y: 100,
    pos_width: 400,
    pos_height: 800,
    rotation: 15,
    available: true,
    hoverText: 'Garage A11 - $110.00',
  },
  {
    id: 2,
    pos_x: 550,
    pos_y: 500,
    pos_width: 400,
    pos_height: 800,
    available: true,
    hoverText: 'Garage A12 - $110.00',
  },
  {
    id: 3,
    pos_x: 1400,
    pos_y: 500,
    pos_width: 600,
    pos_height: 400,
    available: false,
    hoverText: 'Garage B2 - $150.00',
  },
])

const handleMouseOver = (rect) => {
  if (!rect.available) {
    return
  }
  rect.fill = props.hoverColour
}

const setColours = () => {
  rects.value.forEach((e) => {
    e.x = e.pos_x * width.value / screenScale
    e.y = e.pos_y * width.value / screenScale
    e.width = e.pos_width * width.value / screenScale
    e.height = e.pos_height * width.value / screenScale
    if (!e.available) {
      e.fill = props.unavailableColour
    } else if (e.id == props.modelValue) {
      e.fill = props.selectedColour
    } else {
      e.fill = props.unselectedColour
    }
  })
}

const handleMouseOut = (rect) => {
  if (rect.id == props.modelValue) {
    rect.fill = props.selectedColour
  } else {
    setColours()
  }
}

const selectSite = (rect) => {
  if (!rect.available) {
    return
  }
  if (rect.id == props.modelValue) {
    emit('update:modelValue', 0)
    setColours()
    return
  }
  emit('update:modelValue', rect.id)
  setColours()
}

watch(() => props.modelValue, () => {
  setColours()
})

watch(() => width.value, () => {
  setColours()
})

onMounted(() => {
  rects.value.forEach((e) => {
    e.stroke = props.strokeColour
    e.opacity = props.opacity
    e.strokeWidth = 1
  })
  setColours()
})
</script>
