import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import LazyImage from '../Components/LazyImage.vue'

// onMounted awaits webp detection, whose Image().onload never fires in jsdom.
vi.mock('../stores/webp', () => ({
  useWebpStore: () => ({ isSupported: () => Promise.resolve(false) }),
}))

// jsdom has no IntersectionObserver, so drive visibility from a controllable
// ref: tests flip it to simulate an element entering the viewport.
const visible = ref(true)
vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>()
  return {
    ...actual,
    useElementVisibility: () => visible,
  }
})

// jsdom does not lay elements out, so clientWidth/clientHeight are stubbed per
// test. Image.prototype.decode is not implemented and must be stubbed too.
beforeEach(() => {
  setActivePinia(createPinia())
  vi.restoreAllMocks()
  visible.value = true
  window.HTMLImageElement.prototype.decode = () => Promise.resolve()
})

function mountLazy(props: Record<string, unknown> = {}) {
  return mount(LazyImage, {
    props: {
      url: 'https://example.test/assets/img/a/b/c/rest/photo.jpg',
      ...props,
    },
    attachTo: document.body,
  })
}

function sizeElement(wrapper: ReturnType<typeof mount>, width: number, height: number, dpr = 1) {
  const el = wrapper.element as HTMLImageElement
  Object.defineProperty(el, 'clientWidth', { value: width, configurable: true })
  Object.defineProperty(el, 'clientHeight', { value: height, configurable: true })
  el.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height,
  })
  Object.defineProperty(window, 'devicePixelRatio', { value: dpr, configurable: true })
  return el
}

async function flush() {
  await new Promise(resolve => setTimeout(resolve, 0))
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('lazyImage single download', () => {
  it('loads only the sized file, never the template-size file', async () => {
    const wrapper = mountLazy()
    const el = sizeElement(wrapper, 500, 300, 2)

    await flush()

    const src = el.getAttribute('src')
    expect(src).toMatch(/\d+x\d+:photo\.jpg$/)
    expect(src).not.toBe('https://example.test/assets/img/a/b/c/rest/photo.jpg')
    expect(el.getAttribute('src')).toContain('/1080x648:')
  })

  it('does not fetch while the element has no width, then fetches when revealed', async () => {
    const wrapper = mountLazy()
    const el = sizeElement(wrapper, 0, 0)

    await flush()
    expect(el.getAttribute('src')).not.toMatch(/photo\.jpg/)

    // Element is revealed and now has a width
    sizeElement(wrapper, 500, 300, 2)
    visible.value = false
    await flush()
    visible.value = true
    await flush()
    expect(el.getAttribute('src')).toContain('/1080x648:')
  })

  it('does not fetch while out of the viewport', async () => {
    visible.value = false
    const wrapper = mountLazy()
    const el = sizeElement(wrapper, 500, 300, 2)

    await flush()
    expect(el.getAttribute('src')).not.toMatch(/photo\.jpg/)

    visible.value = true
    await flush()
    expect(el.getAttribute('src')).toContain('/1080x648:')
  })
})
