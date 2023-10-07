<template>
  <div class="lg:flex lg:h-full lg:flex-col">
    <header class="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
      <h1 class="text-base font-semibold leading-6 text-gray-900">
        <time :datetime="format(curMonth, 'yyyy-MM')">
          {{ format(curMonth, 'MMMM yyyy') }}
        </time>
      </h1>
      <div class="flex items-center">
        <div class="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
          <div class="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-gray-300" aria-hidden="true" />
          <button
            type="button"
            class="flex items-center justify-center rounded-l-md py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 md:w-9 md:px-2 md:hover:bg-gray-50"
            @click="subMonth"
          >
            <span class="sr-only">Previous month</span>
            <i-heroicons-solid:chevron-left class="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="hidden px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 md:block"
            @click="goToday"
          >
            Today
          </button>
          <span class="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
          <button
            type="button"
            class="flex items-center justify-center rounded-r-md py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 md:w-9 md:px-2 md:hover:bg-gray-50"
            @click="addMonth"
          >
            <span class="sr-only">Next month</span>
            <i-heroicons-solid:chevron-right class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
    <div class="shadow ring-1 ring-black/5 lg:flex lg:flex-auto lg:flex-col">
      <div class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
        <div class="bg-white py-2">
          M<span class="sr-only sm:not-sr-only">on</span>
        </div>
        <div class="bg-white py-2">
          T<span class="sr-only sm:not-sr-only">ue</span>
        </div>
        <div class="bg-white py-2">
          W<span class="sr-only sm:not-sr-only">ed</span>
        </div>
        <div class="bg-white py-2">
          T<span class="sr-only sm:not-sr-only">hu</span>
        </div>
        <div class="bg-white py-2">
          F<span class="sr-only sm:not-sr-only">ri</span>
        </div>
        <div class="bg-white py-2">
          S<span class="sr-only sm:not-sr-only">at</span>
        </div>
        <div class="bg-white py-2">
          S<span class="sr-only sm:not-sr-only">un</span>
        </div>
      </div>
      <div class="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
        <div class="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
          <div v-for="day in days" :key="day.date" class="group/day relative px-3 py-2" :class="[day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500']">
            <time
              :datetime="day.date"
              class="cursor-pointer"
              :class="day.isToday ? 'flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 font-semibold text-white' : undefined"
              @click="selectDay(day.date)"
            >
              {{ format(day.day, 'dd') }}
            </time>
            <ol v-if="day.events.length > 0" class="my-1">
              <li v-for="event in day.events" :key="event.id">
                <span class="group/event mb-1 flex cursor-pointer rounded-md px-1" :style="{ 'background-color': event.backgroundColor, 'color': event.textColor }" @click="openModal(event.id)">
                  <p class="flex-auto truncate font-medium">
                    {{ event.title }}
                  </p>
                </span>
              </li>
            </ol>
          </div>
        </div>
        <div class="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
          <button
            v-for="day in days" :key="day.date"
            type="button"
            class="flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10"
            :class="[day.isCurrentMonth ? 'bg-white' : 'bg-gray-50', (day.isSelected || day.isToday) && 'font-semibold', day.isSelected && 'text-white', !day.isSelected && day.isToday && 'text-brand-500', !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900', !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-500']"
            @click="selectDay(day.date)"
          >
            <time :datetime="day.date" class="ml-auto" :class="[day.isSelected && 'flex h-6 w-6 items-center justify-center rounded-full', day.isSelected && day.isToday && 'bg-brand-500', day.isSelected && !day.isToday && 'bg-gray-900']">
              {{ format(day.day, 'd') }}
            </time>
            <span class="sr-only">{{ day.events.length }} events</span>
            <span v-if="day.events.length > 0" class="-mx-0.5 mt-auto flex flex-wrap-reverse">
              <span v-for="event in day.events" :key="event.id" class="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400" :style="{ backgroundColor: event.backgroundColor }" />
            </span>
          </button>
        </div>
      </div>
    </div>
    <div v-if="selectedDay" class="px-4 py-10 sm:px-6 lg:hidden">
      <div class="text-xl">
        {{ format(selectedDay.day, 'do MMM') }}
      </div>
      <div v-if="selectedDay.events.length > 0" class="cursor-pointer">
        <ol class="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black/5">
          <li
            v-for="event in selectedDay.events" :key="event.id" class="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50"
            @click="openModal(event.id)"
          >
            <div class="flex-auto">
              <p class="font-semibold text-gray-900">
                {{ event.title }}
              </p>
              <time :datetime="event.datetimeISO" class="mt-2 flex items-center text-gray-700">
                <i-heroicons-solid:clock class="mr-2 h-5 w-5" :style="{ color: event.backgroundColor }" aria-hidden="true" />
                <template v-if="!event.starts_today">
                  {{ event.start_day }},
                </template>
                {{ event.start_time }}
                -
                <template v-if="!event.ends_today">
                  {{ event.end_day }},
                </template>
                {{ event.end_time }}
              </time>
            </div>
          </li>
        </ol>
      </div>
      <div v-else>
        No events
      </div>
    </div>
  </div>
  <cgn-modal v-if="modal_event.id" v-model="event_popup">
    <template #content>
      <h3 class="select-none text-lg font-medium leading-6 text-gray-900">
        {{ modal_event.name }}
      </h3>
      <div class="mt-2 text-blue-600">
        {{ modal_event_date }}
      </div>
      <div class="prose" v-html="modal_event.calendar_content" />
    </template>
    <template #button-footer>
      <div
        v-if="
          !modal_event.can_enter_online
            && !modal_event.can_buy_spectator_tickets
            && !modal_event.title.is_experience
        "
        class="w-full border-t-2 border-gray-200 py-3"
      >
          &nbsp;
      </div>
      <a
        v-if="modal_event.can_buy_spectator_tickets"
        :href="`/enter#/spectate/${modal_event.id}`"
        class="
            inline-flex
            w-full
            justify-center
            border-t-2
            border-gray-200
            px-4
            py-3
            text-sm
            font-medium
            text-gray-600
            shadow-sm
            hover:bg-gray-100
          "
        :class="modal_event.can_enter_online ? 'sm:w-1/2 border-l' : ''"
      >
        <span>
          {{ modal_event.spectator_prompt }} ${{ modal_event.spectator_price }}
        </span>
      </a>
      <a
        v-if="modal_event.can_enter_online && !modal_event.title.is_experience && !modal_event.title.purchase_multiple_entries"
        :href="`/enter#/enter/${modal_event.id}`"
        class="
            inline-flex
            w-full
            justify-center
            border-t-2
            border-gray-200
            px-4
            py-3
            text-sm
            font-medium
            text-gray-600
            shadow-sm
            hover:bg-gray-100
          "
        :class="
          modal_event.can_buy_spectator_tickets ? 'sm:w-1/2 border-r' : ''
        "
      >
        Enter from ${{ modal_event.event_entry_price }}
      </a>
      <a
        v-if="modal_event.can_enter_online"
        :href="`/enter#/enterMe/${modal_event.id}`"
        class="
            inline-flex
            w-full
            justify-center
            border-t-2
            border-gray-200
            px-4
            py-3
            text-sm
            font-medium
            text-gray-600
            shadow-sm
            hover:bg-gray-100
          "
        :class="
          modal_event.can_buy_spectator_tickets ? 'sm:w-1/2 border-r' : ''
        "
      >
        Enter from ${{ modal_event.event_entry_price }}
      </a>
    </template>
  </cgn-modal>
