<template>
    <footer class="relative bg-gray-900 bg-opacity-90 text-white py-16 px-8">
      <div class="container mx-auto flex flex-col md:flex-row gap-16">
        <!-- Form Kontak -->
        <div class="md:w-1/2 space-y-6">
          <h2 class="text-2xl font-bold uppercase tracking-wide mb-6 text-center md:text-left">
            Hubungi Kami
          </h2>
  
          <el-form ref="formRef" :model="form" label-position="top" size="small" class="space-y-6">
            <el-form-item label="Nama (* wajib diisi)" prop="name" :rules="[{ required: true, message: 'Nama wajib diisi', trigger: 'blur' }]">
              <el-input v-model="form.name" placeholder="Masukkan nama" />
            </el-form-item>
  
            <el-form-item label="Email (* wajib diisi)" prop="email" :rules="[{ required: true, type: 'email', message: 'Email tidak valid', trigger: 'blur' }]">
              <el-input v-model="form.email" placeholder="Masukkan email" />
            </el-form-item>
  
            <el-form-item label="Judul" prop="subject">
              <el-input v-model="form.subject" placeholder="Masukkan judul" />
            </el-form-item>
  
            <el-form-item label="Isi Pesan" prop="message">
              <el-input type="textarea" rows="6" v-model="form.message" placeholder="Tulis pesan" />
            </el-form-item>
  
            <el-form-item>
              <el-button type="primary" @click="submitForm">Kirim</el-button>
            </el-form-item>
          </el-form>
        </div>
  
        <!-- Info Kontak + Map -->
        <div class="md:w-1/2 space-y-6 text-gray-200">
          <h2 class="text-2xl font-bold uppercase tracking-wide mb-6 text-center md:text-left text-white">
            Info Lokasi
          </h2>
  
          <ul class="space-y-4">
            <li class="flex items-center space-x-3">
              <el-icon><Folder /></el-icon>
              <span>asep.sholahuddin@gmail.com</span>
            </li>
            <li class="flex items-center space-x-3">
              <el-icon><Location /></el-icon>
              <span>Alamat : JL. Swadaya Raya No.145 RT005/RW002, Jatibening Baru</span>
            </li>
            <li class="flex items-center space-x-3">
              <el-icon><Phone /></el-icon>
              <span>Telp : 089643514942</span>
            </li>
            <li class="flex items-center space-x-3">
              <el-icon><ChatLineSquare /></el-icon>
              <span>WhatsApp : 089643514942</span>
            </li>
          </ul>
  
          <!-- Google Map Embed -->
          <div class="w-full h-64 rounded overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.424644534762!2d107.67543481477626!3d-6.893203399999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68dd7ae11bac9f%3A0x27a553518ab7a629!2sKomp.%20Bukit%20Padjajaran%2C%20Jl.%20Pasir%20Impun%20No.7%2C%20Pasir%20Impun%2C%20Kec.%20Mandalajati%2C%20Kota%20Bandung%2C%20Jawa%20Barat%2040195!5e0!3m2!1sen!2sid!4v1684758721234!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { ElForm, ElFormItem, ElInput, ElButton, ElIcon } from 'element-plus'
  import { Clock, Location, Phone, ChatLineSquare } from '@element-plus/icons-vue'
  
  export default {
    name: 'FooterContact',
    components: {
      ElForm,
      ElFormItem,
      ElInput,
      ElButton,
      ElIcon,
      Clock,
      Location,
      Phone,
      ChatLineSquare
    },
    data() {
      return {
        form: {
          name: '',
          email: '',
          subject: '',
          message: ''
        }
      }
    },
    methods: {
      submitForm() {
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            console.log('Form submitted:', this.form)
            // Tambahkan logika kirim data ke server
          } else {
            console.log('Validation failed')
            return false
          }
        })
      }
    }
  }
  </script>
  
  <style scoped>
  /* Tambah styling jika perlu */
  ::v-deep .el-form-item__label {
    color: white;
  }
  </style>
  