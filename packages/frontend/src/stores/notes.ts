import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNoteStore = defineStore('notes', () => {
  const url = `${import.meta.env.VITE_APP_API_URL}/notes`

  const notes = ref<[]>()

  async function fetchNotes() {
    const response = await fetch(url)
    const data = await response.json()
    notes.value = data
  }

  return { notes, fetchNotes }
})
