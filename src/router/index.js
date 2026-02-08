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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
