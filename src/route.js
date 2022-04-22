import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import home from './components/home.vue'
import login from './components/login.vue'
import register from './components/register.vue'

export const routes = [
    {
        path: '/',
        name: 'home',
        component: home
    },
    {
        path: '/login',
        name: 'login',
        component: login
    },
    {
        path: '/register',
        name: 'register',
        component: register
    },
    {
        path: '/home',
        name: 'home',
        component: home
    }
]

export default new Router({
    // mode:'history',
    routes: routes
})