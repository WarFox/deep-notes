<template>
  <!-- AvatarStacks -->
  <span class="font-sans">
    <span class="flex -space-x-2 justify-end">
      <div
        v-for="avatar in avatars"
        :key="avatar.clientId"
        class="relative inline-flex items-center justify-center w-10 h-10 ring-2 ring-white rounded-full"
        :class="avatar.isConnected ? bgColours[avatar.color] : 'bg-gray-500'"
      >
        <span class="font-medium text-white dark:text-white">JL</span>
        <span
          v-if="avatar.isConnected"
          class="bottom-0 right-7 absolute w-2 h-2 bg-green-600 ring-2 ring-white dark:border-gray-800 rounded-full"
        ></span>
      </div>
      <!--
           TODO show this when there are too many participants
           <a
                 class="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-500 z-10 border-2 border-white rounded-full ring-2 ring-gray-300 hover:bg-gray-600 dark:border-gray-600"
                 href="#"
                 >+6</a
                 > -->
    </span>
  </span>
</template>

<script setup lang="ts">
const bgColours = {
  amber: 'bg-amber-400',
  blue: 'bg-blue-400',
  cyan: 'bg-cyan-400',
  green: 'bg-green-400',
  indigo: 'bg-indigo-400',
  lime: 'bg-lime-400',
  orange: 'bg-orange-400',
  red: 'bg-red-400'
}

import { useRealtimeStore } from '@/stores/realtime'
import { computed, watch, ref } from 'vue'

const store = useRealtimeStore()

const participants = computed(() => store.participants.values())

const avatars = ref([])

watch(participants, () => {
  const values = []
  for (let [key, value] of store.participants) {
    values.push(value)
  }
  avatars.value = values
})
</script>
