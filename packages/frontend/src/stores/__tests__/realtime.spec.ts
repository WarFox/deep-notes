import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRealtimeStore } from '../realtime'
import { Realtime } from 'ably'

vi.mock('ably', () => {
  const Realtime = vi.fn()
  Realtime.prototype.connect = vi.fn()
  Realtime.prototype.query = vi.fn()
  Realtime.prototype.end = vi.fn()
  Realtime.prototype.connection = vi.fn()
  Realtime.prototype.connection.on = vi.fn()
  Realtime.prototype.connection.close = vi.fn()

  Realtime.prototype.connection.on.mockResolvedValueOnce()

  return { Realtime }
})

describe('Realtime Store', () => {
  let realtime
  let store

  afterEach(() => {
    vi.clearAllMocks()
  })

  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())

    realtime = new Realtime({})

    store = useRealtimeStore()
  })

  it('initializeAbly', () => {
    store.initializeAbly()
    expect(realtime.connection.on).toBeCalledTimes(2)
  })

  // TODO: Add more tests, Ably.Realtime is hard to mock
})
