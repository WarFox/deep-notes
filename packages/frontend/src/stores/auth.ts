import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Auth } from 'aws-amplify'

export const useAuthStore = defineStore('auth', () => {
  const jwt = ref()

  Auth.currentSession().then((session) => {
    const accessToken = session.getAccessToken()
    jwt.value = accessToken.getJwtToken()
  })

  return {
    jwt
  }
})
