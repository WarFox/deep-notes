import { defineStore } from 'pinia'
import { ref } from 'vue'

import { Realtime, Types } from 'ably'

interface Participant {
  clientId: String
  color: String
}

function getRandomColor(): string {
  let colors = ['red', 'green', 'blue', 'orange', 'pink', 'purple']
  return colors[Math.floor(Math.random() * colors.length)]
}

export const useRealtimeStore = defineStore('realtime', () => {
  const authUrl = ref(`${import.meta.env.VITE_APP_API_URL}/ably-token`)

  const isConnected = ref(false)
  const ablyRealtimeClient = ref<Realtime>()
  const ablyClientId = ref('noclientid')

  const channelName = 'editor'
  const channel = ref()

  const isChannelAttached = ref(false)

  const color = ref(getRandomColor())
  const participants = ref(new Map<String, Participant>())

  function addParticipant(participant: Participant) {
    participants.value.set(participant.clientId, participant)
  }

  function removeParticipant(clientId: String) {
    participants.value.delete(clientId)
  }

  function _connected(realtime: Realtime) {
    isConnected.value = true
    ablyClientId.value = realtime.auth.clientId
    ablyRealtimeClient.value = realtime

    // attach channel
    channel.value = realtime.channels.get(channelName, {
      // params: { rewind: '2m' }
    })
    isChannelAttached.value = true
  }

  function _disconnected() {
    isConnected.value = false
    isChannelAttached.value = false
  }

  async function initializeAbly() {
    if (!isConnected.value) {
      const clientOptions: Types.ClientOptions = {
        authUrl: authUrl.value,
        authMethod: 'POST'
        // log: { level: 4 }
      }

      const realtime = new Realtime(clientOptions)

      realtime.connection.on('connected', () => _connected(realtime))

      realtime.connection.on('disconnected', () => _disconnected())
    }
  }

  function disconnectAbly() {
    ablyRealtimeClient.value.connection.close()
    isConnected.value = false
    isChannelAttached.value = false
  }

  function setupPresence() {
    // presence enter
    channel.value.presence.subscribe(
      ['enter', 'present', 'update'],
      (msg: Types.PresenceMessage) => {
        if (msg.clientId !== ablyClientId.value) {
          const participant: Participant = {
            clientId: msg.clientId,
            color: msg.data.color
          }
          addParticipant(participant)
        }
      }
    )

    channel.value.presence.subscribe('leave', (msg: Types.PresenceMessage) => {
      if (msg.clientId !== ablyClientId.value) {
        participants.value.delete(msg.clientId)
      }
    })
  }

  return {
    ablyClientId,
    addParticipant,
    channel,
    participants,
    color,
    disconnectAbly,
    initializeAbly,
    isChannelAttached,
    isConnected,
    removeParticipant,
    setupPresence
  }
})
