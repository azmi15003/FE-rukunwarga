<template>
  <div class="m-[130px]">
    <h2 class="text-lg font-bold mb-4">Upload Banner Komplek</h2>

    <!-- Jika banner sudah ada, tampilkan -->
    <div v-if="bannerUrl" class="mt-4">
      <h3 class="mb-2 text-sm font-semibold">Banner Saat Ini:</h3>
      <img :src="bannerUrl" class="max-w-full h-48 rounded" />

      <div class="mt-2">
        <el-button type="warning" @click="resetUpload">Ganti Banner</el-button>
      </div>
    </div>

    <!-- Jika belum ada banner atau user mau ganti -->
    <el-upload
      v-else
      class="upload-demo"
      action=""
      :http-request="customUpload"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-error="handleUploadError"
      accept="image/*"
    >
      <el-button type="primary">Upload Banner</el-button>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'

const bannerUrl = ref(null)

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) ElMessage.error('Hanya file gambar yang diperbolehkan!')
  if (!isLt2M) ElMessage.error('Ukuran gambar tidak boleh lebih dari 2MB!')
  return isImage && isLt2M
}

const handleUploadError = () => {
  ElMessage.error('Upload gagal');
}

const customUpload = async ({ file }) => {
  const formData = new FormData()
  formData.append('image', file)

  try {
    const res = await axios.post('/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const url = res.data.fileUrl
    bannerUrl.value = `http://localhost:4000${url}`
    ElMessage.success('Upload berhasil!')
  } catch (error) {
    ElMessage.error('Gagal upload gambar')
  }
}

const getBanner = async () => {
  try {
    const res = await axios.get('/banner')
    bannerUrl.value = `http://localhost:4000${res.data.fileUrl}`
  } catch (err) {
    bannerUrl.value = null // kalau error dianggap belum ada
  }
}

const resetUpload = () => {
  bannerUrl.value = null
}

onMounted(() => {
  getBanner()
})
</script>
