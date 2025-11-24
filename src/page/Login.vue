<template>
    <div class="login-container">
      <el-card class="login-form-card">
        <h2 class="text-center">Login</h2>
        <el-form :model="form" label-width="100px" class="login-form" @submit.prevent="submitLogin">
          <el-form-item label="Email" :rules="[{ required: true, message: 'Email is required', trigger: 'blur' }]">
            <el-input v-model="form.email" type="email" placeholder="Masukkan Email"></el-input>
          </el-form-item>
  
          <el-form-item label="Password" :rules="[{ required: true, message: 'Password is required', trigger: 'blur' }]">
            <el-input v-model="form.password" type="password" placeholder="Masukkan Password"></el-input>
          </el-form-item>
  
          <el-form-item>
            <el-button type="primary" native-type="submit" class="w-full">Login</el-button>
          </el-form-item>
        </el-form>
        <p v-if="error" class="error-message">{{ error }}</p>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/authStore'
  import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
  
  const form = ref({
    email: '',
    password: '',
  })
  
  const error = ref('')
  const router = useRouter()
  const authStore = useAuthStore()
  
  const submitLogin = async () => {
    error.value = ''
    await authStore.login(form.value.email, form.value.password)
    if (authStore.isAuthenticated) {
      router.push('/')
    } else {
      error.value = authStore.getError
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .login-form-card {
    width: 400px;
    padding: 20px;
  }
  
  .error-message {
    color: red;
    text-align: center;
    margin-top: 10px;
  }
  </style>
  