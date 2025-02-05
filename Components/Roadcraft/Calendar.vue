<template>
  <div>
    <div class="flex flex-col justify-between md:flex-row">
      <div class="flex max-w-2xl flex-1 flex-wrap justify-between px-2 capitalize">
        <div class="flex w-3/5 items-center gap-1 lg:w-auto">
          <div class="size-4 rounded-full bg-yellow-200" />
          2 courses concurrently
        </div>
        <div class="flex w-2/5 items-center gap-1 lg:w-auto">
          <div class="size-4 rounded-full bg-orange-200" />
          weekends
        </div>
        <div class="flex w-3/5 items-center gap-1 lg:w-auto">
          <div class="size-4 rounded-full bg-lime-500" />
          school holidays
        </div>
        <div class="flex w-2/5 items-center gap-1 lg:w-auto">
          <div class="size-4 rounded-full bg-red-600" />
          public holidays
        </div>
      </div>
      <i-heroicons-outline:printer class="mr-3 cursor-pointer text-right" @click="doprint" />
      <div v-if="false" class="flex justify-center py-2">
        <cgn-button color-brand fullwidth @click="toggleEventView()">
          {{ showAllEvents ? 'All events' : 'Your events' }}
        </cgn-button>
      </div>
    </div>
    <div ref="roadcraftCalendarContainer" :class="print_view ? '' : 'h-[80vh] overflow-x-scroll'">
      <div class="sticky top-0 z-10 w-fit bg-white xl:w-full">
        <div class="flex flex-row">
          <div class="sticky left-0 top-0 min-w-16 border-r-2 border-gray-400 bg-white" />
          <div
            v-for="facility in facilities" :key="facility.id"
            class="w-full min-w-32 border-r-2 border-gray-400 text-center xl:min-w-0"
          >
            {{ facility.name }}
          </div>
          <div class="hidden min-w-16 xl:block" />
        </div>
      </div>
      <div class="w-fit xl:w-full">
        <div
          v-for="day, idx in filteredDays" :key="idx" class="flex border-t border-gray-500/20 hover:bg-gray-300"
          :class="{ 'bg-blue-100': day.date.format('d') == '1', 'bg-orange-200 hover:bg-orange-300': day.date.isWeekend() && day.date.format('d') != '1', 'currentDay border-t-2 border-purple-600': day.date.isSameDay(today) }"
        >
          <div
            class="sticky left-0 min-w-16 border-r-2 border-gray-400 bg-gray-100 p-1 xl:relative"
            :class="{ 'border-orange-400 bg-orange-200': day.date.isWeekend() && !day.holiday, 'bg-lime-500': day.holiday?.is_school_holiday, 'bg-red-600 text-on-danger': day.holiday?.is_public_holiday }"
          >
            <div v-if="showMonthLabel(day)" class="text-xl font-bold">
              {{ day.date.format('MMM') }}
            </div>
            {{ day.date.format('EEEEEE') }}
            {{ day.date.format('d') }}
          </div>
          <div
            v-for="facility in facilities" :key="facility.id"
            class="flex w-full min-w-32 border-r-2 border-gray-400 text-center xl:min-w-0"
            :class="{ 'border-orange-400': day.date.isWeekend(), 'bg-yellow-200': day.eventDays.filter(e => e.facilities.find(e => e.id == facility.id)).length > 1, 'bg-purple-200': day.date.isSameDay(today) }"
          >
            <div class="flex-1" :class="{ 'bg-black/10': !facility.is_primary_facility }">
              <template v-for="eventDay in day.eventDays" :key="eventDay.id">
                <template v-for="evfacility in eventDay.facilities" :key="evfacility.id">
                  <div
                    v-if="evfacility.id == facility.id"
                    class="relative cursor-pointer py-1 hover:bg-gray-500/30"
                    @click="selectEvent(eventDay.event)"
                  >
                    <div>{{ eventDay.event.course?.name }}</div>
                    <div>Day {{ day.date.diffInDays(eventDay.event.start_date) + 1 }}</div>
                    <div>{{ eventDay.event.customer?.short_name }}</div>
                    <div>{{ eventDay.event.note }}</div>
                    <div v-if="eventDay.event.vehicle_numbers">
                      V: {{ eventDay.event.vehicle_numbers }}
                    </div>
                    <div v-if="eventDay.event.student_numbers">
                      S: {{ eventDay.event.student_numbers }}
                    </div>
                    <div v-if="eventDay.event.status == 'Offered'" class="absolute right-1 top-1" title="Offered">
                      <i-heroicons-solid:exclamation-triangle />
                    </div>
                    <div v-if="eventDay.event.status == 'Pending Numbers'" class="absolute right-1 top-1" title="Pending Numbers">
                      <i-heroicons-solid:question-mark-circle />
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
          <div
            class="hidden min-w-16 bg-gray-100 p-1 xl:block"
            :class="{ 'bg-orange-200': day.date.isWeekend() && !day.holiday, 'bg-lime-500': day.holiday?.is_school_holiday, 'bg-red-600 text-on-danger': day.holiday?.is_public_holiday }"
          >
            <div v-if="showMonthLabel(day)" class="text-xl font-bold">
              {{ day.date.format('MMM') }}
            </div>
            {{ day.date.format('EEEEEE') }}
            {{ day.date.format('d') }}
          </div>
        </div>
      </div>
    </div>
    <cgn-modal v-model="modal_open">
      <template #clean-content>
        <div class="flex flex-col gap-2">
          <div class="text-3xl font-bold">
            {{ modalEvent.course.name }}
          </div>
          <div class="text-xl">
            <span>{{ modalEvent.start_date.format('E do LLL') }}</span>
            <span v-if="modalEvent.number_of_days > 1"> - {{ format(addDays(modalEvent.start_date.time, modalEvent.number_of_days - 1), 'E do LLL') }}</span>
          </div>
          <cgn-alert-warning v-if="modalEvent.status == 'Offered'">
            Status: Offered
          </cgn-alert-warning>
          <div v-if="modalEvent.customer">
            <span class="text-sm">Customer</span>
            <span class="pl-2 text-lg">
              {{ modalEvent.customer.name }}
            </span>
          </div>
          <div v-if="modalEvent.eventDays?.length > 0" class="text-lg">
            <table class="w-full">
              <tbody>
                <!-- Educators table -->
                <template v-if="modalEvent.eventEducators.length > 0">
                  <tr>
                    <th class="text-lg">
                      Educators
                    </th>
                    <td v-for="eventDay in modalEvent.eventDays" :key="eventDay.date" class="border-l border-black text-center">
                      {{ new CognitoTime(eventDay.date).format('E do LLL') }}
                    </td>
                  </tr>
                  <tr v-for="educator, index in modalEvent.eventEducators" :key="educator.educator_id" :class="{ 'bg-gray-100': !(index % 2) }">
                    <td class="border-t border-black">
                      {{ educator.educator.first_name }}
                      {{ educator.educator.last_name }}
                    </td>
                    <td v-for="eventDay in modalEvent.eventDays" :key="eventDay.date" class="border-l border-t border-black text-center">
                      <div v-for="evDayEducator in eventDay.eventDayEducators.filter(e => e.event_educator.educator_id == educator.educator.id && e.assigned)" :key="evDayEducator.educator_id">
                        {{ evDayEducator.role.name }}
                      </div>
                    </td>
                  </tr>
                </template>
                <tr class="h-8" />
                <!-- Facility table -->
                <template v-if="modalEvent.eventDays.length > 0">
                  <tr>
                    <th class="text-lg">
                      Facilities
                    </th>
                    <td v-for="eventDay in modalEvent.eventDays" :key="eventDay.date" class="border-l border-black text-center">
                      {{ new CognitoTime(eventDay.date).format('E do LLL') }}
                    </td>
                  </tr>
                  <tr v-for="facility, index in facilities" :key="facility.id" :class="{ 'bg-gray-100': !(index % 2) }">
                    <td class="border-t border-black">
                      {{ facility.name }}
                    </td>
                    <td v-for="eventDay in modalEvent.eventDays" :key="eventDay.date" class="border-l border-t border-black">
                      <i-heroicons-solid:check v-if="eventDay.facilities.find(e => e.id == facility.id)" class="mx-auto" />
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </cgn-modal>
  </div>