</template>

<script setup lang="ts">
import { addDays, addMonths, format, formatISO, isAfter, isBefore, isMonday, isSameDay, parse, previousMonday, startOfDay, startOfMonth, subMonths } from 'date-fns'
import { $axios } from '~cognito/plugins/axios'
import { EventEvent } from '~cognito/models/Event/Event'

const calendarEvents = ref<{
  id: number
  title: string
  start: string
  end: string
  backgroundColor: string
  textColor: string
}[]>([])

const curMonth = ref(startOfMonth(new Date()))
const selectedDate = ref('')
const modal_event = ref(new EventEvent())
const event_popup = ref(false)

const modal_event_date = computed(() => {
  return modal_event.value.isOneDayEvent()
    ? `${modal_event.value.start_time.format('d MMMM h:mma')} - ${modal_event.value.end_time.format('h:mma')}`
    : `${modal_event.value.start_time.format('d MMMM h:mma')} - ${modal_event.value.end_time.format('d MMMM h:mma')}`
})
const getEvents = () => {
  const start = format(subMonths(curMonth.value, 1), 'yyyy-MM-dd')
  const end = format(addMonths(curMonth.value, 2), 'yyyy-MM-dd')
  $axios
    .get(`/api/v1/event/event/calendar?start=${start}&end=${end}`)
    .then((res) => {
      calendarEvents.value = res.data
    })
}

