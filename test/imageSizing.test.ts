import { describe, expect, it } from 'vitest'
import { LAZY_WIDTHS, computeSizedUrl, snapWidth } from '../composables/imageSizing'

const URL = 'https://example.test/assets/img/a/b/c/rest/photo.jpg'

function sized(input: Partial<Parameters<typeof computeSizedUrl>[0]> = {}) {
  return computeSizedUrl({
    url: URL,
    clientWidth: 500,
    clientHeight: 300,
    devicePixelRatio: 1,
    ...input,
  })
}

function widthOf(url: string | null) {
  const match = url?.match(/\/(\d+)x(\d+):/)
  return match ? Number(match[1]) : null
}

function heightOf(url: string | null) {
  const match = url?.match(/\/(\d+)x(\d+):/)
  return match ? Number(match[2]) : null
}

describe('snapWidth', () => {
  it('rounds up to the next value in the set', () => {
    expect(snapWidth(1)).toBe(320)
    expect(snapWidth(320)).toBe(320)
    expect(snapWidth(321)).toBe(480)
    expect(snapWidth(1000)).toBe(1080)
  })

  it('clamps above the largest value', () => {
    expect(snapWidth(5000)).toBe(3840)
  })
})

describe('computeSizedUrl', () => {
  it('returns null when the element has no width', () => {
    expect(sized({ clientWidth: 0 })).toBeNull()
  })

  it('does not request the template-size file', () => {
    expect(sized()).not.toBe(URL)
    expect(sized()).toMatch(/\d+x\d+:photo\.jpg$/)
  })

  it('snaps 500 CSS px on a DPR-2 screen to 1080', () => {
    expect(widthOf(sized({ clientWidth: 500, clientHeight: 300, devicePixelRatio: 2 }))).toBe(1080)
  })

  it('always requests a width from the fixed set', () => {
    for (const clientWidth of [120, 340, 700, 1000, 1500, 4000]) {
      expect(LAZY_WIDTHS).toContain(widthOf(sized({ clientWidth, clientHeight: 300, devicePixelRatio: 2 })))
    }
  })

  it('caps the effective DPR at 2', () => {
    const atDpr3 = widthOf(sized({ clientWidth: 500, clientHeight: 300, devicePixelRatio: 3 }))
    const atDpr2 = widthOf(sized({ clientWidth: 500, clientHeight: 300, devicePixelRatio: 2 }))
    expect(atDpr3).toBe(atDpr2)
  })

  it('preserves the element aspect ratio in the requested height', () => {
    const url = sized({ clientWidth: 500, clientHeight: 300, devicePixelRatio: 2 })
    expect(heightOf(url)).toBe(Math.round(widthOf(url)! * 300 / 500))
  })

  it('snaps the crop-corrected width up to the set', () => {
    // Square on-screen element, 4:3 source: the correction widens the request
    // to 4:3, then the width is snapped to the next bucket.
    const url = sized({
      clientWidth: 300,
      clientHeight: 300,
      devicePixelRatio: 1,
      imageWidth: 4000,
      imageHeight: 3000,
    })
    expect(widthOf(url)).toBe(480)
    expect(heightOf(url)).toBe(360)
  })

  it('keeps the source ratio after the crop correction', () => {
    const url = sized({
      clientWidth: 300,
      clientHeight: 300,
      devicePixelRatio: 2,
      imageWidth: 4000,
      imageHeight: 3000,
    })
    expect(widthOf(url)! / heightOf(url)!).toBeCloseTo(4 / 3, 2)
  })
})
