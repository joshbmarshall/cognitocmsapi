import { config } from '~/config'

export function useImageUrl() {
  const getUrl = (image_hash: string, width: number, aspect: string, extension: string = 'jpg') => {
    return `${config.baseURL}/assets/i/${image_hash}/${aspect}/${width}.${extension}`
  }

  return { getUrl }
}
