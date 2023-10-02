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
      ref="stage"
      :config="{
        width,
        height: width / props.aspect,
      }"
    >
      <v-layer>
        <template v-for="rect in rects" :key="rect.id">
          <v-rect
            :config="rect"
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
            <v-text
              :config="{
                x: rect.hover_x,
                y: rect.hover_y,
                width: 100,
                height: 100,
                text: rect.hoverText,
                align: rect.align,
                verticalAlign: rect.valign,
                fontSize: 16,
                shadowColor: 'white',
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowBlur: 4,
              }"
            />
          </template>
        </template>
      </v-layer>
    </v-stage>
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
  strokeColour: {
    type: String,
    default: '#000000',
  },
  opacity: {
    type: Number,
    default: 0.5,
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
  sites: {
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const outerDiv = ref()
const { width, height } = useElementSize(outerDiv)

const screenScale = 10000

const rects = ref<CognitoMapSite[]>([])

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

const stage = ref()
const rectMouseMove = (rect: CognitoMapSite) => {
  rect.is_hovered = true
  const mousePos = stage.value.getStage().getPointerPosition()

  const hover_x_left = mousePos.x > width.value / 2
  const hover_y_top = mousePos.y > height.value / 2

  if (hover_x_left) {
    rect.hover_x = mousePos.x - 105
    rect.align = 'right'
  } else {
    rect.hover_x = mousePos.x + 5
    rect.align = 'left'
  }
  if (hover_y_top) {
    rect.hover_y = mousePos.y - 105
    rect.valign = 'bottom'
  } else {
    rect.hover_y = mousePos.y + 5
    rect.valign = 'top'
  }
  if (!rect.available) {
    return
  }
  rect.fill = props.hoverColour
}

const rectMouseOut = (rect: CognitoMapSite) => {
  rect.is_hovered = false
  if (rect.id == props.modelValue) {
    rect.fill = props.selectedColour
  } else {
    setColours()
  }
}

const rectTouchStart = (rect: CognitoMapSite) => {
  rectMouseMove(rect)
  setTimeout(() => {
    rectMouseOut(rect)
  }, 2000)
}

const selectSite = (rect: CognitoMapSite) => {
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
  rects.value = props.sites
  rects.value.forEach((e: CognitoMapSite) => {
    e.stroke = props.strokeColour
    e.opacity = props.opacity
    e.strokeWidth = 1
    e.is_hovered = false
    e.align = 'left'
    e.valign = 'top'
  })
  setColours()
})
</script>
