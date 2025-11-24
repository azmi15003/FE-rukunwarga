<template>
  <div class="p-[120px]">
    <!-- Search & Filter -->
    <div class="flex items-center justify-between mb-4 gap-4 flex-wrap">
      <div class="flex items-center gap-3 flex-wrap">
        <el-input
          v-model="search"
          placeholder="Cari No KK atau Nama"
          clearable
          @input="debouncedSearch"
          style="width: 220px"
        />
        <el-select v-model="selectedRT" placeholder="Filter RT" @change="handleRTFilterChange" style="width: 140px">
          <el-option v-for="rt in rtOptions" :key="rt" :label="rt" :value="rt" />
        </el-select>
      </div>
      <el-button type="primary" @click="openAddDialog">+ Tambah KK</el-button>
    </div>

    <!-- Table -->
    <el-table :data="kkList" style="width: 100%" row-key="id" border v-loading="loading">
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
          <div v-else class="text-gray-500 px-4 py-2">Tidak ada data warga</div>
        </template>
      </el-table-column>

      <el-table-column prop="no_kk" label="No KK" width="180" />
      <el-table-column prop="nama_kepala_keluarga" label="Kepala Keluarga" width="180" />
      <el-table-column prop="alamat" label="Alamat" />
      <el-table-column prop="rt" label="RT" width="120" />
      <el-table-column prop="rw" label="RW" width="120" />
      <el-table-column label="Aksi">
        <template #default="{ row }">
          <el-button @click="openEditDialog(row)">Edit</el-button>
          <el-button type="danger" @click="deleteKK(row.id)">Hapus</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="flex justify-end mt-4">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="handlePageChange"
      />
    </div>

    <!-- Dialog dengan v-if -->
    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="editingId ? 'Edit KK' : 'Tambah KK'"
      width="800px"
      @close="handleCancel"
    >
      <KKForm v-model="kkData" />
      <WargaForm v-model="wargaList" />

      <template #footer>
        <el-button @click="handleCancel">Batal</el-button>
        <el-button type="primary" @click="submitForm">
          {{ editingId ? 'Update' : 'Simpan' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import api from '../../utils/axios'
import KKForm from './components/KkForms.vue'
import WargaForm from './components/InhabitantForm.vue'
import { ElMessage } from 'element-plus'

// State
const search = ref('')
const page = ref(1)
const pageSize = 10
const total = ref(0)
const kkList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const editingId = ref(null)
const selectedRT = ref('')
const rtOptions = ['001', '002', '003', '004', '005']

const kkData = ref(defaultKKData())
const wargaList = ref([])

function defaultKKData() {
  return {
    no_kk: '', nama_kepala_keluarga: '', alamat: '', rt: '', rw: '', kode_pos: '',
    desa: '', kecamatan: '', kabupaten: '', provinsi: ''
  }
}

const fetchKK = async () => {
  loading.value = true
  try {
    const res = await api.get('/kk', {
      params: {
        page: page.value,
        limit: pageSize,
        search: search.value,
        rt: selectedRT.value || null
      }
    })
    kkList.value = res.data.data
    total.value = res.data.pagination.total
  } catch (err) {
    console.error(err)
    ElMessage.error('Gagal mengambil data KK')
  } finally {
    loading.value = false
  }
}

const openAddDialog = async () => {
  dialogVisible.value = false
  await nextTick()
  editingId.value = null
  kkData.value = defaultKKData()
  wargaList.value = []
  dialogVisible.value = true
}

const openEditDialog = async (row) => {
  dialogVisible.value = false
  await nextTick()
  editingId.value = row.id
  kkData.value = { ...row }
  wargaList.value = [...(row.warga || [])]
  dialogVisible.value = true
}

const handleCancel = () => {
  dialogVisible.value = false
  editingId.value = null
  kkData.value = defaultKKData()
  wargaList.value = []
}

const submitForm = async () => {
  try {
    const payload = { ...kkData.value, warga: wargaList.value }
    if (editingId.value) {
      await api.put(`/kk/${editingId.value}`, payload)
      ElMessage.success('Berhasil memperbarui data KK')
    } else {
      await api.post('/kk', payload)
      ElMessage.success('Berhasil menambahkan data KK')
    }
    dialogVisible.value = false
    fetchKK()
  } catch (err) {
    console.error(err)
    ElMessage.error('Gagal menyimpan data')
  }
}

const deleteKK = async (id) => {
  try {
    await api.delete(`/kk/${id}`)
    ElMessage.success('Berhasil menghapus data KK')
    fetchKK()
  } catch (err) {
    console.error(err)
    ElMessage.error('Gagal menghapus data')
  }
}

const handlePageChange = (newPage) => {
  page.value = newPage
  fetchKK()
}

const handleRTFilterChange = () => {
  page.value = 1
  fetchKK()
}

let debounceTimeout
const debouncedSearch = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    page.value = 1
    fetchKK()
  }, 500)
}

onMounted(fetchKK)
</script>
