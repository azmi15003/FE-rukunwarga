<template>
  <div class="document-page my-[120px]">
    <el-card shadow="never" class="action-card">
      <el-row :gutter="20">
        <el-col :span="12">
          <h2>Manajemen Dokumen</h2>
          <p>Buat tipe dokumen dan unggah file Anda.</p>
        </el-col>
        <el-col :span="12" class="action-buttons">
          <el-button @click="createTypeDialogVisible = true">Tambah Tipe Dokumen</el-button>
          <el-button type="primary" @click="openUploadDialog">Unggah Dokumen</el-button>
        </el-col>
      </el-row>
    </el-card>

    <div class="filter-section">
      <el-select v-model="selectedFilterTypeId" placeholder="Saring berdasarkan Tipe" style="width: 200px;" @change="handleFilterChange">
        <el-option label="Semua Tipe" value="" />
        <el-option
          v-for="type in documentTypes"
          :key="type.id"
          :label="type.name"
          :value="type.id"
        />
      </el-select>
    </div>

    <el-table :data="documentList" v-loading="loadingDocuments" style="width: 100%; margin-top: 20px" border>
      <el-table-column type="index" label="No" width="80" />
      <el-table-column prop="type_name" label="Tipe Dokumen" width="220" />
      <el-table-column prop="title" label="Dokumen">
        <template #default="scope">
          <el-link v-if="scope.row.file_path" type="primary" :href="API_BASE_URL + scope.row.file_path" target="_blank">{{ scope.row.title }}</el-link>
          <span v-else>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Aksi" width="120">
        <template #default="scope">
          <el-button link type="danger" @click="handleDeleteDocument(scope.row.id)">Hapus</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-controls" style="margin-top: 20px; text-align: center;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pagination.totalData"
        :page-size="pagination.limit"
        :current-page="pagination.currentPage"
        @current-change="handlePageChange"
      />
    </div>


    <el-dialog v-model="createTypeDialogVisible" title="Buat Tipe Dokumen Baru" width="30%" @closed="newTypeFormRef?.resetFields()">
      <el-form :model="newTypeForm" ref="newTypeFormRef" :rules="typeRules" label-position="top">
        <el-form-item label="Nama Tipe" prop="name">
          <el-input v-model="newTypeForm.name" placeholder="Contoh: Invoice, Kontrak, dll." />
        </el-form-item>
        <el-form-item label="Deskripsi" prop="description">
          <el-input v-model="newTypeForm.description" type="textarea" :rows="3" placeholder="Deskripsi opsional untuk tipe dokumen" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createTypeDialogVisible = false">Batal</el-button>
          <el-button type="primary" @click="handleCreateType">Simpan</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="uploadDialogVisible" title="Unggah Dokumen" width="40%" @closed="resetUploadForm">
      <el-form :model="uploadForm" ref="uploadFormRef" :rules="uploadRules" label-position="top">
        <el-form-item label="Judul Dokumen" prop="title">
          <el-input v-model="uploadForm.title" placeholder="Masukkan judul dokumen" />
        </el-form-item>
        <el-form-item label="Isi Dokumen" prop="content">
          <el-input v-model="uploadForm.content" type="textarea" :rows="4" placeholder="Masukkan isi/ringkasan dokumen" />
        </el-form-item>
        <el-form-item label="Pilih Tipe Dokumen" prop="typeId">
          <el-select v-model="uploadForm.typeId" placeholder="Pilih tipe" style="width: 100%">
            <el-option
              v-for="item in documentTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Pilih File" prop="fileList">
          <el-upload
            ref="uploadRef"
            v-model:file-list="uploadForm.fileList"
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <template #trigger>
              <el-button type="primary">Pilih File</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                Hanya satu file yang dapat diunggah pada satu waktu. Maks 5MB. Diizinkan: JPEG, JPG, PNG, PDF, DOC, DOCX, TXT.
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">Batal</el-button>
          <el-button type="primary" @click="submitUpload">Unggah</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from '@/utils/axios'

