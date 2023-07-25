import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Auth } from 'aws-amplify'

export const useAuthStore = defineStore('auth', () => {
  const jwt = ref()

  const getJwtToken = async () => {
    const session = await Auth.currentSession()
    const accessToken = session.getAccessToken()
    jwt.value = accessToken.getJwtToken()
  }

  getJwtToken()

  return {
    jwt
  }
})
