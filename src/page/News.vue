<template>
  <div class="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 my-[120px]">
    <h2 class="text-xl font-bold mb-6">Berita Kegiatan</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="item in informasiList"
        :key="item.id"
        class="bg-white shadow-md rounded-md p-4"
      >
        <el-image
          :src="getImageUrl(item.image_path)"
          :preview-src-list="[getImageUrl(item.image_path)]"
          fit="cover"
          class="w-full h-48 object-cover rounded mb-4"
        />
        <h3 class="font-semibold text-lg mb-1">{{ item.title }}</h3>
        <p class="text-sm text-gray-600 mb-1">{{ item.content }}</p>
      </div>
    </div>

    <!-- Load More Button -->
    <div class="flex justify-center mt-8" v-if="page <= totalPages && !loading">
      <el-button type="primary" @click="fetchInformation">Load More</el-button>
    </div>

    <div class="flex justify-center mt-4" v-if="loading">
      <el-spinner />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/axios'

const informasiList = ref([])
const loading = ref(false)
const page = ref(1)
const limit = 6
const totalPages = ref(1)

const getImageUrl = (path) => `http://localhost:4000${path}` // sesuaikan dengan backend

const fetchInformation = async () => {
  if (loading.value || page.value > totalPages.value) return
  loading.value = true
  try {
    const res = await api.get('/news', {
      params: { page: page.value, limit }
    })
    informasiList.value.push(...res.data.data)
    totalPages.value = res.data.pagination.totalPages
    page.value++
  } catch (err) {
    console.error('Gagal mengambil data informasi:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchInformation()
})
</script>
