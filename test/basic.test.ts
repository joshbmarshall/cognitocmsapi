import { describe, expect, it } from 'vitest'

describe('tests', () => {
  it('should works', () => {
    expect(1 + 1).toEqual(2)
  })
})

describe('composable Counter', () => {
  it('counts up', () => {
    const counter = useTestCounter()
    expect(counter.count.value).toEqual(0)
    counter.increment()
    expect(counter.count.value).toEqual(1)
  })
  it('counts down', () => {
    const counter = useTestCounter()
    expect(counter.count.value).toEqual(0)
    counter.decrement()
    expect(counter.count.value).toEqual(-1)
  })
})
