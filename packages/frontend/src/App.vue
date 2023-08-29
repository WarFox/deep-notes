<script setup lang="ts">
import { useAuthenticator } from '@aws-amplify/ui-vue'
import NavBar from './components/NavBar.vue'
import { RouterLink, RouterView } from 'vue-router'

const auth = useAuthenticator()
</script>

<template>
  <header>
    <NavBar />
  </header>

  <main class="container mx-auto p-2">
    <RouterView />
  </main>
</template>
