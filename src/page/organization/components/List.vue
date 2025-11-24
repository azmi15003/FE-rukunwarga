<template>
  <div>
    <h3>Daftar Organisasi</h3>
    <el-radio-group v-model="selected" @change="onSelect">
      <el-radio
        v-for="org in organizations"
        :key="org.id"
        :label="org.id"
        style="display: block; margin: 5px 0;"
      >
        {{ org.name }} ({{ org.type }})
      </el-radio>
    </el-radio-group>

    <hr />

    <h4>Buat Organisasi Baru</h4>
    <el-form @submit.prevent="submitForm" :model="form" label-position="top">
      <el-form-item label="Tipe Organisasi" :rules="[{ required: true, message: 'Pilih tipe' }]">
        <el-select v-model="form.type" placeholder="Pilih tipe organisasi">
          <el-option label="RW" value="rw" />
          <el-option label="Karang Taruna" value="karang taruna" />
          <el-option label="Lainnya" value="lainnya" />
        </el-select>
      </el-form-item>

      <el-form-item label="Nama Organisasi" :rules="[{ required: true, message: 'Isi nama' }]">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-button type="primary" native-type="submit" :loading="loading">Buat Organisasi</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import axios from '../../../utils/axios';

const props = defineProps({
  organizations: Array,
  selectedId: Number
});
const emit = defineEmits(['select', 'created']);

const selected = ref(props.selectedId || null);

watch(() => props.selectedId, (val) => {
  selected.value = val;
});

const form = reactive({
  type: '',
  name: ''
});

const loading = ref(false);

const submitForm = async () => {
  if (!form.type || !form.name) {
    alert('Tipe dan nama harus diisi');
    return;
  }
  loading.value = true;
  try {
    const res = await axios.post('/organization', form);
    alert(`Organisasi berhasil dibuat: ${res.data.name} (ID: ${res.data.id})`);
    form.type = '';
    form.name = '';
    emit('created');
    emit('select', res.data.id);
  } catch (err) {
    alert('Gagal membuat organisasi');
  } finally {
    loading.value = false;
  }
};

const onSelect = (val) => {
  emit('select', val);
};
</script>
