import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import { Realtime, Types } from 'ably'

import { useAuthStore } from './auth'

interface Participant {
  clientId: String
  color: String
  isConnected: boolean
}

function getRandomColor(): string {
  let colors = ['amber', 'blue', 'cyan', 'green', 'indigo', 'lime', 'orange', 'red']
  return colors[Math.floor(Math.random() * colors.length)]
}

export const useRealtimeStore = defineStore('realtime', () => {
  const authUrl = `${import.meta.env.VITE_APP_API_URL}/ably-token`

  // this is for authenication with coginito
  const auth = useAuthStore()

  const ablyRealtimeClient = ref<Realtime>()
  const ablyClientId = ref<String>()

  const channelName = 'editor'
  const channel = ref<Types.RealtimeChannelCallbacks>()

  const color = ref(getRandomColor())
  const participants = ref(new Map<String, Participant>())

  function addParticipant(participant: Participant) {
    participants.value.set(participant.clientId, participant)
  }

  function removeParticipant(clientId: String) {
    participants.value.delete(clientId)
  }

  function participantLeft(clientId: String) {
    const participant = participants.value.get(clientId)
    participants.value.set(clientId, { ...participant, ...{ isConnected: false } })
  }

  function _connected(realtime: Realtime) {
    ablyClientId.value = realtime.auth.clientId
    ablyRealtimeClient.value = realtime

    // TODO: Get separate channel per noteId
    // creates new channel or returns existing channel
    channel.value = realtime.channels.get(channelName, {
      // params: { rewind: '2m' }
    })
  }

  function _disconnected() {
    console.debug('ably disconnected')
    ablyClientId.value = undefined
    channel.value = undefined
  }

  async function initializeAbly() {
    if (!ablyClientId.value && auth.jwt) {
      const clientOptions: Types.ClientOptions = {
        authUrl,
        authMethod: 'POST',
        authHeaders: { Authorization: `Bearer ${auth.jwt}` }
        // log: { level: 4 }
      }

      const realtime = new Realtime(clientOptions)

      realtime.connection.on('connected', () => _connected(realtime))

      realtime.connection.on('disconnected', () => _disconnected())
    }
  }

  function disconnectAbly() {
    ablyRealtimeClient.value.connection.close()
  }

  function setupPresence() {
    // presence enter
    channel.value.presence.subscribe(
      ['enter', 'present', 'update'],
      (msg: Types.PresenceMessage) => {
        if (msg.clientId !== ablyClientId.value) {
          const participant: Participant = {
            clientId: msg.clientId,
            color: msg.data.color,
            isConnected: true
          }
          addParticipant(participant)
        }
      }
    )

    channel.value.presence.subscribe('leave', (msg: Types.PresenceMessage) => {
      if (msg.clientId !== ablyClientId.value) {
        participantLeft(msg.clientId)
      }
    })
  }

  watch(channel, (channelValue) => {
    // setup presence immediately after channel is ready
    if (channelValue) {
      setupPresence()
    }
  })

  // initializeAbly when store in initialized
  initializeAbly()

  return {
    ablyClientId,
    addParticipant,
    channel,
    participants,
    color,
    disconnectAbly,
    initializeAbly,
    removeParticipant,
    participantLeft
  }
})
