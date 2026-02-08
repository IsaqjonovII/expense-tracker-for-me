import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateView from '../views/CreateView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/list',
        name: 'list',
        component: () => import('../views/ListView.vue')
    },
    {
        path: '/create',
        name: 'create',
        component: CreateView
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

import { useUser } from '../composables/useUser.js'

router.beforeEach((to, from, next) => {
    const { currentUser } = useUser()
    if (to.name !== 'login' && !currentUser.value) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router
