<template>
  <h1>Notes</h1>

  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
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
          :key="notes.noteId"
          class="bg-white border-b dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-600"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap dark:text-white"
          >
            {{ note.title }}
          </th>
          <td class="px-6 py-4">{{ note.createdBy }}</td>
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

import { computed } from 'vue'

const store = useNoteStore()

const notes = computed(() => store.notes)

store.fetchNotes()
</script>
