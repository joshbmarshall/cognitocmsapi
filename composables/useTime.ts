/**
 * Day JS wrapper that synchronises with the servers time
 */

import type { UseNowOptions } from '@vueuse/core'
import dayjs from 'dayjs'
import { config } from '~/config'

const timeOffset = ref(0)

export function useTime(date?: dayjs.ConfigType | null, format?: dayjs.OptionType, strict?: boolean): dayjs.Dayjs {
  if (date !== undefined && date !== null) {
    return dayjs(date, format, strict)
  }
  return dayjs().add(timeOffset.value, 'millisecond')
}

export function useTimeNow(options: UseNowOptions<false>): ComputedRef<dayjs.Dayjs> {
  const nowUnsynced = useNow(options)
  const currentTime = computed(() => dayjs(nowUnsynced.value).add(timeOffset.value, 'millisecond'))
  return currentTime
}

export function setTimeOffset(offset: number) {
  timeOffset.value = offset
  return timeOffset.value
}

export async function synchroniseTime() {
  const { data } = await useFetch<{ diff?: number }>(`${config.baseURL}/api/v1/cognito/user/timeDiff?mytime=${Date.now()}`)
  setTimeOffset(data.value?.diff || 0)
}
