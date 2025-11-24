<template>
  <el-card class="m-[130px] max-w-2xl mx-auto">
    <el-form :model="form" ref="formRef" label-width="180px" @submit.prevent="submitForm" :rules="rules">
      <el-form-item label="No KK" prop="no_kk">
        <el-input v-model="form.no_kk" placeholder="Masukkan Nomor KK" />
      </el-form-item>

      <el-form-item label="RT" prop="rt">
        <el-select v-model="form.rt" placeholder="Pilih RT">
          <el-option label="RT 1" value="1" />
          <el-option label="RT 2" value="2" />
          <el-option label="RT 3" value="3" />
          <el-option label="RT 4" value="4" />
          <el-option label="RT 5" value="5" />
        </el-select>
      </el-form-item>

      <el-form-item label="Nama" prop="nama">
        <el-input v-model="form.nama" />
      </el-form-item>

      <el-form-item label="Tanggal Lahir" prop="tanggal_lahir">
        <el-date-picker
          v-model="form.tanggal_lahir"
          type="date"
          placeholder="Pilih tanggal lahir"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="Jenis Kelamin" prop="jenis_kelamin">
        <el-select v-model="form.jenis_kelamin" placeholder="Pilih jenis kelamin">
          <el-option label="Laki-Laki" value="Laki-Laki" />
          <el-option label="Perempuan" value="Perempuan" />
        </el-select>
      </el-form-item>

      <el-form-item label="Hubungan Keluarga" prop="hubungan_keluarga">
        <el-select v-model="form.hubungan_keluarga" placeholder="Pilih hubungan keluarga">
          <el-option label="Kepala Keluarga" value="kepala_keluarga" />
          <el-option label="Suami" value="suami" />
          <el-option label="Istri" value="istri" />
          <el-option label="Anak" value="anak" />
          <el-option label="Menantu" value="menantu" />
          <el-option label="Mertua" value="mertua" />
          <el-option label="Pembantu" value="pembantu" />
          <el-option label="Lainnya" value="other" />
        </el-select>
      </el-form-item>

      <el-form-item label="Pekerjaan" prop="pekerjaan">
        <el-input v-model="form.pekerjaan" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">Simpan Data Warga</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/utils/axios'

const formRef = ref(null)
const form = ref({
  no_kk: '',
  rt: '',
  nama: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  hubungan_keluarga: '',
  pekerjaan: ''
})

const rules = {
  no_kk: [{ required: true, message: 'Nomor KK wajib diisi', trigger: 'blur' }],
  rt: [{ required: true, message: 'RT wajib dipilih', trigger: 'change' }],
  nama: [{ required: true, message: 'Nama wajib diisi', trigger: 'blur' }],
  tanggal_lahir: [{ required: true, message: 'Tanggal lahir wajib diisi', trigger: 'change' }],
  jenis_kelamin: [{ required: true, message: 'Jenis kelamin wajib dipilih', trigger: 'change' }],
  hubungan_keluarga: [{ required: true, message: 'Hubungan keluarga wajib dipilih', trigger: 'change' }],
  pekerjaan: [{ required: true, message: 'Pekerjaan wajib diisi', trigger: 'blur' }]
}

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      await api.post('/warga', form.value)
      alert('Data warga berhasil disimpan!')
      // reset form
      form.value = {
        no_kk: '',
        rt: '',
        nama: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        hubungan_keluarga: '',
        pekerjaan: ''
      }
    } catch (error) {
      alert('Gagal menyimpan data warga')
      console.error(error)
    }
  })
}
</script>
