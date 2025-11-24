<template>
  <div class="box">
    <el-form-item label="Tipe Node">
      <el-select v-model="node.type" placeholder="Pilih Tipe">
        <el-option label="Person" value="person" />
        <el-option label="Label" value="label" />
      </el-select>
    </el-form-item>

    <template v-if="node.type === 'person'">
      <el-form-item label="Nama">
        <el-input v-model="node.data.name" />
      </el-form-item>

      <el-form-item label="Jabatan">
        <el-input v-model="node.data.title" />
      </el-form-item>

      <!-- Upload gambar -->
      <el-form-item label="Upload Gambar">
        <el-upload
            class="upload-demo"
            :http-request="customUpload"
            :headers="authHeaders"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-error="handleUploadError"
            accept="image/*"
        >
            <el-button size="small" type="primary">Upload Gambar</el-button>
        </el-upload>

        <div v-if="node.data.image" style="margin-top: 8px;">
            <img
                :src="getImageUrl(node.data.image)"
                alt="Preview"
                style="max-width: 120px; max-height: 120px; border-radius: 5px;"
            />
        </div>
        </el-form-item>
    </template>

    <template v-else>
      <el-form-item label="Label">
        <el-input v-model="node.label" />
      </el-form-item>
    </template>

    <div class="child-section">
      <el-button size="small" @click="addChild">+ Tambah Anak</el-button>

      <div v-for="(child, i) in node.children" :key="child.key" style="margin-top: 1rem;">
        <OrganizationNode v-model="node.children[i]" />
        <el-button
          type="danger"
          size="small"
          class="mt-5"
          @click="removeChild(i)"
          style="margin-top: 0.5rem;"
        >
          Hapus Anak
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import axios from '../../../utils/axios';
import OrganizationNode from './Node.vue';

const props = defineProps({
  modelValue: Object,
  token: String,
});
const emit = defineEmits(['update:modelValue']);

const node = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const authHeaders = props.token
  ? { Authorization: `Bearer ${props.token}` }
  : {};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isImage) {
    ElMessage.error('File harus berupa gambar!');
  }
  if (!isLt2M) {
    ElMessage.error('Ukuran gambar harus kurang dari 2MB!');
  }
  return isImage && isLt2M;
};

const getImageUrl = (path) => {
    return `http://localhost:4000${path}`
}

const handleUploadError = () => {
  ElMessage.error('Upload gagal');
};

const addChild = () => {
  if (!node.value.children) {
    node.value.children = [];
  }
  node.value.children.push({
    key: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    type: 'person',
    data: {
      name: '',
      title: '',
      image: ''
    },
    children: []
  });
};

const removeChild = (index) => {
  node.value.children.splice(index, 1);
};

// ✅ Custom Upload Function
const customUpload = async ({ file }) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(
      '/organization-nodes/upload-image',
      formData,
      {
        headers: {
          ...authHeaders,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const imageUrl = response.data.path || response.data.url;

    if (imageUrl) {
      node.value.data.image = imageUrl;
      ElMessage.success('Upload berhasil!');
    } else {
      ElMessage.error('Path gambar tidak ditemukan di respons.');
    }
  } catch (err) {
    ElMessage.error('Terjadi kesalahan saat upload.');
  }
};

</script>

<style scoped>
.box {
  border: 1px solid #dcdfe6;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  background-color: #fafafa;
}
.child-section {
  margin-left: 1rem;
  border-left: 2px dashed #dcdfe6;
  padding-left: 1rem;
}
</style>
