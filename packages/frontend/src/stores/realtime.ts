import { defineStore } from 'pinia'
import { ref } from 'vue'

import { Realtime, Types } from 'ably'

export const useRealtimeStore = defineStore('realtime', () => {
  const authUrl = ref(`${import.meta.env.VITE_APP_API_URL}/ably-token`)

  const isConnected = ref(false)
  const ablyRealtimeClient = ref<Realtime>(null)
  const ablyClientId = ref('noclientid')

  const channelName = 'editor'
  const channel = ref(null)

  const isChannelAttached = ref(false)

  function attachAblyChannel() {
    channel.value = ablyRealtimeClient.value.channels.get(channelName, {
      // params: { rewind: '2m' }
    })
    isChannelAttached.value = true
  }

  async function initializeAbly() {
    if (!isConnected.value) {
      const clientOptions: Types.ClientOptions = {
        authUrl: authUrl.value,
        authMethod: 'POST'
        // log: { level: 4 }
      }

      const realtime = new Realtime(clientOptions)

      realtime.connection.on('connected', () => {
        isConnected.value = true
        ablyClientId.value = realtime.auth.clientId
        ablyRealtimeClient.value = realtime

        attachAblyChannel()
      })

      realtime.connection.on('disconnected', () => {
        isConnected.value = false
        isChannelAttached.value = false
      })
    }
  }

  function disconnectAbly() {
    ablyRealtimeClient.value.connection.close()
    isConnected.value = false
    isChannelAttached.value = false
  }

  return {
    channel,
    initializeAbly,
    isConnected,
    isChannelAttached,
    ablyClientId,
    disconnectAbly
  }
})
