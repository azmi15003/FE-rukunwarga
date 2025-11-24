<template>
  <div class="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 my-[120px]">
    <h2 class="text-xl font-bold mb-6">Daftar Informasi</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="item in informasiList"
        :key="item.id"
        class="bg-white shadow-md rounded-md p-4"
      >
        <el-image
          :src="getImageUrl(item.image)"
          :preview-src-list="[getImageUrl(item.image)]"
          fit="cover"
          class="w-full h-48 object-cover rounded mb-4"
        />
        <h3 class="font-semibold text-lg mb-1">{{ item.title }}</h3>
        <p class="text-sm text-gray-600 mb-1">{{ item.description }}</p>
        <p class="text-sm text-gray-500">Lokasi: {{ item.location }}</p>
        <p class="text-sm text-gray-500">Kontak: {{ item.contact_person }}</p>
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/axios'

const informasiList = ref([])
const loading = ref(false)
const page = ref(1)
const limit = 6
const totalPages = ref(1)

const route = useRoute()

// Ambil `type` dari segment terakhir path
const type = computed(() => route.path.split('/').pop())

const getImageUrl = (path) =>
  `${import.meta.env.VITE_FILES_URL}${path}`;

const fetchInformation = async () => {
  if (loading.value || page.value > totalPages.value) return
  loading.value = true
  try {
    const res = await api.get('/information', {
      params: {
        page: page.value,
        limit,
        type: type.value  // ← Kirim type ke backend
      }
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

// Reset dan fetch ulang saat route berubah
watch(() => type.value, () => {
  informasiList.value = []
  page.value = 1
  fetchInformation()
})

onMounted(() => {
  fetchInformation()
})
</script>
