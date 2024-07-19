<template>
  <div class="flex justify-between p-2">
    <div class="flex w-full items-center justify-center text-2xl">
      <i-heroicons-solid:arrow-left class="cursor-pointer" @click="month_offset--" />
      <div class="w-40 select-none text-center">
        {{ format(addMonths(today.time, month_offset), 'MMM yyyy') }}
      </div>
      <i-heroicons-solid:arrow-right class="cursor-pointer" @click="month_offset++" />
    </div>
    <cgn-button color-brand @click="month_offset = 0">
      Today
    </cgn-button>
  </div>
  <div class="overflow-x-scroll">
    <table class="border-separate border-spacing-0 border-black">
      <tr class="border-inherit">
        <th class="sticky left-0 z-10 border border-inherit bg-blue-50 font-medium">
          Date
        </th>
        <td v-for="day, index in days" :key="index" class="w-20 border-y border-r border-inherit text-center" :class="getDayColor(day.date)" :colspan="day.eventDays.length">
          {{ day.date.format('d') }}
        </td>
      </tr>
      <tr class="border-inherit">
        <th class="sticky left-0 z-10 border-x border-b-2 border-inherit bg-blue-50 font-medium">
          Day
        </th>
        <td v-for="day, index in days" :key="index" class="border-b-2 border-r border-inherit text-center" :class="getDayColor(day.date)" :colspan="day.eventDays.length">
          {{ day.date.format('E') }}
        </td>
      </tr>
      <tr class="border-inherit">
        <th class="sticky left-0 z-10 h-36 border-x border-b border-inherit bg-blue-50">
          <span class="rotate-180 text-nowrap text-xl [text-orientation:mixed] [writing-mode:vertical-rl]">Course</span>
        </th>
        <template v-for="day, index in days" :key="index">
          <td v-for="eventDay in day.eventDays" :key="eventDay.event.id" class="min-w-10 border-b border-r border-inherit text-center" :class="getDayColor(day.date)">
            <span class="rotate-180 text-nowrap [text-orientation:mixed] [writing-mode:vertical-rl]">
              <div>
                {{ eventDay.event.course.name }}
              </div>
              <div>
                {{ eventDay.event.customer.name }}
              </div>
            </span>
          </td>
          <td v-if="day.eventDays.length < 1" class="min-w-10 border-b border-r border-inherit text-center" :class="getDayColor(day.date)" />
        </template>
      </tr>
      <tr class="border-inherit">
        <th class="sticky left-0 z-10 border-x border-b-2 border-inherit bg-blue-50">
          <span class="text-nowrap px-1 text-xs">Student Numbers</span>
        </th>
        <template v-for="day, index in days" :key="index">
          <td v-for="eventDay in day.eventDays" :key="eventDay.event.id" class="text-nowrap border-b-2 border-r border-inherit px-0.5 text-center text-xs" :class="getDayColor(day.date)">
            {{ eventDay.event.student_numbers }}
          </td>
          <td v-if="day.eventDays.length < 1" class="min-w-10 border-b-2 border-r border-inherit text-center" :class="getDayColor(day.date)" />
        </template>
      </tr>
      <tr class="border-inherit">
        <th class="sticky left-0 z-10 border-x border-b-2 border-inherit bg-blue-50">
          <span class="text-nowrap px-1 text-xs">Vehicle Numbers</span>
        </th>
        <template v-for="day, index in days" :key="index">
          <td v-for="eventDay in day.eventDays" :key="eventDay.event.id" class="text-nowrap border-b-2 border-r border-inherit px-0.5 text-center text-xs" :class="getDayColor(day.date)">
            {{ eventDay.event.vehicle_numbers }}
          </td>
          <td v-if="day.eventDays.length < 1" class="min-w-10 border-b-2 border-r border-inherit text-center" :class="getDayColor(day.date)" />
        </template>
      </tr>
      <tr v-for="educator in educators" :key="educator.id" class="text-nowrap border-inherit text-center text-sm odd:bg-[#ddd9c3] even:bg-white">
        <th class="sticky left-0 z-10 border-x border-b border-inherit bg-inherit px-0.5">
          {{ educator.first_name }} {{ educator.last_name }}
        </th>
        <td v-for="day, index in days" :key="index" class="m-0 max-w-24 border-b border-r border-inherit" :colspan="day.eventDays.length" :class="{ 'bg-neutral-500 text-white': educatorIsAway(day, educator) }">
          <div v-for="(status, sidx) in getEducatorDayStatus(day, educator)" :key="sidx" class="px-0.5">
            {{ status }}
          </div>
        </td>
      </tr>
      <tr v-for="facility in facilities" :key="facility.id" class="text-nowrap border-inherit text-center text-sm">
        <th class="sticky left-0 z-10 border-x border-t border-inherit bg-blue-50">
          {{ facility.name }}
        </th>
        <td v-for="day, index in days" :key="index" class="m-0 max-w-24 border-r border-t border-inherit" :colspan="day.eventDays.length" :class="getDayColor(day.date)">
          <div v-for="facilityStatus, idx in getFacilityDayStatus(day, facility)" :key="idx" class="truncate px-0.5" :title="facilityStatus">
            {{ facilityStatus }}
          </div>
        </td>
      </tr>
      <tr class="border-inherit">
        <th class="sticky left-0 z-10 h-10 border-x border-t-2 border-inherit bg-blue-50">
          Accommodation
        </th>
        <td v-for="day, index in days" :key="index" class="border-r border-t-2 border-inherit text-center text-sm" :class="getDayColor(day.date)" :colspan="day.eventDays.length">
          <div v-for="accommodation in day.requiredAccommodation" :key="accommodation.id">
            {{ accommodation.name }}
          </div>
        </td>
      </tr>
      <tr class="border-inherit">
        <th class="sticky left-0 z-10 border-x border-t-2 border-inherit bg-blue-50 font-medium">
          Date
        </th>
        <td v-for="day, index in days" :key="index" class="border-r border-t-2 border-inherit text-center" :class="getDayColor(day.date)" :colspan="day.eventDays.length">
          {{ day.date.format('d') }}
        </td>
      </tr>
      <tr class="border-inherit">
        <th class="sticky left-0 z-10 border border-inherit bg-blue-50 font-medium">
          Day
        </th>
        <td v-for="day, index in days" :key="index" class="border-y border-r border-inherit text-center" :class="getDayColor(day.date)" :colspan="day.eventDays.length">
          {{ day.date.format('E') }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { addMonths, endOfMonth, format, formatISO, startOfMonth } from 'date-fns'
import { gql } from 'graphql-request'
import { CognitoTime } from '~cognito/models/Cognito/Time'
import { $axios } from '~cognito/plugins/axios'

const today = ref<CognitoTime>(new CognitoTime())
const month_offset = ref(0)

class RoadcraftPlannerDay {
  date: CognitoTime
  eventDays: {
    event: {
      id: number
      course: {
        name: string
      }
      customer: {
        name: string
      }
      student_numbers: string
      vehicle_numbers: string
    }
    eventDayEducators: {
      event_educator: {
        educator_id: number
      }
      assigned: number
      role: {
        name: string
      }
    }[]
    facilities: {
      id: number
      name: string
    }[]
  }[]

  staffUnavailable: {
    staff_id: number
  }[]

  requiredAccommodation: {
    id: number
    name: string
  }[]

  constructor(source?: Partial<RoadcraftPlannerDay>) {
    this.date = new CognitoTime()
    this.eventDays = []
    this.staffUnavailable = []
    this.requiredAccommodation = { id: 0, name: '' }

    Object.assign(this, source)
    if (source?.date) {
      this.date = new CognitoTime(source.date)
    }
  }
}

class RoadcraftFacility {
  id: number
  name: string
  constructor(source?: Partial<RoadcraftFacility>) {
    this.id = 0
    this.name = ''
    Object.assign(this, source)
  }
}

class RoadcraftPlannerEducator {
  id: number
  first_name: string
  last_name: string
  roadcraft_is_an_educator: boolean

  constructor(source?: Partial<RoadcraftPlannerEducator>) {
    this.id = 0
    this.first_name = ''
    this.last_name = ''
    this.roadcraft_is_an_educator = false

    Object.assign(this, source)
  }
}

const facilities = ref<RoadcraftFacility[]>([])
const days = ref<RoadcraftPlannerDay[]>([])
const educators = ref<RoadcraftPlannerEducator[]>([])

const educatorIsAway = (day: RoadcraftPlannerDay, educator: RoadcraftPlannerEducator) => {
  return day.staffUnavailable.find(e => e.staff_id == educator.id)
}

const getEducatorDayStatus = (day: RoadcraftPlannerDay, educator: RoadcraftPlannerEducator): string[] => {
  const unavailable = day.staffUnavailable.find(e => e.staff_id == educator.id)
  if (unavailable) {
    return ['AWAY']
  }
  const status = []
  for (let index = 0; index < day.eventDays.length; index++) {
    const eventDay = day.eventDays[index]
    const eventEducator = eventDay.eventDayEducators.find(e => e.event_educator.educator_id == educator.id)
    if (!eventEducator) {
      continue
    }
    if (!eventEducator.assigned) {
      continue
    }
    status.push(eventDay.event.course.name)
  }
  return status
}

const getFacilityDayStatus = (day: RoadcraftPlannerDay, facility: RoadcraftFacility) => {
  const facilityEvents = []
  for (let index = 0; index < day.eventDays.length; index++) {
    const eventDay = day.eventDays[index]
    const eventFacility = eventDay.facilities.find(e => e.id == facility.id)
    if (!eventFacility) {
      continue
    }
    facilityEvents.push(eventDay.event.course.name)
  }
  return facilityEvents
}

const getDayColor = (day: CognitoTime) => {
  if (day.isWeekend()) {
    return 'bg-success-50'
  }
  if (Number.parseInt(day.format('i')) % 2) {
    return 'bg-purple-200'
  }
  return 'bg-orange-100'
}

const getPlannerData = () => {
  $axios.graphql(gql`query roadcraftCalendarQuery($calendarStart: String!, $calendarEnd: String!){
    roadcraftFacilitys {
      id
      name
    }
    roadcraftMisc {
      calendar(from_date: $calendarStart, to_date: $calendarEnd) {
        date
        eventDays {
          event {
            id
            course {
              name
            }
            customer {
              name
            }
            student_numbers
            vehicle_numbers
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
          facilities {
            id
            name
          }
        }
        staffUnavailable {
          staff_id
        }
        requiredAccommodation {
          id
          name
        }
      }
    }
    cognitoUsers {
      id
      first_name
      last_name
      roadcraft_is_an_educator
    }
  }`, {
    calendarStart: formatISO(addMonths(startOfMonth(today.value.time), month_offset.value), { representation: 'date' }),
    calendarEnd: formatISO(endOfMonth(addMonths(today.value.time, month_offset.value)), { representation: 'date' }),
  }).then((data: any) => {
    facilities.value = data.roadcraftFacilitys
    days.value = data.roadcraftMisc.calendar.map(e => new RoadcraftPlannerDay(e))
    console.log(days.value)
    educators.value = data.cognitoUsers.map(e => new RoadcraftPlannerEducator(e))
      .filter(educator => educator.roadcraft_is_an_educator == true)
  })
}

watch(month_offset, () => {
  getPlannerData()
})

onMounted(() => {
  getPlannerData()
})
</script>
