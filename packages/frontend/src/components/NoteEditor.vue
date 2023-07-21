<template>
  <main>
    <QuillEditor
      ref="editor"
      content-type="delta"
      @textChange="handleTextChange"
      @ready="handleReady"
      :options="options"
    />
  </main>
</template>

<script setup lang="ts">
import { QuillEditor, Delta, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref, computed, onMounted, watch } from 'vue'
import { Types, Realtime } from 'ably'

import { useRealtimeStore } from '@/stores/realtime'

const options = {
  placeholder: 'Start collaborating! :tada:',
  theme: 'snow',
}

// The ref=editor in QuillEditor works like magic!
const editor = ref(null)
const quill = ref<Quill>(null)

const store = useRealtimeStore()
const channel = computed(() => store.channel)
const isChannelAttached = computed(() => store.isChannelAttached)

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

// Subscribe to channel only after channel is attached
watch(isChannelAttached, (isAttached) => {
  if (isAttached) {
    channel.value.subscribe('delta', (message: Types.Message) => {
      if (message.clientId !== store.ablyClientId) {
        quill.value.updateContents(message.data)
      }
    })
  }
})

onMounted(() => {
  store.initializeAbly()
})

/* References
   https://quilljs.com/docs/api/#events
   https://github.com/vueup/vue-quill/issues/188
*/
</script>
