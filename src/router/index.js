import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import HeroesView from '../views/HeroesView.vue'
import CreateHeroView from '../views/CreateHeroView.vue'
import HeroDetailView from '../views/HeroDetailView.vue'
import EditHeroView from '../views/EditHeroView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/heroes',
      name: 'heroes',
      component: HeroesView,
    },
    {
      path: '/heroes/create',
      name: 'create-hero',
      component: CreateHeroView,
    },
    {
      path: '/heroes/:id',
      name: 'hero-detail',
      component: HeroDetailView,
    },
    {
      path: '/heroes/:id/edit',
      name: 'edit-hero',
      component: EditHeroView,
    },
  ],
})

export default router
