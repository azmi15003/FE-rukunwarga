<template>
  <div class="p-[120px]">
    <h2 class="text-xl font-bold mb-4">Daftar Kartu Keluarga</h2>

    <el-input
      v-model="search"
      placeholder="Cari No KK atau Nama"
      class="mb-4 max-w-md"
      clearable
      @input="debouncedSearch"
    />

    <el-table
      :data="kkList"
      style="width: 100%"
      row-key="id"
      border
      :default-expand-all="false"
      v-loading="loading"
    >
      <!-- Expandable Row -->
      <el-table-column type="expand">
        <template #default="props">
          <el-table
            :data="props.row.warga"
            style="width: 100%"
            border
            v-if="props.row.warga && props.row.warga.length"
          >
            <el-table-column prop="nik" label="NIK" width="180" />
            <el-table-column prop="nama" label="Nama" width="180" />
            <el-table-column prop="jenis_kelamin" label="Jenis Kelamin" width="120" />
            <el-table-column prop="tanggal_lahir" label="Tanggal Lahir" width="140" />
            <el-table-column prop="tempat_lahir" label="Tempat Lahir" width="140" />
            <el-table-column prop="agama" label="Agama" width="100" />
            <el-table-column prop="pendidikan" label="Pendidikan" width="140" />
            <el-table-column prop="jenis_pekerjaan" label="Pekerjaan" width="180" />
            <el-table-column prop="status_perkawinan" label="Status Perkawinan" width="160" />
            <el-table-column prop="tanggal_perkawinan" label="Tanggal Perkawinan" width="160" />
            <el-table-column prop="status_hubungan_dalam_keluarga" label="Status Hubungan" width="180" />
            <el-table-column prop="golongan_darah" label="Golongan Darah" width="140" />
            <el-table-column prop="kewarganegaraan" label="Kewarganegaraan" width="140" />
            <el-table-column prop="nama_ayah" label="Nama Ayah" width="160" />
            <el-table-column prop="nama_ibu" label="Nama Ibu" width="160" />
            <el-table-column prop="no_paspor" label="No Paspor" width="140" />
            <el-table-column prop="no_kitap" label="No KITAP" width="140" />
          </el-table>

          <!-- Fallback if no data -->
          <div v-else class="text-gray-500 px-4 py-2">Tidak ada data warga</div>
        </template>
      </el-table-column>

      <!-- Parent Columns -->
      <el-table-column prop="no_kk" label="No KK" width="180" />
      <el-table-column prop="nama_kepala_keluarga" label="Kepala Keluarga" width="180" />
      <el-table-column prop="alamat" label="Alamat" />
      <el-table-column prop="rt" label="RT" width="120" />
      <el-table-column prop="rw" label="RW" width="120" />
    </el-table>

    <div class="flex justify-end mt-4">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../utils/axios'

// STATE
const search = ref('')
const kkList = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const total = ref(0)
const route = useRoute()

// FETCH DATA
const fetchKK = async () => {
  loading.value = true
  try {
    const res = await api.get('/kk', {
      params: {
        page: page.value,
        limit: pageSize,
        search: search.value,
        rt: route.params.rt ? `00${route.params.rt.split('-')[1]}` : null
      }
    })
    kkList.value = res.data.data
    total.value = res.data.pagination.total
  } catch (err) {
    console.error('Gagal ambil data KK:', err)
  } finally {
    loading.value = false
  }
}

// DEBOUNCED SEARCH
let debounceTimeout
const debouncedSearch = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    page.value = 1
    fetchKK()
  }, 500)
}

// PAGINATION HANDLER
const handlePageChange = (newPage) => {
  page.value = newPage
  fetchKK()
}

// INIT
onMounted(() => {
  fetchKK()
})

// WATCH PARAM ROUTE
watch(() => route.params.rt, () => {
  page.value = 1
  fetchKK()
})
</script>