</template>

<script setup lang="ts">
import { addDays, addMonths, endOfMonth, format, formatISO, startOfMonth, subMonths } from 'date-fns'
import { gql } from 'graphql-request'
import { CognitoTime } from '~cognito/models/Cognito/Time'
import { $axios } from '~cognito/plugins/axios'
import { useUserStore } from '~cognito/stores/user'

const userStore = useUserStore()
const today = ref<CognitoTime>(new CognitoTime())

class RoadcraftFacility {
  id: number
  name: string
  is_primary_facility: boolean
  constructor(source?: Partial<RoadcraftFacility>) {
    this.id = 0
    this.name = ''
    this.is_primary_facility = true
    Object.assign(this, source)
  }
}

class RoadcraftCalendarDay {
  date: CognitoTime
  holiday: {
    name: string
    is_public_holiday: boolean
    is_school_holiday: boolean
  }

  eventDays: {
    date: CognitoTime
    event: {
      id: number
      number_of_days: number
      student_numbers: string
      vehicle_numbers: string
      note: string
      start_date: CognitoTime
      customer: {
        name: string
        short_name: string
      }
      status: string
      course: {
        name: string
      }
      eventEducators: {
        educator_id: number
      }[]
    }
    facilities: {
      id: number
      name: string
    }[]
  }[]