const goToday = () => {
  curMonth.value = startOfMonth(new Date())
}
const addMonth = () => {
  curMonth.value = addMonths(curMonth.value, 1)
}
const subMonth = () => {
  curMonth.value = subMonths(curMonth.value, 1)
}

const showOnCalendar = (startTime: Date, endTime: Date, day: Date) => {
  const startDay = startOfDay(startTime)
  const endDay = startOfDay(endTime)
  if (isSameDay(startDay, day)) {
    return true
  }
  if (isSameDay(endDay, day)) {
    return true
  }
  if (isAfter(endDay, day) && isBefore(startDay, day)) {
    return true
  }
  return false
}

const days = computed<{
  date: string
  day: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  events: {
    id: number
    title: string
    start: Date
    end: Date
    start_day: string
    start_time: string
    end_day: string
    end_time: string
    starts_today: boolean
    ends_today: boolean
    datetimeISO: string
    backgroundColor: string
    textColor: string
  }[]
}[]>(() => {
  let calculateDate = curMonth.value
  const endDate = addMonths(calculateDate, 1)
  const currentMonthNumber = format(curMonth.value, 'MM')
  if (!isMonday(calculateDate)) {
    calculateDate = previousMonday(calculateDate)
  }
  const data = []
  while (isBefore(calculateDate, endDate)) {
    for (let i = 0; i < 42; i++) {
      // Calculate events for this day
      const todayEvents = calendarEvents.value.filter(e => showOnCalendar(parse(e.start, 'yyyy-MM-dd HH:mm:ss', new Date()), parse(e.end, 'yyyy-MM-dd HH:mm:ss', new Date()), calculateDate)).map((item) => {
        const start = parse(item.start, 'yyyy-MM-dd HH:mm:ss', new Date())
        const end = parse(item.end, 'yyyy-MM-dd HH:mm:ss', new Date())
        return {
          id: item.id,
          title: item.title,
          start,
          end,
          start_day: format(start, 'dd MMM'),
          start_time: format(start, 'hh:mma'),
          end_day: format(end, 'dd MMM'),
          end_time: format(end, 'hh:mma'),
          starts_today: isSameDay(start, calculateDate),
          ends_today: isSameDay(end, calculateDate),
          datetimeISO: formatISO(start),
          backgroundColor: item.backgroundColor,
          textColor: item.textColor,
        }
      })
      data.push({
        date: format(calculateDate, 'yyyy-MM-dd'),
        day: calculateDate,
        isCurrentMonth: currentMonthNumber === format(calculateDate, 'MM'),
        isToday: isSameDay(new Date(), calculateDate),
        isSelected: format(calculateDate, 'yyyy-MM-dd') === selectedDate.value,
        events: todayEvents,
      })
      calculateDate = addDays(calculateDate, 1)
    }
  }
  return data
})

watch(() => curMonth.value, getEvents)

const selectedDay = computed(() => {
  return days.value.find(day => day.date === selectedDate.value)
})

const selectDay = (date: string) => {
  selectedDate.value = date
}

const openModal = (id: number) => {
  new EventEvent().find_one({ url: String(id) })
    .then((data) => {
      modal_event.value = new EventEvent(data)
      event_popup.value = true
    })
}
onMounted(() => {
  selectedDate.value = format(new Date(), 'yyyy-MM-dd')
  getEvents()
})
</script>
