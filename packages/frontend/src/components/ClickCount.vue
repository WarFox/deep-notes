<script setup lang="ts">
import { ref, onMounted } from 'vue'

const count = ref(0)

async function fetchCount() {
  try {
    const response = await fetch(import.meta.env.VITE_APP_API_URL)
    const data = await response.text()
    return Number(data)
  } catch (error) {
    console.log(error)
    return 0
  }
}

async function onClick() {
  try {
    const response = await fetch(import.meta.env.VITE_APP_API_URL, {
      method: 'POST'
    })
    const data = await response.text()
    count.value = Number(data)
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)
    console.log(error)
  }
}

onMounted(async () => {
  try {
    count.value = await fetchCount()
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <div className="App">
    <p>You clicked me {{ count }} times.</p>
    <button @click="onClick()">Click Me!</button>
  </div>
</template>

<style>
p {
  margin-top: 0;
  font-size: 20px;
}
button {
  font-size: 2em;
}
</style>
