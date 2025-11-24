import { defineStore } from 'pinia'
import api from '@/utils/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || null,
    error: ''
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getError: (state) => state.error,
  },

  actions: {
    async login(email, password) {
      this.error = ''
      try {
        const response = await api.post('/auth/login', { email, password })
        this.token = response.data.token
        this.user = response.data.user
        console.log(response.data, 'data')
        console.log(this.user, 'userrrrr')
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (err) {
        this.error = err.response?.data?.message || 'Login gagal'
        console.error(err)
      }
    },

    logout() {
        this.token = ''
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },

    async register(email, password, username) {
      this.error = ''
      try {
        const response = await api.post('/auth/register', {
          email,
          password,
          username,
        })
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Register gagal'
        console.error(err)
      }
    },

    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
