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
  <div v-if="is_draft" class="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div class="-rotate-45 text-9xl text-black/30">
      DRAFT
    </div>
  </div>
  <div class="overflow-x-scroll">
    <table class="border-separate border-spacing-0 border-black">
      <tbody>
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
            <td v-for="eventDay in day.eventDays" :key="eventDay.event.id" class="min-w-12 border-b border-r border-inherit text-center" :class="getDayColor(day.date)">
              <span class="rotate-180 text-nowrap leading-tight [text-orientation:mixed] [writing-mode:vertical-rl]">
                <div :class="getStatusColor(eventDay.event.status)">
                  {{ eventDay.event.course.name }}
                  <span v-if="eventDay.am_only" class="font-bold">AM</span>
                  <span v-if="eventDay.pm_only" class="font-bold">PM</span>
                  <span v-if="eventDay.event.number_of_days > 1">D{{ eventDay.day_number }}</span>
                  <span v-if="eventDay.start_time && false"> ({{ eventDay.start_time }} - {{ eventDay.end_time }})</span>
                </div>
                <div>
                  {{ eventDay.event.customer?.name }}
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
              <div :class="status.class">
                {{ status.text }}
              </div>
            </div>
          </td>
        </tr>
        <tr v-for="facility in facilities" :key="facility.id" class="text-nowrap border-inherit text-center text-sm">
          <th class="sticky left-0 z-10 border-x border-t border-inherit bg-blue-50">
            {{ facility.name }}
          </th>
          <td v-for="day, index in days" :key="index" class="m-0 max-w-24 border-r border-t border-inherit" :colspan="day.eventDays.length" :class="getDayColor(day.date)">
            <div v-for="status, idx in getFacilityDayStatus(day, facility)" :key="idx" class="truncate px-0.5" :title="status.text">
              <div :class="status.class">
                {{ status.text }}
              </div>
            </div>
          </td>
        </tr>
        <tr class="border-inherit">
          <th class="sticky left-0 z-10 h-10 border-x border-t-2 border-inherit bg-blue-50">
            Accommodation
          </th>
          <td v-for="day, index in days" :key="index" class="border-r border-t-2 border-inherit text-center text-sm" :class="getDayColor(day.date)" :colspan="day.eventDays.length">
            <div v-for="accommodation in day.requiredAccommodation" :key="accommodation.accommodation.id">
              {{ accommodation.accommodation.name }}
              ({{ accommodation.residents.join(', ') }})
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
      </tbody>
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
        roster_name: string
      }
      customer: {
        name: string
      }
      status: string
      student_numbers: string
      vehicle_numbers: string
      number_of_days: number
    }
    eventDayEducators: {
      event_educator: {
        educator_id: number
      }
      assigned: number
      role: {
        name: string
        short_name: string
      }
    }[]
    facilities: {
      id: number
      name: string
    }[]
    start_time: string
    end_time: string
    am_only: boolean
    pm_only: boolean
    day_number: number
  }[]

  staffUnavailable: {
    staff_id: number
    from: string
    to: string
  }[]

  staffTravelling: {
    staff_id: number
    note: string
  }[]

  requiredAccommodation: {
    accommodation: {
      id: number
      name: string
    }
    residents: string[]
  }[]

  constructor(source?: Partial<RoadcraftPlannerDay>) {
    this.date = new CognitoTime()
    this.eventDays = []
    this.staffUnavailable = []
    this.staffTravelling = []
    this.requiredAccommodation = []

    Object.assign(this, source)
    if (source?.date) {
      this.date = new CognitoTime(source.date)
    }
    if (source?.eventDays) {
      this.eventDays = source.eventDays.map((e) => {
        const obj = JSON.parse(JSON.stringify(e))
        if (obj.start_time) {
          obj.start_time = new CognitoTime(`2000-01-01 ${e.start_time}`).toHumanTimeString()
        }
        if (obj.end_time) {
          obj.end_time = new CognitoTime(`2000-01-01 ${e.end_time}`).toHumanTimeString()
        }
        return obj
      })
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

  constructor(source?: Partial<RoadcraftPlannerEducator>) {
    this.id = 0
    this.first_name = ''
    this.last_name = ''

    Object.assign(this, source)
  }
}

class RoadcraftCellColouredText {
  class: string
  text: string
  constructor(source?: Partial<RoadcraftCellColouredText>) {
    this.class = 'text-black'
    this.text = ''
    Object.assign(this, source)
  }
}

const facilities = ref<RoadcraftFacility[]>([])
const days = ref<RoadcraftPlannerDay[]>([])
const educators = ref<RoadcraftPlannerEducator[]>([])

const educatorIsAway = (day: RoadcraftPlannerDay, educator: RoadcraftPlannerEducator) => {
  return day.staffUnavailable.find(e => e.staff_id == educator.id)
}

const getStatusColor = (status: string) => {
  if (status == 'Confirmed') {
    return 'text-black'
  }
  return 'text-red-500'
}

const getEducatorDayStatus = (day: RoadcraftPlannerDay, educator: RoadcraftPlannerEducator): RoadcraftCellColouredText[] => {
  const unavailable = day.staffUnavailable.find(e => e.staff_id == educator.id)
  if (unavailable) {
    // Check is if AM
    const noon = day.date.addMinutes(12 * 60)
    const unavailable_to = new CognitoTime(unavailable.to)
    const unavailable_from = new CognitoTime(unavailable.from)
    if (unavailable_to.isBefore(noon.addMinutes(1))) {
      return [new RoadcraftCellColouredText({ text: 'AWAY AM' })]
    }
    // Check is if PM
    if (unavailable_from.isAfter(noon.subMinutes(1))) {
      return [new RoadcraftCellColouredText({ text: 'AWAY PM' })]
    }

    return [new RoadcraftCellColouredText({ text: 'AWAY' })]
  }
  const status = []
  for (let index = 0; index < day.eventDays.length; index++) {
    const eventDay = day.eventDays[index]
    const eventDayEducator = eventDay.eventDayEducators.find(e => e.event_educator.educator_id == educator.id)
    if (!eventDayEducator) {
      continue
    }
    if (!eventDayEducator.assigned) {
      continue
    }
    let thisstatus = eventDay.event.course.roster_name || eventDay.event.course.name
    if (eventDayEducator.role?.short_name) {
      thisstatus += `-${eventDayEducator.role?.short_name}`
    }
    status.push(new RoadcraftCellColouredText({
      text: thisstatus,
      class: getStatusColor(eventDay.event.status),
    }))
  }
  const travelling = day.staffTravelling.find(e => e.staff_id == educator.id)
  if (travelling) {
    status.push(new RoadcraftCellColouredText({ text: travelling.note }))
  }
  return status
}

const getFacilityDayStatus = (day: RoadcraftPlannerDay, facility: RoadcraftFacility): RoadcraftCellColouredText[] => {
  const facilityEvents = []
  for (let index = 0; index < day.eventDays.length; index++) {
    const eventDay = day.eventDays[index]
    const eventFacility = eventDay.facilities.find(e => e.id == facility.id)
    if (!eventFacility) {
      continue
    }
    facilityEvents.push(new RoadcraftCellColouredText({
      text: eventDay.event.course.roster_name || eventDay.event.course.name,
      class: getStatusColor(eventDay.event.status),
    }))
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

const is_draft = ref(false)

const getPlannerData = () => {
  $axios.graphql(gql`query roadcraftCalendarQuery($calendarStart: String!, $calendarEnd: String!){
    roadcraftFacilitys {
      id
      name
    }
    roadcraftMisc {
      is_draft_roster(date: $calendarStart)
      calendar(from_date: $calendarStart, to_date: $calendarEnd) {
        date
        eventDays(hide_hidden_from_roster: true) {
          event {
            id
            course {
              name
              roster_name
            }
            customer {
              name
            }
            status
            student_numbers
            vehicle_numbers
            number_of_days
          }
          eventDayEducators {
            event_educator {
              educator_id
            }
            assigned
            role {
              name
              short_name
            }
          }
          facilities {
            id
            name
          }
          am_only
          pm_only
          day_number
          start_time
          end_time
        }
        staffUnavailable {
          staff_id
          from
          to
        }
        staffTravelling {
          staff_id
          note
        }
        requiredAccommodation {
          accommodation {
            id
            name
          }
          residents
        }
      }
      educators {
        id
        first_name
        last_name
      }
    }
  }`, {
    calendarStart: formatISO(addMonths(startOfMonth(today.value.time), month_offset.value), { representation: 'date' }),
    calendarEnd: formatISO(endOfMonth(addMonths(today.value.time, month_offset.value)), { representation: 'date' }),
  }).then((data: any) => {
    is_draft.value = data.roadcraftMisc.is_draft_roster
    facilities.value = data.roadcraftFacilitys
    days.value = data.roadcraftMisc.calendar.map(e => new RoadcraftPlannerDay(e))
    educators.value = data.roadcraftMisc.educators.map(e => new RoadcraftPlannerEducator(e))
  })
}

watch(month_offset, () => {
  getPlannerData()
})

onMounted(() => {
  getPlannerData()
})
</script>
