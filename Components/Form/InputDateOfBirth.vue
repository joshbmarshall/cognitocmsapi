<template>
  <cgn-form-label :label="label" :required="appearRequired !== false && required || appearRequired">
    <div class="cgn-input-wrapper relative flex">
      <div>
        <input
          ref="dayInput" v-model="day"
          class="cgn-input-field w-20 p-2"
          :class="{
            'cursor-not-allowed opacity-50': disabled,
            'text-danger-500': appearInvalid || showInvalid,
          }"
          type="text" inputmode="numeric" pattern="[0-9]*"
          :placeholder="dayPlaceholder"
          :disabled="disabled" :required="required"
          :maxlength="2" @paste.prevent
        >
        <input
          ref="monthInput" v-model="month"
          class="cgn-input-field w-20 p-2"
          :class="{
            'cursor-not-allowed opacity-50': disabled,
            'text-danger-500': appearInvalid || showInvalid,
          }"
          type="text" inputmode="numeric" pattern="[0-9]*"
          :placeholder="monthPlaceholder"
          :disabled="disabled" :required="required" :maxlength="2"
          @keydown="event => handleKeyDown('month', event)" @paste.prevent
        >
        <input
          ref="yearInput" v-model="year"
          class="cgn-input-field w-20 p-2"
          :class="{
            'cursor-not-allowed opacity-50': disabled,
            'text-danger-500': appearInvalid || showInvalid,
          }"
          type="text" inputmode="numeric" pattern="[0-9]*"
          :placeholder="yearPlaceholder"
          :disabled="disabled" :required="required" :maxlength="4"
          @keydown="event => handleKeyDown('year', event)" @paste.prevent
        >
        <div class="absolute inset-y-0 right-0 flex items-center pl-1">
          <i-heroicons-solid:calendar />
        </div>
      </div>

      <input
        v-if="!valid"
        class="absolute bottom-0 left-0 size-0 border-none p-0 focus:ring-0 focus-visible:outline-none"
        :required="required"
      >
    </div>

    <cgn-form-checkbox
      v-if="!hideCheckbox && inputValue"
      required :label="`${agePrefix}${useTime().diff(inputValue, 'year')}${ageSuffix}`"
    />
    <div v-if="showAge && inputValue" class="cgn-input-label">
      {{ agePrefix }}{{ useTime().diff(inputValue, 'year') }}{{ ageSuffix }}
    </div>
    <div v-if="!valid && inputValue" class="cgn-input-label">
      Invalid date
    </div>
  </cgn-form-label>
</template>

<script setup lang="ts">
const {
  label,
  dayPlaceholder = 'DD',
  monthPlaceholder = 'MM',
  yearPlaceholder = 'YYYY',

  hideCheckbox,
  showAge,
  agePrefix = 'I am ',
  ageSuffix = ' years old',

  disabled,
  required,
  appearRequired = undefined,
  appearInvalid,
} = defineProps<{
  label?: string
  dayPlaceholder?: string
  monthPlaceholder?: string
  yearPlaceholder?: string

  hideCheckbox?: boolean
  showAge?: boolean
  agePrefix?: string
  ageSuffix?: string

  disabled?: boolean
  required?: boolean
  appearRequired?: boolean
  appearInvalid?: boolean
}>()

const inputValue = defineModel<any>()
const valid = ref(false)

const day = ref<string>('')
const month = ref<string>('')
const year = ref<string>('')

const showInvalid = computed(() => !valid.value && day.value && month.value && year.value)

const dayInput = templateRef('dayInput')
const monthInput = templateRef('monthInput')
const yearInput = templateRef('yearInput')

const { focused: dayFocused } = useFocus(dayInput)
const { focused: monthFocused } = useFocus(monthInput)
const { focused: yearFocused } = useFocus(yearInput)

const handleKeyDown = (fieldType: 'month' | 'year', event: KeyboardEvent) => {
  if (event.key !== 'Backspace' && event.key !== 'Delete') {
    return
  }
  if (fieldType == 'year' && !year.value?.length) {
    event.preventDefault()
    monthFocused.value = true
    return
  }
  if (fieldType == 'month' && !month.value?.length) {
    event.preventDefault()
    dayFocused.value = true
  }
}

const calculateMonthOrDay = (input: string, max: number): { value: string, focusNext?: boolean, fillNext?: string } => {
  if (input.length >= 2) {
    if (Number.parseInt(input) > max) {
      return { value: `0${input.slice(0, 1)}`, focusNext: true, fillNext: input.slice(1) }
    }
    // isn't above the max, don't need to split into next field
    return { value: input, focusNext: true }
  }
  // only a single digit, check to move to next field or stay on current

  if (Number.parseInt(`${input}0`) > max) {
    return { value: `0${input}`, focusNext: true }
  }
  // possible that its the first number, don't move on to next field yet
  return { value: input }
}

const calculateYear = (yearInput: string) => {
  const maxYear = useTime().year()
  const currentCentury = Number.parseInt(maxYear.toString().slice(0, 2))
  const previousCentury = currentCentury - 1

  if (yearInput.length != 2) {
    // isn't at length of 2, don't do fancy stuff
    return yearInput
  }

  if (Number.parseInt(`${currentCentury}${yearInput}`) <= maxYear) {
    // more than current century but less than the max year for this century
    return `${currentCentury}${yearInput}`
  }
  // otherwise it must be the year with the previous century
  return `${previousCentury}${yearInput}`
}

const calculateInput = (fieldType: 'day' | 'month' | 'year', value?: string) => {
  // only allow numbers
  value = value?.replace(/\D/g, '')
  if (!value?.length) {
    return
  }

  if (fieldType == 'day') {
    const dayInfo = calculateMonthOrDay(value, 31)
    day.value = dayInfo.value
    if (dayInfo.focusNext) {
      monthFocused.value = true
    }
    if (dayInfo.fillNext?.length) {
      month.value = dayInfo.fillNext
    }
    return
  }
  if (fieldType == 'month') {
    const monthInfo = calculateMonthOrDay(value, 12)
    month.value = monthInfo.value
    if (monthInfo.focusNext) {
      yearFocused.value = true
    }
    if (monthInfo.fillNext?.length) {
      year.value = monthInfo.fillNext
    }
    return
  }
  year.value = calculateYear(value)
}

const validateDate = () => {
  if (!year.value || !month.value || !day.value) {
    valid.value = false
    inputValue.value = ''
    return
  }
  const date = useTime(`${year.value}-${month.value.padStart(2, '0')}-${day.value.padStart(2, '0')}`, 'YYYY-MM-DD', true)
  if (!date.isValid()) {
    valid.value = false
    inputValue.value = ''
    return
  }
  if (useTime().isBefore(date, 'day')) {
    valid.value = false
    inputValue.value = ''
    return
  }
  valid.value = true
  inputValue.value = date.format('YYYY-MM-DD')
}

const setDatesFromInput = () => {
  if (!inputValue.value) {
    return
  }
  const date = useTime(inputValue.value)

  if (useTime(`${year.value}-${month.value}-${day.value}`).isSame(date, 'day')) {
    return
  }
  day.value = date.format('DD')
  month.value = date.format('MM')
  year.value = date.format('YYYY')
}

watch(inputValue, () => {
  setDatesFromInput()
})
onMounted(setDatesFromInput)

watch(day, () => {
  calculateInput('day', day.value)
  validateDate()
})
watch(month, () => {
  calculateInput('month', month.value)
  validateDate()
})
watchDebounced(year, () => {
  calculateInput('year', year.value)
  validateDate()
}, {
  debounce: 800,
})
</script>
