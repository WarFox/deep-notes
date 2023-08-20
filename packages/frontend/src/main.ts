import './assets/style.css'

import App from './App.vue'
import router from './router'
import { Amplify } from 'aws-amplify'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { getAccessTokenJwt } from './lib/auth'

Amplify.configure({
  Auth: {
    userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: 'api',
        endpoint: import.meta.env.VITE_APP_API_URL,
        custom_header: async () => {
          return {
            Authorization: `Bearer ${await getAccessTokenJwt()}`
          }
        }
      }
    ]
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

/*
  Reference:
  https://www.freecodecamp.org/news/how-to-add-authentication-to-a-vue-app-using-aws-amplify/
*/
