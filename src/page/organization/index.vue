<template>
  <el-container style="height: 100vh; padding: 2rem;">
    <el-header style="background-color: #f5f7fa;">
      <h2>Manajemen Organisasi</h2>
    </el-header>

    <el-main>
      <el-row :gutter="20">
        <el-col :span="8">
          <organization-list
            :organizations="organizations"
            :selected-id="selectedOrganizationId"
            @select="handleSelectOrganization"
            @created="fetchOrganizations"
          />
        </el-col>

        <el-col :span="16">
          <organization-structure-editor
            v-if="selectedOrganizationId"
            :organization-id="selectedOrganizationId"
          />
          <div v-else>
            <p>Pilih organisasi untuk mulai edit struktur.</p>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '../../utils/axios';
import 'element-plus/dist/index.css';

import OrganizationList from './components/List.vue';
import OrganizationStructureEditor from './components/Editor.vue';

const organizations = ref([]);
const selectedOrganizationId = ref(null);

const fetchOrganizations = async () => {
  try {
    const res = await axios.get('/organization');
    organizations.value = res.data;
  } catch (err) {
    alert('Gagal ambil data organisasi');
  }
};

const handleSelectOrganization = (id) => {
  selectedOrganizationId.value = id;
};

onMounted(() => {
  fetchOrganizations();
});
</script>
