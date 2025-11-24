<template>
  <div class="m-[130px]">
    <div class="flex justify-between items-center mb-4">
      <!-- Filter Type -->
      <el-select v-model="selectedType" placeholder="Filter berdasarkan tipe" @change="handleTypeFilter" class="!w-[200px]">
        <el-option label="Semua" value="" />
        <el-option label="Kehilangan" value="kehilangan" />
        <el-option label="Penemuan" value="penemuan" />
        <el-option label="Iklan" value="iklan" />
      </el-select>

      <el-button type="primary" @click="openFormDialog">+ Tambah Informasi</el-button>
    </div>

    <!-- Table List -->
    <el-table :data="informationList" border>
      <el-table-column prop="type" label="Tipe" />
      <el-table-column prop="title" label="Judul" />
      <el-table-column prop="location" label="Lokasi" />
      <el-table-column prop="contact_person" label="Kontak" />
      <el-table-column label="Aksi">
        <template #default="{ row }">
          <el-button size="small" @click="editInformation(row)">Edit</el-button>
          <el-button size="small" type="danger" @click="deleteInformation(row.id)">Hapus</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="totalItems"
      @current-change="handlePageChange"
      class="mt-4 text-center"
    />

    <!-- Form Dialog -->
    <el-dialog v-model="formDialogVisible" :title="editingId ? 'Edit Informasi' : 'Tambah Informasi'" width="600px">
      <el-form @submit.prevent="submitForm" label-position="top" size="small">
        <el-form-item label="Tipe Informasi" required>
          <el-select v-model="type" placeholder="Pilih tipe informasi">
            <el-option label="Kehilangan" value="kehilangan" />
            <el-option label="Penemuan" value="penemuan" />
            <el-option label="Iklan" value="iklan" />
          </el-select>
        </el-form-item>

        <el-form-item label="Judul" required>
          <el-input v-model="title" placeholder="Masukkan judul" />
        </el-form-item>

        <el-form-item label="Deskripsi" required>
          <el-input type="textarea" v-model="description" placeholder="Masukkan deskripsi" rows="4" />
        </el-form-item>

        <el-form-item label="Lokasi" required>
          <el-input v-model="location" placeholder="Masukkan lokasi kegiatan" />
        </el-form-item>

        <el-form-item label="Kontak Person" required>
          <el-input v-model="contact_person" placeholder="Masukkan kontak person" />
        </el-form-item>

        <el-form-item label="Tanggal Kegiatan (opsional)">
          <el-date-picker v-model="event_date" type="date" value-format="YYYY-MM-DD" placeholder="Pilih tanggal kegiatan" />
        </el-form-item>

        <el-form-item label="Upload Gambar" required>
          <input type="file" @change="handleFileChange" accept="image/*" />
          <div v-if="previewImage" class="mt-2">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../utils/axios';
import { ElMessage } from 'element-plus';

// Form Data
const type = ref('');
const title = ref('');
const description = ref('');
const location = ref('');
const contact_person = ref('');
const event_date = ref('');
const selectedFile = ref<File | null>(null);
const previewImage = ref<string | null>(null);
const editingId = ref<number | null>(null);
const formDialogVisible = ref(false);

// List & Pagination
const informationList = ref([]);
const selectedType = ref('penemuan'); // Default filter: penemuan
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const getImageUrl = (path) => `http://localhost:4000${path}` // sesuaikan dengan backend

// Open/Close Form
const openFormDialog = () => {
  resetForm();
  formDialogVisible.value = true;
};

const closeFormDialog = () => {
  formDialogVisible.value = false;
  resetForm();
};

// Reset form
const resetForm = () => {
  type.value = '';
  title.value = '';
  description.value = '';
  location.value = '';
  contact_person.value = '';
  event_date.value = '';
  selectedFile.value = null;
  previewImage.value = null;
  editingId.value = null;
};

// File handler
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    ElMessage.error('File harus berupa gambar!');
    return;
  }

  if (file.size / 1024 / 1024 >= 2) {
    ElMessage.error('Ukuran gambar harus kurang dari 2MB!');
    return;
  }

  selectedFile.value = file;
  previewImage.value = URL.createObjectURL(file);
};

// Submit form (create/update)
const submitForm = async () => {
  if (!type.value || !title.value || !description.value || !location.value || !contact_person.value || !selectedFile.value) {
    ElMessage.error('Semua field wajib diisi!');
    return;
  }

  const formData = new FormData();
  formData.append('type', type.value);
  formData.append('title', title.value);
  formData.append('description', description.value);
  formData.append('location', location.value);
  formData.append('contact_person', contact_person.value);
  if (event_date.value) {
    formData.append('event_date', event_date.value);
  }
  formData.append('image', selectedFile.value);

  try {
    if (editingId.value) {
      await api.put(`/information/${editingId.value}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      ElMessage.success('Informasi berhasil diperbarui!');
    } else {
      await api.post('/information', formData);
      ElMessage.success('Informasi berhasil ditambahkan!');
    }

    fetchInformation();
    closeFormDialog();
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Gagal mengirim informasi.');
  }
};

// Edit
const editInformation = (info: any) => {
  type.value = info.type;
  title.value = info.title;
  description.value = info.description;
  location.value = info.location;
  contact_person.value = info.contact_person;
  event_date.value = info.event_date;
  previewImage.value = getImageUrl(info.image);
  editingId.value = info.id;
  formDialogVisible.value = true;
};

// Delete
const deleteInformation = async (id: number) => {
  try {
    await api.delete(`/information/${id}`);
    ElMessage.success('Informasi berhasil dihapus');
    fetchInformation();
  } catch (err) {
    ElMessage.error('Gagal menghapus informasi');
  }
};

// Fetch Data
const fetchInformation = async () => {
  try {
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value,
    };

    if (selectedType.value !== '') {
      params.type = selectedType.value;
    }

    const res = await api.get('/information', { params });
    informationList.value = res.data.data;
    totalItems.value = res.data.pagination.totalData;
  } catch (err) {
    ElMessage.error('Gagal memuat data informasi');
  }
};

// Pagination & Filter
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchInformation();
};

const handleTypeFilter = () => {
  currentPage.value = 1;
  fetchInformation();
};

// Initial fetch
onMounted(fetchInformation);
</script>
