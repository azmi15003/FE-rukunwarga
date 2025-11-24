<template>
  <div class="p-[120px]">
    <el-form :model="root" label-position="top">
      <OrganizationNode v-model="root" />
      <el-button type="primary" @click="submit">Kirim ke Backend</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import OrganizationNode from './OrganizationNode.vue'
import axios from '@/utils/axios'

const root = reactive({
  key: '0',
  type: 'person',
  data: {
    image: '',
    name: '',
    title: ''
  },
  children: []
})

const submit = async () => {
  try {
    await axios.post('/api/organizations', root)
    alert('Berhasil dikirim!')
  } catch (error) {
    alert('Gagal mengirim data')
  }
}
</script>
