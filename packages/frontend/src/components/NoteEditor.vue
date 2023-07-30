<template>
  <!-- Connection indicator -->
  <span
    class="flex w-2 h-2 rounded-full"
    :class="hasConnected ? 'bg-green-500' : 'bg-red-500'"
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
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import AvatarStacks from '@/components/AvatarStacks.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import { QuillEditor, Delta, Quill } from '@vueup/vue-quill'
import { Types, Realtime } from 'ably'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useNoteStore } from '@/stores/notes'
import { useRealtimeStore } from '@/stores/realtime'
import { useRoute } from 'vue-router'

const route = useRoute()
const realtime = useRealtimeStore()
const notes = useNoteStore()

const noteId = ref(route.params.id)
const noteData = ref()

const content = ref()

// The ref=editor in QuillEditor works like magic!
const editor = ref(null)
const quill = ref<Quill>(null)

const { channel, ablyClientId } = storeToRefs(realtime)

const hasConnected = computed(() => ablyClientId.value && channel.value)
const isLoading = computed(() => !hasConnected)

const options = {
  placeholder: 'Start collaborating! :tada:',
  theme: 'snow',
  readOnly: !hasConnected
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

function subscribeDelta(channel) {
  channel.subscribe('delta', (message: Types.Message) => {
    if (message.clientId !== ablyClientId.value) {
      quill.value.updateContents(message.data)
    }
  })
}

// Subscribe to channel only after channel is attached
watch(channel, (ch) => {
  if (ch) {
    subscribeDelta(ch)
  }
})

// Update editor content with noteData
watch(noteData, (newData) => {
  if (newData.content) {
    content.value = new Delta().insert(newData.content)
  }
})

onMounted(async () => {
  noteData.value = await notes.findNote(noteId.value)

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
