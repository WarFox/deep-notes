<template>
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
    />
  </div>
</template>

<script setup lang="ts">
import { QuillEditor, Delta, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Types, Realtime } from 'ably'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import AvatarStacks from '@/components/AvatarStacks.vue'

import { useRealtimeStore } from '@/stores/realtime'

// The ref=editor in QuillEditor works like magic!
const editor = ref(null)
const quill = ref<Quill>(null)

const store = useRealtimeStore()
const channel = computed(() => store.channel)

const isConnected = computed(() => store.isConnected && store.isChannelAttached)
const isLoading = computed(() => !isConnected)

const options = {
  placeholder: 'Start collaborating! :tada:',
  theme: 'snow',
  readOnly: !isConnected
}

interface TextChange {
  delta: Delta
  oldContents: Delta
  source: Sources
}

// TODO set the content of editor with content saved in database
function handleReady() {
  quill.value = editor.value.getQuill()
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
