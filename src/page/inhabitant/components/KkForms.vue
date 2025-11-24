<template>
  <el-form label-width="180px">
    <el-form-item label="No KK">
      <el-input v-model="form.no_kk" />
    </el-form-item>
    <el-form-item label="Nama Kepala Keluarga">
      <el-input v-model="form.nama_kepala_keluarga" />
    </el-form-item>
    <el-form-item label="Alamat">
      <el-input v-model="form.alamat" />
    </el-form-item>
    <el-form-item label="RT">
      <el-input v-model="form.rt" />
    </el-form-item>
    <el-form-item label="RW">
      <el-input v-model="form.rw" />
    </el-form-item>
    <el-form-item label="Kode Pos">
      <el-input v-model="form.kode_pos" />
    </el-form-item>
    <el-form-item label="Desa">
      <el-input v-model="form.desa" />
    </el-form-item>
    <el-form-item label="Kecamatan">
      <el-input v-model="form.kecamatan" />
    </el-form-item>
    <el-form-item label="Kabupaten">
      <el-input v-model="form.kabupaten" />
    </el-form-item>
    <el-form-item label="Provinsi">
      <el-input v-model="form.provinsi" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

