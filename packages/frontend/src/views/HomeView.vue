<template>
  <template v-if="auth.route !== 'authenticated'">
    <HeroSection
      heroText="Collaborative Notes for the 21st Century"
      msg="Start writing your notes and share them in realtime!"
    />
  </template>
  <authenticator>
    <HelloWorld msg="Deep Notes" />

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
import HelloWorld from '@/components/HelloWorld.vue'
import HeroSection from '@/components/HeroSection.vue'
import { auth, Authenticator } from '@/lib/auth'

import '@aws-amplify/ui-vue/styles.css'
</script>
