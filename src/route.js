import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import home from './components/home.vue'
import chart from './components/chart.vue'
import login from './components/login.vue'

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
        path: '/home',
        name: 'home',
        component: home
    },
    {
        path: '/chart',
        name: 'chart',
        component: chart
    }
]

export default new Router({
    // mode:'history',
    routes: routes
})