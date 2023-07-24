<template>
  <main class="px-2">

    <!-- Connection indicator -->
    <span
      class="flex w-2 h-2 rounded-full"
      :class="isConnected ? 'bg-green-500' : 'bg-red-500'"
    ></span>

    <AvatarStacks />

    <div v-if="isLoading" class="text-center">
      <LoadingIndicator />
    </div>
    <div v-else class="my-2">
      <QuillEditor
        ref="editor"
        content-type="delta"
        @textChange="handleTextChange"
        @selectionChange="handleSelectionChange"
        @ready="handleReady"
        :options="options"
        :modules="modules"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { QuillEditor, Delta, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import QuillCursors from 'quill-cursors'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Types, Realtime } from 'ably'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import AvatarStacks from '@/components/AvatarStacks.vue'

import { useRealtimeStore } from '@/stores/realtime'

// console.log('register quill')
// Quill.register('modules/cursor', QuillCursors)

// The ref=editor in QuillEditor works like magic!
const editor = ref(null)
const quill = ref<Quill>(null)
const cursorModule = ref(null)

const store = useRealtimeStore()
const channel = computed(() => store.channel)

const isConnected = computed(() => store.isConnected && store.isChannelAttached)
const isLoading = computed(() => !isConnected)

const options = {
  placeholder: 'Start collaborating! :tada:',
  theme: 'snow',
  readOnly: !isConnected,
  modules: {
    toolbar: true,
    cursors: true
  }
}

const modules = {
  name: 'cursors',
  module: QuillCursors
}

// add/remove as participants change
const participants = computed(() => store.participants.values())
watch(participants, (newParticipant) => {
  // console.log('participants updated')
  // console.log(participants)
  // console.log(newParticipant)
  if (cursorModule.value) {
    for (let [key, value] of store.participants) {
      const { clientId, color } = value
      console.log('create cursor', clientId)
      cursorModule.value.createCursor(clientId, clientId, color)
    }
  }
})

// watch(participants, (newParticipant) => {
//   console.log('participants changed', participants.value)
//   console.log(newParticipant.next())
//   if (cursorModule.value) {
//     participants.forEach((participant) => {
//       console.log(participant)
//       const { color, range } = participant
//       cursorModule.value.createCursor(clientId, clientId, color)
//       if (range) {
//         cursorsModule.moveCursor(clientId, range)
//       }
//       //             result.push(participant)
//     })
//   }
// })
// computed(() => {
//     const result = []
//     if (store.participants.value) {
//         store.participants.value.forEach((participant, clientId) => {
//             console.log(clientId, participant)
//             result.push(participant)
//         })
//     }
//     return result
// })

interface TextChange {
  delta: Delta
  oldContents: Delta
  source: Sources
}

// TODO set the content of editor with content saved in database
function handleReady() {
  quill.value = editor.value.getQuill()

  cursorModule.value = quill.value.getModule('cursors')
  cursorModule.value.clearCursors()
  cursorModule.value.createCursor('one', 'one', 'red')
}

function handleTextChange(change: TextChange) {
  // only publish changes made by the user
  if (change.source == 'user' && channel.value) {
    channel.value.publish('delta', change.delta)
  }
}

/*
 * selection-change event is triggered when cursor is moved using arrow keys or mouse
 */
function handleSelectionChange({ range, oldRange, source }) {
  if (range && source == 'user') {
    const data = { color: store.color, range }
    channel.value.presence.update(data)
  }
}

// Subscribe to channel only after channel is attached
watch(isConnected, () => {
  if (isConnected) {
    channel.value.subscribe('delta', (message: Types.Message) => {
      if (message.clientId !== store.ablyClientId) {
        quill.value.updateContents(message.data)
      }
    })

    // setup presence immediately after connection
    store.setupPresence()
  }
})

onMounted(() => {
  store.initializeAbly()

  window.addEventListener('beforeunload', (event) => {
    // on the navigation type checking refresh or close tab/browser for logout
    if (performance.navigation.type != 1) {
      store.disconnectAbly() // gracefully disconnect before closing window
    }

    return false
  })
})

onUnmounted(() => {
  store.disconnectAbly()
})

/* References
   https://quilljs.com/docs/api/#events
   https://github.com/vueup/vue-quill/issues/188
*/
</script>
