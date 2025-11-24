<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Edit Struktur Organisasi</h2>

    <el-button type="primary" class="mb-4" @click="addRootNode">
      + Tambah Node Root
    </el-button>

    <div v-if="!treeData">
      <p>Belum ada struktur organisasi, mulai buat sekarang.</p>
    </div>

    <div v-else>
      <OrganizationNode v-model="treeData" :token="token" />
    </div>

    <el-button type="success" class="mt-4" @click="submitStructure">
      Simpan Struktur
    </el-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import OrganizationNode from './Node.vue';
import axios from '../../../utils/axios';
import { ElMessage } from 'element-plus';

const props = defineProps({
  organizationId: {
    type: Number,
    required: true,
  },
});

const token = localStorage.getItem('token');
const treeData = ref(null);

const ensureChildrenField = (node) => {
  if (!node.children) node.children = [];
  node.children.forEach(ensureChildrenField);
};

const fetchStructure = async () => {
  try {
    const res = await axios.get('/organization-nodes', {
      params: { organizationId: props.organizationId },
    });
    if (res.data && Object.keys(res.data).length > 0) {
      ensureChildrenField(res.data);
      treeData.value = res.data;
    } else {
      treeData.value = null;
    }
  } catch (err) {
    ElMessage.error('Gagal mengambil data struktur organisasi.');
  }
};

const addRootNode = () => {
  if (treeData.value) {
    ElMessage.warning('Root node sudah ada');
    return;
  }
  treeData.value = {
    key: 'root',
    type: 'person',
    data: {
      name: '',
      title: '',
      image: '',
    },
    children: [],
  };
};

const submitStructure = async () => {
  if (!treeData.value) {
    ElMessage.warning('Belum ada struktur organisasi untuk disimpan');
    return;
  }
  try {
    await axios.post(
      '/organization-nodes',
      {
        organizationId: props.organizationId,
        tree: treeData.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    ElMessage.success('Struktur berhasil disimpan');
  } catch (err) {
    ElMessage.error('Gagal menyimpan struktur');
  }
};

watch(
  () => props.organizationId,
  () => {
    fetchStructure();
  },
  { immediate: true }
);
</script>

<style scoped>
</style>
