// Fixed width set for viewport-sized image requests. Rounding up to one of
// these keeps the render cache shared across visitors instead of one file per
// distinct viewport width.
export const LAZY_WIDTHS = [320, 480, 720, 1080, 1620, 2430, 3840]

/**
 * Round a requested device-pixel width up to the next value in LAZY_WIDTHS,
 * clamped to the largest value.
 */
export function snapWidth(requested: number): number {
  for (const width of LAZY_WIDTHS) {
    if (requested <= width) {
      return width
    }
  }
  return LAZY_WIDTHS[LAZY_WIDTHS.length - 1]
}

export interface SizedImageInput {
  url: string
  clientWidth: number
  clientHeight: number
  devicePixelRatio: number
  imageWidth?: number
  imageHeight?: number
}

/**
 * Build the sized `widthxheight:filename` url for a lazy image.
 *
 * The device pixel ratio is capped at 2, the requested width is snapped up to
 * LAZY_WIDTHS, and the height keeps the element's aspect so the server treats
 * width and height as a target box and does not letterbox. When the source
 * image is a different shape to the rendered element (cropped on-screen), the
 * request is widened to the source ratio and the corrected width is snapped
 * again. Returns null when the element is not laid out yet.
 */
export function computeSizedUrl(input: SizedImageInput): string | null {
  const { url, clientWidth, clientHeight, devicePixelRatio } = input

  if (clientWidth <= 0 || clientHeight <= 0) {
    return null
  }

  const filename = url.split('/').pop()
  if (!filename) {
    return null
  }

  const dpr = Math.min(devicePixelRatio || 1, 2)
  let width = snapWidth(Math.ceil(clientWidth * dpr))
  let height = Math.round(width * clientHeight / clientWidth)

  // Keep ratio for images that are cropped on-screen by hiding portions of the
  // image, ie square thumbnails
  if (input.imageWidth && input.imageHeight) {
    const ratio = input.imageWidth / input.imageHeight
    const checkWidth = Math.abs(Math.floor(input.imageHeight * width / height) - input.imageWidth)

    if (checkWidth > 1) {
      // Is definitely a different shape
      if (width / height > ratio) {
        height = Math.ceil(width / ratio)
      } else {
        width = Math.ceil(height * ratio)
      }
    }
  }

  // Snap the (possibly crop-corrected) width up to the set, scaling the height
  // so the crop behaviour is preserved.
  const snapped = snapWidth(width)
  if (snapped !== width) {
    height = Math.round(height * snapped / width)
    width = snapped
  }

  return `${url.slice(0, url.length - filename.length)}${width}x${height}:${filename}`
}
