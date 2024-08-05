import { config } from '~/config'

export function useImageUrl() {
  const getUrl = (image_hash: string, field: string, width: number, aspect: string, extension: string = 'jpg') => {
    return `${config.baseURL}/assets/i/${image_hash}/${field}/${aspect}/${width}.${extension}`
  }

  return { getUrl }
}
