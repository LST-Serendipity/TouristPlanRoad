import { createRouter, createWebHistory } from 'vue-router'
import {ConstRoute,anyRoute} from './route'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...ConstRoute,...anyRoute]
})


export default router