// --- Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_URL

// --- Refs untuk Visibilitas Dialog ---
const createTypeDialogVisible = ref(false);
const uploadDialogVisible = ref(false);

// --- State dan Logika untuk Membuat Tipe Dokumen ---
const newTypeFormRef = ref(null);
const newTypeForm = reactive({ name: '', description: '' });
const documentTypes = ref([]); // Sekarang diambil dari API

const typeRules = {
  name: [{ required: true, message: 'Nama tipe wajib diisi', trigger: 'blur' }],
};

// Fungsi untuk mengambil tipe dokumen dari API
const fetchDocumentTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/types`);
    documentTypes.value = response.data.types;
  } catch (error) {
    console.error('Error fetching document types:', error);
    ElMessage.error('Gagal memuat tipe dokumen.');
  }
};

const handleCreateType = async () => {
  if (!newTypeFormRef.value) return;
  try {
    await newTypeFormRef.value.validate(); // Validasi formulir

    await axios.post(`${API_BASE_URL}/api/types`, {
      name: newTypeForm.name,
      description: newTypeForm.description,
    });

    ElMessage.success(`Tipe "${newTypeForm.name}" berhasil dibuat!`);
    createTypeDialogVisible.value = false;
    newTypeForm.name = ''; // Bersihkan formulir
    newTypeForm.description = ''; // Bersihkan formulir
    fetchDocumentTypes(); // Ambil ulang tipe untuk memperbarui dropdown
  } catch (error) {
    console.error('Error creating type:', error);
    if (error.response && error.response.data && error.response.data.message) {
      ElMessage.error(`Error membuat tipe: ${error.response.data.message}`);
    } else {
      ElMessage.error('Gagal membuat tipe. Silakan coba lagi.');
    }
  }
};

// --- State dan Logika untuk Mengunggah Dokumen ---
const uploadFormRef = ref(null);
const uploadRef = ref(null); // Ref untuk komponen ElUpload
const uploadForm = reactive({
  title: '',
  content: '',
  typeId: '',
  fileList: [], // Untuk ElUpload v-model
});

const uploadRules = {
  title: [{ required: true, message: 'Judul dokumen wajib diisi', trigger: 'blur' }],
  content: [{ required: true, message: 'Isi dokumen wajib diisi', trigger: 'blur' }],
  typeId: [{ required: true, message: 'Harap pilih tipe dokumen', trigger: 'change' }],
  fileList: [{ type: 'array', required: true, message: 'Harap pilih file untuk diunggah', trigger: 'change', min: 1 }],
};

const openUploadDialog = () => {
  // Pastikan tipe sudah dimuat sebelum membuka dialog unggah
  if (documentTypes.value.length === 0) {
    ElMessage.warning('Harap buat tipe dokumen terlebih dahulu sebelum mengunggah dokumen.');
    return;
  }
  uploadDialogVisible.value = true;
};

const resetUploadForm = () => {
  uploadForm.title = '';
  uploadForm.content = '';
  uploadForm.typeId = '';
  uploadForm.fileList = [];
  uploadRef.value?.clearFiles(); // Bersihkan file dari komponen ElUpload
  uploadFormRef.value?.resetFields(); // Reset status validasi
};

const submitUpload = async () => {
  if (!uploadFormRef.value) return;
  try {
    await uploadFormRef.value.validate(); // Validasi formulir

    const file = uploadForm.fileList[0]?.raw; // Dapatkan objek File mentah dari fileList ElUpload

    if (!file) {
      ElMessage.error('Harap pilih file untuk diunggah.');
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('content', uploadForm.content);
    formData.append('typeId', uploadForm.typeId);
    formData.append('documentFile', file); // 'documentFile' sesuai dengan nama field Multer backend Anda

    await axios.post(`${API_BASE_URL}/api/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Penting untuk unggah file
      },
    });

    ElMessage.success(`Dokumen "${uploadForm.title}" berhasil diunggah!`);
    uploadDialogVisible.value = false;
    fetchAndRenderDocuments(); // Ambil ulang dokumen
  } catch (error) {
    console.error('Error uploading document:', error);
    if (error.response && error.response.data && error.response.data.message) {
      ElMessage.error(`Error mengunggah dokumen: ${error.response.data.message}`);
    } else {
      ElMessage.error('Gagal mengunggah dokumen. Silakan coba lagi.');
    }
  }
};

