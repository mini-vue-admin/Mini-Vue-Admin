import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import User from "@/views/system/user.vue";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Menu from "@/views/system/menu.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      redirect: '/Home',
      children: [
        {
          path:'/Home',
          name:'home',
          component:Home
        },
        {
          path:'/system/user',
          name:'user',
          component:User
        },
        {
          path:'/system/menu',
          name:'menu',
          component:Menu
        }
      ]
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

export default router
