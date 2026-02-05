import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../auth/authStore'

import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
    history: createWebHistory(),

    routes: [
        { path: '/login', component: LoginView },
        { path: '/register', component: RegisterView },
        { path: '/', component: DashboardView, meta: { requiresAuth: true } },
    ],
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()

    if (auth.token && !auth.user) {
        await auth.fetchUser()
    }

    if (to.meta.requiresAuth && !auth.token) {
        return '/login'
    }

    if (to.path === '/login' && auth.token) {
        return '/'
    }
})

export default router
