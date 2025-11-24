<template>
  <div class="p-[120px]">
    <div class="mb-4">
      <el-select
        v-model="selectedType"
        placeholder="Pilih tipe organisasi"
        @change="handleSelect"
        class="w-80"
      >
        <el-option
          v-for="(organization, idx) in listOrganization"
          :key="idx"
          :label="organization.name"
          :value="organization.id"
        />
      </el-select>
    </div>

    <OrganizationChart
      v-if="dataStructure"
      v-model:selectionKeys="selection"
      :value="dataStructure" 
      collapsible
      selectionMode="multiple"
    >
      <template #person="slotProps">
        <div class="flex flex-col items-center">
          <el-image
            :src="getImageUrl(slotProps.node.data.image)"
            :preview-src-list="[getImageUrl(slotProps.node.data.image)]"
            fit="cover"
            class="mb-2 w-16 h-16 rounded-full border"
        />
          <span class="font-bold">{{ slotProps.node.data.name }}</span>
          <span class="text-sm text-gray-500">{{ slotProps.node.data.title }}</span>
        </div>
      </template>

      <template #default="slotProps">
        <span>{{ slotProps?.node?.label }}</span>
      </template>
    </OrganizationChart>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "../utils/axios"; // pastikan baseURL kamu benar
import OrganizationChart from "primevue/organizationchart";

// State
const selectedType = ref(null);
const listOrganization = ref([]);
const dataStructure = ref(null);
const selection = ref({});

// Fetch daftar organisasi
const fetchOrganizations = async () => {
  try {
    const res = await axios.get("/organization");
    listOrganization.value = res.data;
  } catch (err) {
    alert("Gagal ambil data organisasi");
  }
};

// Handle select dropdown
const handleSelect = (id) => {
  fetchStructure(id);
};

// Fix children node yang kosong
const ensureChildrenArray = (node) => {
  if (!node) return null;

  if (!node.children) {
    node.children = [];
  } else {
    node.children = node.children.map(ensureChildrenArray);
  }

  return node;
};

// Fetch struktur organisasi
const fetchStructure = async (organizationId) => {
  try {
    const res = await axios.get("/organization-nodes", {
      params: { organizationId },
    });
    if (res.data && Object.keys(res.data).length > 0) {
      dataStructure.value = ensureChildrenArray(res.data);
      console.log(dataStructure.value, 'structure')
    } else {
      dataStructure.value = null;
    }
  } catch (err) {
    alert("Gagal ambil struktur organisasi");
  }
};

// Generate image URL
const getImageUrl = (path) =>
  `${import.meta.env.VITE_FILES_URL}${path}`;

// On mount
onMounted(() => {
  fetchOrganizations();
});
</script>

<style scoped>
/* Optional: styling tambahan */
</style>
