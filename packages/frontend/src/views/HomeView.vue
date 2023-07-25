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
    <button
      @click="auth.signOut"
      class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
    >
      Sign out
    </button>
  </authenticator>
</template>

<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue'
import '@aws-amplify/ui-vue/styles.css'

const auth = useAuthenticator()
</script>
