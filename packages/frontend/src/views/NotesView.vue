<template>
  <LoadingIndicator v-if="isLoading" />

  <div v-else class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div>
      <input
        type="text"
        id="title"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Title for new note"
        required
        v-model="title"
      />
      <button
        @click="createNote()"
        class="items-center justify-center px-5 py-3 text-base font-medium text-center text-neutral-900 border border-neutral-300 rounded-lg hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:ring-neutral-800"
      >
        Create New Note
      </button>
      <button
        @click="store.fetchNotes()"
        class="items-center justify-center px-5 py-3 text-base font-medium text-center text-neutral-900 border border-neutral-300 rounded-lg hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:ring-neutral-800"
      >
        Refresh
      </button>
    </div>

    <table class="w-full text-sm text-left text-neutral-500 dark:text-neutral-400">
      <thead
        class="text-xs text-neutral-700 uppercase bg-neutral-50 dark:bg-neutral-700 dark:text-neutral-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Title</th>
          <th scope="col" class="px-6 py-3">Created By</th>
          <th scope="col" class="px-6 py-3">Created At</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="note in notes"
          :key="note.noteId"
          class="bg-white border-b dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-600"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap dark:text-white"
          >
            {{ note.title }}
          </th>
          <td class="px-6 py-4">{{ note.userId }}</td>
          <td class="px-6 py-4">{{ note.createdAt }}</td>
          <td class="px-6 py-4">
            <router-link
              :to="{ name: 'notes-editor', params: { id: note.noteId } }"
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useNoteStore } from '@/stores/notes'
import { computed, ref } from 'vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

const store = useNoteStore()

const notes = computed(() => store.notes)

const isLoading = computed(() => notes.value == undefined)

const title = ref()

function createNote() {
  store.createNote(title.value)

  title.value = ''
}
</script>
