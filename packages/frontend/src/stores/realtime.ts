import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { ulid } from 'ulid'

import { Realtime, Types } from 'ably'

// import { useAuthStore } from './auth'

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
  // const auth = useAuthStore()

  const realtimeClient = ref<Realtime>()
  const clientId = ref<String>(ulid())

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

  function _disconnected() {
    console.debug('ably disconnected')
    clientId.value = undefined
    channel.value = undefined
  }

  function initializeAbly() {
    if (!clientId.value) {
      const clientOptions: Types.ClientOptions = {
        key: 'cNU_dA.XmF1pg:DCTXe1BlQuQBN_WgbaHDeV8A9Yo_yt90qI55MUN4HaQ',
        clientId: clientId.value
        // authUrl,
        // authMethod: 'POST',
        // authHeaders: { Authorization: `Bearer ${auth.jwt}` }
        // log: { level: 4 }
      }

      const realtime = new Realtime(clientOptions)

      realtime.connection.on('connected', () => {
        console.log('realtime connected')
        clientId.value = realtime.auth.clientId
        realtimeClient.value = realtime

        // TODO: Get separate channel per noteId
        // creates new channel or returns existing channel
        channel.value = realtimeClient.value.channels.get(channelName)

        setupPresence()
      })

      realtime.connection.on('disconnected', () => _disconnected())
    }
  }

  function disconnectAbly() {
    console.log('ably disconnected')
    realtimeClient.value.connection.close()
  }

  function getChannel() {
    return realtimeClient.value.channels.get(channelName)
  }

  function setupPresence() {
    console.log('setup presense')
    // presence enter
    getChannel().presence.enter({
      clientId: clientId.value,
      color: color.value,
      isConnected: true
    })

    getChannel().presence.subscribe(['enter', 'present'], (msg: Types.PresenceMessage) => {
      if (msg.clientId !== clientId.value) {
        const participant: Participant = {
          clientId: msg.clientId,
          color: msg.data.color,
          isConnected: true
        }
        addParticipant(participant)
      }
    })

    getChannel().presence.subscribe(['update'], (msg: Types.PresenceMessage) => {
      if (msg.clientId !== clientId.value) {
        // update cursor
        console.log('update presense/cursor ', msg.clientId)
      }
    })

    getChannel().presence.subscribe('leave', (msg: Types.PresenceMessage) => {
      if (msg.clientId !== clientId.value) {
        participantLeft(msg.clientId)
      }
    })
  }

  // initializeAbly when store in initialized
  initializeAbly()

  return {
    clientId,
    addParticipant,
    channel,
    getChannel,
    participants,
    color,
    disconnectAbly,
    removeParticipant,
    realtimeClient,
    participantLeft
  }
})
