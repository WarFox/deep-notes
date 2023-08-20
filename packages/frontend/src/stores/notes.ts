import { API } from 'aws-amplify'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Note {
  noteId: string
  userId: string
  title: string
  content: string
  createdAt: string
}

export const useNoteStore = defineStore('notes', () => {
  const notes = ref<Note[]>()

  const isLoading = ref(false)

  async function fetchNotes() {
    isLoading.value = true
    notes.value = await API.get('api', '/notes', {})
    isLoading.value = false
  }

  async function fetchNote(noteId: string) {
    isLoading.value = true
    const note = await API.get('api', `/notes/${noteId}`, {})
    isLoading.value = false
    return note
  }

  async function createNote(title: string) {
    isLoading.value = true
    try {
      const data = await API.post('api', '/notes', { body: { title } })
      if (data) {
        notes.value.push(data)
      }
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }

  // fetch Note when store is created
  fetchNotes()

  return {
    notes,
    isLoading,
    fetchNotes,
    fetchNote,
    createNote
  }
})
