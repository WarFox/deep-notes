<template>
  <Disclosure as="nav" class="bg-neutral-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <img alt="Deep Notes Logo" class="w-5" src="@/assets/deep-notes-logo.png" />
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <RouterLink
                to="/"
                class="text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                :aria-current="isCurrent('home') ? 'page' : undefined"
                >Home</RouterLink
              >
              <RouterLink
                v-if="auth.route === 'authenticated'"
                v-for="item in authenticatedRoutes"
                :key="item.name"
                :to="item.to"
                class="text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                :aria-current="isCurrent(item.name) ? 'page' : undefined"
                >{{ item.name }}</RouterLink
              >
              <RouterLink
                to="/about"
                class="text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                :aria-current="isCurrent('about') ? 'page' : undefined"
                >About</RouterLink
              >
            </div>
          </div>
        </div>
        <div
          v-if="auth.route === 'authenticated'"
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <button
            type="button"
            class="relative rounded-full bg-neutral-800 p-1 text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800"
          >
            <span class="absolute -inset-1.5" />
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true" />
          </button>

          <!-- Profile dropdown -->
          <Menu as="div" class="relative ml-3">
            <div>
              <MenuButton
                class="relative flex rounded-full bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800"
              >
                <span class="absolute -inset-1.5" />
                <span class="sr-only">Open user menu</span>
                <div
                  class="relative inline-flex items-center justify-center w-10 h-10 ring-2 ring-white rounded-full text-white"
                >
                  DP
                </div>
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      active ? 'bg-neutral-100' : '',
                      'block px-4 py-2 text-sm text-neutral-700'
                    ]"
                    >Your Profile</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      active ? 'bg-neutral-100' : '',
                      'block px-4 py-2 text-sm text-neutral-700'
                    ]"
                    >Settings</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    @click="auth.signOut"
                    href="#"
                    :class="[
                      active ? 'bg-neutral-100' : '',
                      'block px-4 py-2 text-sm text-neutral-700'
                    ]"
                    >Sign out</a
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden" v-slot="{ close }">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <DisclosureButton
          :as="RouterLink"
          to="/"
          @click="close()"
          class="text-neutral-300 hover:bg-neutral-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
          :aria-current="isCurrent('home') ? 'page' : undefined"
          >Home</DisclosureButton
        >
        <DisclosureButton
          :as="RouterLink"
          v-if="auth.route === 'authenticated'"
          v-for="item in authenticatedRoutes"
          :key="item.name"
          :to="item.to"
          @click="close()"
          class="text-neutral-300 hover:bg-neutral-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
          :aria-current="isCurrent(item.name) ? 'page' : undefined"
          >{{ item.name }}</DisclosureButton
        >
        <DisclosureButton
          :as="RouterLink"
          to="/about"
          @click="close()"
          class="text-neutral-300 hover:bg-neutral-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
          :aria-current="isCurrent('about') ? 'page' : undefined"
          >About</DisclosureButton
        >
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'
import { computed, watch, ref } from 'vue'
import { useAuthenticator } from '@aws-amplify/ui-vue'
import { useRoute } from 'vue-router'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/vue'

const auth = useAuthenticator()
const route = useRoute()

function isCurrent(name) {
  return route.name === name.toLowerCase()
}

const authenticatedRoutes = [{ name: 'Notes', to: '/notes' }]
</script>

<style lang="postcss" scoped>
.router-link-active {
  @apply bg-neutral-900 text-white;
}
</style>
