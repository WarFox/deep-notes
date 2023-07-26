import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from './auth'

export const useNoteStore = defineStore('notes', () => {
  const url = `${import.meta.env.VITE_APP_API_URL}/notes`

  const auth = useAuthStore()

  const jwt = computed(() => auth.jwt)

  const notes = ref<[]>()

  async function fetchNotes() {
    if (jwt.value) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt.value}`
        }
      })

      const data = await response.json()
      notes.value = data
    }
  }

  async function fetchNote(noteId: String) {
    if (jwt.value) {
      const response = await fetch(`${url}/${noteId}`, {
        headers: {
          Authorization: `Bearer ${jwt.value}`
        }
      })

      return await response.json()
    }
  }

  async function createNote(title: String) {
    if (jwt.value) {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt.value}`
        },
        body: JSON.stringify({ title })
      })

      const data = await response.json()
      if (response.status === 201) {
        notes.value.push(data)
      }
    }
  }

  // fetch notes as soon as jwt token is available
  watch(jwt, () => {
    fetchNotes()
  })

  return {
    notes,
    fetchNotes,
    fetchNote,
    createNote
  }
})
