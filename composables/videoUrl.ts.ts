import { config } from '~/config'

export function useVideoUrl() {
  const getUrl = (id: string, extension: string = 'mp4') => {
    return `${config.baseURL}/v/${id}.${extension}`
  }

  return { getUrl }
}
