<template>
  <div class="m-[130px]">
    <el-button type="primary" @click="openFormDialog">+ Tambah Berita</el-button>

    <el-table :data="paginatedNews" style="margin-top: 2rem;" border>
      <el-table-column label="No" type="index" width="50" />
      <el-table-column prop="title" label="Judul" />
      <el-table-column prop="event_date" label="Tanggal Kegiatan" />
      <el-table-column prop="content" label="Judul" />
      <el-table-column label="Aksi">
        <template #default="{ row }">
          <el-button size="small" @click="editNews(row)">Edit</el-button>
          <el-button size="small" type="danger" @click="confirmDelete(row.id)">Hapus</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :current-page.sync="pagination.currentPage"
      @current-change="fetchNews"
      class="mt-4"
    />

    <!-- Form Dialog -->
    <el-dialog v-model="formDialogVisible" :title="editingId ? 'Edit Berita' : 'Tambah Berita'" width="600px">
      <el-form @submit.prevent="submitForm" label-position="top" size="small">
        <el-form-item label="Judul Berita" required>
          <el-input v-model="title" placeholder="Masukkan judul" />
        </el-form-item>

        <el-form-item label="Isi Berita" required>
          <el-input
            type="textarea"
            v-model="content"
            placeholder="Masukkan isi berita"
            rows="4"
          />
        </el-form-item>

        <el-form-item label="Tanggal Kegiatan">
          <el-date-picker v-model="event_date" type="date" value-format="YYYY-MM-DD" placeholder="Pilih tanggal" />
        </el-form-item>

        <el-form-item label="Gambar" required>
          <input type="file" @change="handleFileChange" />
          <div v-if="previewImage" class="preview">
            <el-image
              :src="previewImage"
              :preview-src-list="[previewImage]"
              fit="cover"
              class="w-full h-48 object-cover rounded mb-4"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit">{{ editingId ? 'Update' : 'Kirim' }}</el-button>
          <el-button @click="closeFormDialog">Batal</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- Info Dialog -->
    <el-dialog v-model="dialogVisible" title="Info" width="30%">
      <span>{{ dialogMessage }}</span>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">OK</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/utils/axios'

const title = ref('')
const content = ref('')
const event_date = ref('')
const selectedFile = ref(null)
const previewImage = ref(null)
const newsList = ref([])
const editingId = ref(null)

const formDialogVisible = ref(false)
const dialogVisible = ref(false)
const dialogMessage = ref('')

const pagination = ref({
  currentPage: 1,
  pageSize: 5,
  total: 0
})

const getImageUrl = (path) => `http://localhost:4000${path}`

const paginatedNews = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return newsList.value.slice(start, end)
})

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    previewImage.value = URL.createObjectURL(file)
  }
}

async function fetchNews() {
  try {
    const res = await api.get('/news')
    newsList.value = res.data.data
    pagination.value.total = res.data.pagination.totalData
  } catch (error) {
    showDialog('Gagal memuat berita')
  }
}

function openFormDialog() {
  resetForm()
  formDialogVisible.value = true
}

function closeFormDialog() {
  formDialogVisible.value = false
  resetForm()
}

async function submitForm() {
  if (!title.value || !content.value || !selectedFile.value) {
    showDialog('Semua field harus diisi!')
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('content', content.value)
  formData.append('image', selectedFile.value)
  formData.append('event_date', event_date.value)

  try {
    if (editingId.value) {
      await api.put(`/news/${editingId.value}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      showDialog('Berita berhasil diperbarui!')
    } else {
      await api.post('/news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      showDialog('Berita berhasil dikirim!')
    }
    closeFormDialog()
    fetchNews()
  } catch (error) {
    showDialog('Gagal kirim berita: ' + (error.response?.data?.message || error.message))
  }
}

function resetForm() {
  title.value = ''
  content.value = ''
  selectedFile.value = null
  previewImage.value = null
  event_date.value = ''
  editingId.value = null
}

function editNews(news) {
  title.value = news.title
  content.value = news.content
  event_date.value = news.event_date
  selectedFile.value = news.image_path
  previewImage.value = getImageUrl(news.image_path)
  editingId.value = news.id
  formDialogVisible.value = true
}

async function confirmDelete(id) {
  const confirm = window.confirm('Yakin ingin menghapus berita ini?')
  if (confirm) {
    try {
      await api.delete(`/news/${id}`)
      showDialog('Berita berhasil dihapus!')
      fetchNews()
    } catch (error) {
      showDialog('Gagal menghapus berita')
    }
  }
}

function showDialog(message) {
  dialogMessage.value = message
  dialogVisible.value = true
}

onMounted(fetchNews)
</script>
