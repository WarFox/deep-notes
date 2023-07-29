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
    <div class="relative shadow-md">
      <div class="flex items-center justify-between pb-2 bg-white dark:bg-neutral-900">
        <div>
          <h1 v-if="noteData" class="px-2 text-neutral-400 text-lg">{{ noteData.title }}</h1>
        </div>
        <div class="relative">
          <button
            @click="saveNote"
            class="px-2 mx-2 text-neutral-900 dark:bg-neutral-400 hover:bg-neutral-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
    <QuillEditor
      ref="editor"
      v-model:content="content"
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
import { useRoute } from 'vue-router'

import { useRealtimeStore } from '@/stores/realtime'
import { useNoteStore } from '@/stores/notes'

const route = useRoute()
const realtime = useRealtimeStore()
const notes = useNoteStore()

const noteId = ref(route.params.id)
const noteData = ref()

const content = ref()

// The ref=editor in QuillEditor works like magic!
const editor = ref(null)
const quill = ref<Quill>(null)

const channel = computed(() => realtime.channel)

const isConnected = computed(() => realtime.isConnected && realtime.isChannelAttached)
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

function saveNote() {
  // save note
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
    const data = { color: realtime.color, range }
    channel.value.presence.update(data)
  }
}

// Subscribe to channel only after channel is attached
watch(isConnected, () => {
  if (isConnected) {
    channel.value.subscribe('delta', (message: Types.Message) => {
      if (message.clientId !== realtime.ablyClientId) {
        quill.value.updateContents(message.data)
      }
    })

    // setup presence immediately after connection
    realtime.setupPresence()
  }
})

// Update editor content with noteData
watch(noteData, (newData) => {
  if (newData.content) {
    content.value = new Delta().insert(newData.content)
  }
})

onMounted(async () => {
  noteData.value = await notes.fetchNote(noteId.value)

  window.addEventListener('beforeunload', (event) => {
    // on the navigation type checking refresh or close tab/browser for logout
    if (performance.navigation.type != 1) {
      realtime.disconnectAbly() // gracefully disconnect before closing window
    }

    return false
  })
})

onUnmounted(() => {
  realtime.disconnectAbly()
})

/* References
   https://quilljs.com/docs/api/#events
   https://github.com/vueup/vue-quill/issues/188
   https://www.velotio.com/engineering-blog/build-collaborative-editor-using-quill-and-yjs
*/
</script>
