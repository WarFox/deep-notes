import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRealtimeStore, Participant } from '../realtime'
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

vi.mock('../../lib/auth', () => {
  return { getAccessTokenJwt: vi.fn() }
})

describe('Realtime Store', () => {
  let realtime: Realtime = undefined
  let store = undefined

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

  it('initial values', () => {
    expect(store.participants).toHaveLength(0)
    expect(store.isConnected).toBe(false)
    expect(store.ablyClientId).toBe('noclientid')
  })

  it('initializeAbly', () => {
    store.initializeAbly()

    expect(store.participants).toHaveLength(0)
    expect(realtime.connection.on).toHaveBeenCalledTimes(2)
  })

  it('addParticipant', () => {
    expect(store.participants).toHaveLength(0)
    const participant: Participant = { clientId: 'someid', color: 'some color' }
    store.addParticipant(participant)
    expect(store.participants).toHaveLength(1)
    expect(store.participants.get('someid')).toEqual(participant)
  })

  it('removeParticipant', () => {
    expect(store.participants).toHaveLength(0)
    const p1: Participant = { clientId: 'someid', color: 'color1' }
    const p2: Participant = { clientId: 'someid2', color: 'color2' }
    store.participants.set(p1.clientId, p1)
    store.participants.set(p2.clientId, p1)
    expect(store.participants).toHaveLength(2)

    store.removeParticipant('someid')
    expect(store.participants).toHaveLength(1)
    store.removeParticipant('someid2')
    expect(store.participants).toHaveLength(0)
  })

  it('participantLeft', () => {
    const p1: Participant = { clientId: 'someid', color: 'color1', isConnected: true }
    const p2: Participant = { clientId: 'someid2', color: 'color2', isConnected: true }
    store.participants.set(p1.clientId, p1)
    store.participants.set(p2.clientId, p1)

    store.participantLeft('someid')

    expect(store.participants.get('someid').isConnected).toBe(false)
  })

  // TODO: Add more tests, Ably.Realtime is hard to mock
})
