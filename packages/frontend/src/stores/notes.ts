import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Auth, API } from 'aws-amplify'

export const useNoteStore = defineStore('notes', () => {
  const url = `${import.meta.env.VITE_APP_API_URL}/notes`

  const jwt = ref()

  const notes = ref<[]>()

  Auth.currentSession().then((session) => {
    const accessToken = session.getAccessToken()
    jwt.value = accessToken.getJwtToken()
  })

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

  watch(jwt, () => {
    // fetch notes as soon as jwt token is available
    fetchNotes()
  })

  return {
    notes,
    fetchNotes
  }
})
