<template>
  <template v-if="auth.route !== 'authenticated'">
    <HeroSection
      heroText="Collaborative Notes for the 21st Century"
      msg="Start writing your notes and share them in realtime!"
    />
  </template>
  <authenticator>
    <h1>Hello {{ auth.user?.username }}!</h1>
    <p>Welcome, You are signed in now!</p>
    <p>
      Go to
      <RouterLink
        to="/notes"
        class="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >Notes</RouterLink
      >, to view all notes.
    </p>
  </authenticator>
</template>

<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import HelloWorld from './components/HelloWorld.vue'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue'
import '@aws-amplify/ui-vue/styles.css'

const auth = useAuthenticator()
</script>
