import { defineStore } from 'pinia'
import { api } from '../api/client'
import type { User, AuthResponse } from '../types/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: localStorage.getItem('token') as string | null,
    }),

    actions: {
        async login(email: string, password: string) {
            const res = await api.post<AuthResponse>('/auth/login', {
                email,
                password,
                device_name: 'web',
            })

            this.token = res.data.token
            this.user = res.data.user

            localStorage.setItem('token', this.token)
            api.defaults.headers.common.Authorization = `Bearer ${this.token}`
        },

        async fetchUser() {
            if (!this.token) return

            api.defaults.headers.common.Authorization = `Bearer ${this.token}`
            const res = await api.get<User>('/me')
            this.user = res.data
        },
        async register(
            name: string,
            email: string,
            password: string,
            password_confirmation: string,
        ) {
            const res = await api.post<AuthResponse>('/auth/register', {
                name,
                email,
                password,
                password_confirmation,
            })

            this.token = res.data.token
            this.user = res.data.user

            localStorage.setItem('token', this.token)
            api.defaults.headers.common.Authorization = `Bearer ${this.token}`
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
            delete api.defaults.headers.common.Authorization
        },
    },
})