  constructor(source?: Partial<RoadcraftCalendarDay>) {
    this.date = new CognitoTime()
    this.holiday = {
      name: '',
      is_public_holiday: false,
      is_school_holiday: false,
    }
    this.eventDays = []

    Object.assign(this, source)
    if (source?.date) {
      this.date = new CognitoTime(source.date)
    }
    this.eventDays.forEach((eventDay) => {
      if (eventDay.event.start_date) {
        eventDay.event.start_date = new CognitoTime(eventDay.event.start_date)
      }
    })
  }
}

const facilities = ref<RoadcraftFacility[]>([])

const days = ref<RoadcraftCalendarDay[]>([])

const roadcraftCalendarContainer = ref()

const showAllEvents = ref(true)

const print_view = ref(false)
const modal_open = ref(false)
const modalEvent = ref()

const selectEvent = (event) => {
  modalEvent.value = event
  modal_open.value = true
}

const doprint = () => {
  print_view.value = true
  nextTick(() => {
    window.print()
  })
}

const getFilteredDay = (day: RoadcraftCalendarDay) => {
  const filteredDay = ref(new RoadcraftCalendarDay())
  filteredDay.value.date = day.date
  filteredDay.value.holiday = day.holiday
  filteredDay.value.eventDays = day.eventDays.filter(e => e.event.eventEducators.find(e => e.educator_id == userStore.user.id))
  return filteredDay.value
}

const filteredDays = computed(() => {
  if (!showAllEvents.value) {
    const filteredDay = ref<RoadcraftCalendarDay[]>([])
    days.value.forEach((day) => {
      filteredDay.value.push(getFilteredDay(day))
    })
    return filteredDay.value
  }
  return days.value
})

const toggleEventView = () => {
  showAllEvents.value = !showAllEvents.value
}

const showMonthLabel = (day) => {
  const date = day.date.format('d')
  if (date == '1') {
    return true
  }
  if (date == '8') {
    return true
  }
  if (date == '16') {
    return true
  }
  if (date == '24') {
    return true
  }
  return false
}

onMounted(() => {
  $axios.graphql(gql`query roadcraftCalendarQuery($calendarStart: String!){
    roadcraftFacilitys {
      id
      name
      is_primary_facility
    }
    roadcraftMisc {
      calendar(from_date: $calendarStart) {
        date
        holiday {
          name
          is_public_holiday
          is_school_holiday
        }
        is_public_holiday
        is_school_holiday
        eventDays {
          id
          date
          event {
            start_date
            number_of_days
            vehicle_numbers
            student_numbers
            note
            status
            customer {
              name
              short_name
            }
            course {
              name
            }
            eventEducators {
              educator {
                id
                first_name
                last_name
              }
            }
            eventDays {
              date
              facilities {
                id
                name
              }
              eventDayEducators {
                event_educator {
                  educator_id
                }
                assigned
                role {
                  name
                }
              }
            }
          }
          facilities {
            id
            name
          }
        }
      }
    }
  }`, {
    calendarStart: formatISO(startOfMonth(subMonths(new Date(), 1)), { representation: 'date' }),
  }).then((data: any) => {
    facilities.value = data.roadcraftFacilitys
    console.log(facilities.value[0])
    days.value = data.roadcraftMisc.calendar.map(e => new RoadcraftCalendarDay(e))
    nextTick(() => {
      roadcraftCalendarContainer.value.getElementsByClassName('currentDay')[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  })
})
</script>