const handleExceed = (files) => {
  uploadRef.value.clearFiles();
  const file = files[0];
  uploadRef.value.handleStart(file);
};

// --- State untuk Tabel Dokumen ---
const documentList = ref([]);
const loadingDocuments = ref(false); // Status loading untuk tabel

// State Paginasi
const pagination = reactive({
  totalData: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 10, // Sesuai dengan batas default backend Anda
});

// State Filter
const selectedFilterTypeId = ref('');

// --- Logika untuk Mengambil dan Menghapus Dokumen ---
const fetchAndRenderDocuments = async () => {
  loadingDocuments.value = true;
  try {
    const params = {
      page: pagination.currentPage,
      limit: pagination.limit,
    };
    if (selectedFilterTypeId.value) {
      params.typeId = selectedFilterTypeId.value;
    }

    const response = await axios.get(`${API_BASE_URL}/api/documents`, { params });
    documentList.value = response.data.data;
    pagination.totalData = response.data.pagination.totalData;
    pagination.totalPages = response.data.pagination.totalPages;
    pagination.currentPage = response.data.pagination.currentPage;
  } catch (error) {
    console.error('Error fetching documents:', error);
    ElMessage.error('Gagal memuat dokumen.');
    documentList.value = []; // Bersihkan daftar saat terjadi error
  } finally {
    loadingDocuments.value = false;
  }
};

const handleDeleteDocument = (id) => {
  ElMessageBox.confirm(
    'Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan.',
    'Peringatan',
    {
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/documents/${id}`);
      ElMessage.success('Dokumen berhasil dihapus!');
      // Reset ke halaman pertama jika halaman saat ini menjadi kosong setelah penghapusan
      if (documentList.value.length === 1 && pagination.currentPage > 1) {
        pagination.currentPage--;
      }
      fetchAndRenderDocuments(); // Ambil ulang dokumen
    } catch (error) {
      console.error('Error deleting document:', error);
      if (error.response && error.response.data && error.response.data.message) {
        ElMessage.error(`Error menghapus dokumen: ${error.response.data.message}`);
      } else {
        ElMessage.error('Gagal menghapus dokumen. Silakan coba lagi.');
      }
    }
  }).catch(() => {
    ElMessage.info('Penghapusan dibatalkan.');
  });
};

// --- Handler Paginasi dan Filter ---
const handlePageChange = (newPage) => {
  pagination.currentPage = newPage;
  fetchAndRenderDocuments();
};

const handleFilterChange = () => {
  pagination.currentPage = 1; // Reset ke halaman pertama saat filter berubah
  fetchAndRenderDocuments();
};

// --- Hook Siklus Hidup ---
onMounted(() => {
  fetchDocumentTypes(); // Muat tipe saat komponen dimuat
  fetchAndRenderDocuments(); // Muat dokumen saat komponen dimuat
});
</script>

<style scoped>
.document-page {
  padding: 20px;
}
.action-card {
  border: none;
  background-color: #f9fafb;
  margin-bottom: 20px;
}
.action-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}
.dialog-footer {
  text-align: right;
}
.filter-section {
  margin-top: 20px;
  margin-bottom: 20px;
}
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-upload__tip {
  margin-top: 5px;
  font-size: 0.85em;
  color: #909399;
}
</style>