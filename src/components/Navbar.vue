<template>
  <header
    :class="[
      'fixed top-0 left-0 w-full z-50 transition-colors duration-300',
      scrolled || route.name !== 'Home' ? 'bg-white shadow-md border-b border-gray-300' : 'bg-transparent'
    ]"
  >
    <nav
      class="container mx-auto flex items-center justify-between px-6 py-5 text-sm font-semibold transition-colors duration-300 text-black"
      :class="scrolled || route.name !== 'Home' ? 'text-gray-900' : 'text-white'"
    >
      <!-- Hilangkan bagian info kiri atas -->

      <el-menu
        mode="horizontal"
        :default-active="route.path"
        :background-color="scrolled || route.name !== 'Home' ? '#ffffff' : 'transparent'"
        :text-color="scrolled || route.name !== 'Home' ? '#4a5568' : '#ffffff'"
        :active-text-color="scrolled || route.name !== 'Home' ? '#3182ce' : '#63b3ed'"
        class="flex-grow justify-center"
        router
      >
        <el-menu-item index="/">HOME</el-menu-item>

        <el-sub-menu index="profil-rw">
          <template #title>PROFIL RW</template>
          <el-menu-item index="/organization">Struktur Organisasi</el-menu-item>
          <el-menu-item :index="{ path: '/', hash: '#tugas-fungsi' }">Tugas & Fungsi</el-menu-item>
          <el-menu-item :index="{ path: '/', hash: '#jumlah-penduduk' }">Jumlah Penduduk</el-menu-item>
          <el-menu-item index="/profil-rw/lokasi-kode-pos">Lokasi dan Kode Pos</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/berita">BERITA KEGIATAN</el-menu-item>

        <el-sub-menu index="layanan">
          <template #title>LAYANAN</template>
          <el-menu-item index="/warga/rt-1">RT-01</el-menu-item>
          <el-menu-item index="/warga/rt-2">RT-02</el-menu-item>
          <el-menu-item index="/warga/rt-3">RT-03</el-menu-item>
          <el-menu-item index="/warga/rt-4">RT-04</el-menu-item>
          <el-menu-item index="/warga/rt-5">RT-05</el-menu-item>
          <el-menu-item index="/layanan/posyandu">Posyandu</el-menu-item>
          <el-menu-item index="/layanan/karang-taruna">Karang Taruna</el-menu-item>
          <el-menu-item index="/layanan/dkm-masjid">DKM Masjid</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/mitra">MITRA</el-menu-item>
        <el-menu-item index="/regulasi">REGULASI</el-menu-item>
        <el-menu-item index="/potensi">POTENSI</el-menu-item>
        <el-menu-item index="/galery">GALERY</el-menu-item>

        <el-sub-menu index="info">
          <template #title>INFO</template>
          <el-menu-item index="/info/kehilangan">Kehilangan</el-menu-item>
          <el-menu-item index="/info/penemuan">Penemuan</el-menu-item>
          <el-menu-item index="/info/iklan">Iklan</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/kontak">KONTAK</el-menu-item>

        <el-sub-menu v-if="authStore.isAuthenticated" index="content">
          <template #title>CONTENT</template>
          <el-menu-item index="/konten/berita">KEGIATAN</el-menu-item>
          <el-menu-item index="/konten/organisasi">ORGANISASI</el-menu-item>
          <el-menu-item index="/konten/warga">DATA WARGA</el-menu-item>
          <el-menu-item index="/konten/banner">BANNER</el-menu-item>
          <el-menu-item index="/konten/informasi">INFORMASI</el-menu-item>
          <el-menu-item index="/konten/dokumen">DOKUMEN</el-menu-item>
        </el-sub-menu>

        <el-menu-item v-if="!authStore.isAuthenticated" index="/login">LOGIN</el-menu-item>
        <el-sub-menu v-else index="logout">
          <template #title>{{ authStore?.user?.username }}</template>
          <el-menu-item @click="handleLogout" index="/">LOGOUT</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/authStore'

const scrolled = ref(false)
const route = useRoute()
const authStore = useAuthStore()

function handleScroll() {
  scrolled.value = window.scrollY > 50
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.el-menu {
  flex-grow: 1;
  justify-content: center;
}
.el-menu--horizontal .el-menu .el-menu-item, .el-menu--horizontal .el-menu .el-sub-menu__title {
  color: black;
}
</style>
