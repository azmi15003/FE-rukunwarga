<template>
    <div class="register-container">
      <el-card class="register-card" shadow="hover">
        <h2 class="title">Register Akun</h2>
  
        <el-form
          :model="form"
          :rules="rules"
          ref="registerForm"
          label-position="top"
          status-icon
          class="register-form"
        >
          <el-form-item label="Nama Lengkap" prop="username">
            <el-input v-model="form.username" placeholder="Masukkan nama lengkap" />
          </el-form-item>
  
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" placeholder="Masukkan email" />
          </el-form-item>
  
          <el-form-item label="Password" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="Masukkan password"
              show-password
            />
          </el-form-item>
  
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="onSubmit"
              class="submit-btn"
              >Daftar</el-button
            >
          </el-form-item>
        </el-form>
  
        <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          show-icon
          closable
          @close="errorMessage = ''"
          class="error-alert"
        />
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/utils/axios'
  
  const router = useRouter()
  const registerForm = ref(null)
  
  const form = ref({
    username: '',
    email: '',
    password: '',
    role_id: 1
  })
  
  const rules = {
    username: [
      { required: true, message: 'Nama wajib diisi', trigger: 'blur' }
    ],
    email: [
      { required: true, message: 'Email wajib diisi', trigger: 'blur' },
      { type: 'email', message: 'Email tidak valid', trigger: ['blur', 'change'] }
    ],
    password: [
      { required: true, message: 'Password wajib diisi', trigger: 'blur' },
      { min: 6, message: 'Password minimal 6 karakter', trigger: 'blur' }
    ]
  }
  
  const loading = ref(false)
  const errorMessage = ref('')
  
  const onSubmit = () => {
    registerForm.value.validate(async (valid) => {
      if (!valid) return
  
      loading.value = true
      errorMessage.value = ''
  
      try {
        await api.post('/auth/register', form.value)
        loading.value = false
        router.push('/login')
      } catch (error) {
        loading.value = false
        errorMessage.value =
          error.response?.data?.message || 'Terjadi kesalahan saat registrasi'
      }
    })
  }
  </script>
  
  <style scoped>
  .register-container {
    max-width: 400px;
    margin: 3rem auto;
    padding: 0 1rem;
  }
  .register-card {
    padding: 2rem;
  }
  .title {
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 700;
    font-size: 1.8rem;
    color: #303133;
  }
  .submit-btn {
    width: 100%;
  }
  .error-alert {
    margin-top: 1rem;
  }
  </style>
  