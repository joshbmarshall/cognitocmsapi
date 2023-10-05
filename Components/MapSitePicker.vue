<template>
  <div ref="outerDiv" class="relative">
    <div
      :style="{
        width: `${width}px`,
        height: `${Math.round(width / aspect)}px`,
      }"
      class="absolute"
    >
      <template v-for="rect in rects" :key="rect.id">
        <div
          :style="{
            left: `${rect.x}px`,
            top: `${rect.y}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            rotate: rect.rotation,
            border: '1px solid black',
            backgroundColor: rect.fill,
          }" class="absolute"
          @mousemove="rectMouseMove(rect)"
          @mouseout="rectMouseOut(rect)"
          @click="selectSite(rect)"
          @touchstart="rectTouchStart(rect)"
          @touchend="selectSite(rect)"
        />
      </template>
      <template v-for="rect in rects" :key="rect.id">
        <template
          v-if="rect.is_hovered"
        >
          <div
            :style="{
              left: `${rect.hover_x}px`,
              top: `${rect.hover_y}px`,
              width: `${100}px`,
              textAlign: rect.align,
            }"
            class="absolute bg-white/80 p-2"
          >
            {{ rect.hoverText }}
          </div>
        </template>
      </template>
    </div>
    <div
      :style="{
        width: `${width}px`,
        height: `${Math.round(width / aspect)}px`,
      }"
    >
      <cgn-lazy-image :image="props.image" class="w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
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
    type: [CognitoImage, Object],
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  sites: {
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const outerDiv = ref()
const { width } = useElementSize(outerDiv)
const outerDivBounding = useElementBounding(outerDiv)
const pointerPos = usePointer({ target: outerDiv })
const screenScale = 10000

const rects = ref<CognitoMapSite[]>([])

const aspect = computed(() => {
  if (!props.image) {
    return 1
  }
  return props.image.width / props.image.height
})

const setPositions = () => {
  rects.value.forEach((e) => {
    e.x = e.pos_x * width.value / screenScale
    e.y = e.pos_y * width.value / screenScale
    e.width = e.pos_width * width.value / screenScale
    e.height = e.pos_height * width.value / screenScale
  })
}

const setColours = () => {
  rects.value.forEach((e) => {
    let changeTo = props.unselectedColour
    if (!e.available) {
      changeTo = props.unavailableColour
    } else if (e.id == props.modelValue) {
      changeTo = props.selectedColour
    }
    if (e.fill != changeTo) {
      e.fill = changeTo
    }
  })
}

const rectMouseMove = (rect: CognitoMapSite) => {
  rect.is_hovered = true

  const x = pointerPos.x.value - outerDivBounding.x.value
  const y = pointerPos.y.value - outerDivBounding.y.value

  const hover_x_left = x > width.value / 2

  if (hover_x_left) {
    rect.hover_x = x - 105
    rect.align = 'right'
  } else {
    rect.hover_x = x + 5
    rect.align = 'left'
  }
  rect.hover_y = y + 5
  if (!rect.available) {
    return
  }
  rect.fill = props.hoverColour
}

const rectMouseOut = (rect: CognitoMapSite) => {
  rect.is_hovered = false
  setColours()
}

const selectSite = (rect: CognitoMapSite) => {
  if (!rect.available) {
    return
  }
  if (rect.id == props.modelValue) {
    emit('update:modelValue', 0)
  } else {
    emit('update:modelValue', rect.id)
  }
}

const rectTouchStart = (rect: CognitoMapSite) => {
  rectMouseMove(rect)
  selectSite(rect)
  setTimeout(() => {
    rectMouseOut(rect)
  }, 2000)
}

watch(() => props.modelValue, () => {
  setPositions()
  setColours()
})

watch(() => width.value, () => {
  setPositions()
  setColours()
})

onMounted(() => {
  rects.value = props.sites
  rects.value.forEach((e: CognitoMapSite) => {
    e.is_hovered = false
    e.align = 'left'
  })
  setPositions()
  setColours()
})
</script>
