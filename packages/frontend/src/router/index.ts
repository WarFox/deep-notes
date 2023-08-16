import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotesView from '../views/NotesView.vue'
import EditorView from '../views/EditorView.vue'
import { useAuthenticator } from '@aws-amplify/ui-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/notes',
      name: 'notes',
      component: NotesView
    },
    {
      path: '/notes/:id',
      name: 'notes-editor',
      component: EditorView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

// const store = useAuthenticator()

// router.beforeEach(async (to, from) => {
//   if (
//     // make sure the user is authenticated
//     store.route !== 'authenticated' &&
//     // ❗️ Avoid an infinite redirect
//     to.name !== 'home' &&
//     to.name !== 'about'
//   ) {
//     // redirect the user to the login page
//     return { name: 'home' }
//   }
// })

export default router
