<template>
  <div>
    <div v-for="(warga, index) in form" :key="index">
      <el-divider>Warga {{ index + 1 }}</el-divider>
      <el-form-item label="NIK">
        <el-input v-model="warga.nik" />
      </el-form-item>
      <el-form-item label="Nama">
        <el-input v-model="warga.nama" />
      </el-form-item>
      <el-form-item label="Jenis Kelamin">
        <el-select v-model="warga.jenis_kelamin">
          <el-option label="Laki-laki" value="LAKI-LAKI" />
          <el-option label="Perempuan" value="PEREMPUAN" />
        </el-select>
      </el-form-item>
      <el-form-item label="Tempat Lahir">
        <el-input v-model="warga.tempat_lahir" />
      </el-form-item>
      <el-form-item label="Tanggal Lahir">
        <el-date-picker v-model="warga.tanggal_lahir" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="Agama">
        <el-input v-model="warga.agama" />
      </el-form-item>
      <el-form-item label="Pendidikan">
        <el-input v-model="warga.pendidikan" />
      </el-form-item>
      <el-form-item label="Pekerjaan">
        <el-input v-model="warga.jenis_pekerjaan" />
      </el-form-item>
      <el-form-item label="Gol. Darah">
        <el-input v-model="warga.golongan_darah" />
      </el-form-item>
      <el-form-item label="Status Perkawinan">
        <el-input v-model="warga.status_perkawinan" />
      </el-form-item>
      <el-form-item label="Tgl Perkawinan">
        <el-date-picker v-model="warga.tanggal_perkawinan" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="Status Hubungan">
        <el-input v-model="warga.status_hubungan_dalam_keluarga" />
      </el-form-item>
      <el-form-item label="Kewarganegaraan">
        <el-input v-model="warga.kewarganegaraan" />
      </el-form-item>
      <el-form-item label="Nama Ayah">
        <el-input v-model="warga.nama_ayah" />
      </el-form-item>
      <el-form-item label="Nama Ibu">
        <el-input v-model="warga.nama_ibu" />
      </el-form-item>
      <el-button type="danger" @click="removeWarga(index)" style="margin-bottom: 1rem">Hapus Warga</el-button>
    </div>
    <el-button type="primary" @click="addWarga">+ Tambah Warga</el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const addWarga = () => {
  form.value.push({
    nik: '', nama: '', jenis_kelamin: '', tempat_lahir: '', tanggal_lahir: '',
    agama: '', pendidikan: '', jenis_pekerjaan: '', golongan_darah: '',
    status_perkawinan: '', tanggal_perkawinan: '', status_hubungan_dalam_keluarga: '',
    kewarganegaraan: '', nama_ayah: '', nama_ibu: ''
  })
}

const removeWarga = (index) => {
  form.value.splice(index, 1)
}
</script>
