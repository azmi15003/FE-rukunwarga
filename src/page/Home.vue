<template>
  <div>
    <section
      class="relative h-[500px] flex flex-col justify-center items-center text-white px-4"
      :style="{
        backgroundImage: bannerImage ? `url(${getImageUrl(bannerImage)})` : ``,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>

      <div class="relative z-10 text-center max-w-xl">
        <h1 class="text-5xl font-semibold mb-3 tracking-wide">RUKUN WARGA 13</h1>
        <p class="mb-6 text-lg tracking-wide">KOMPLEK BUKIT PADJADJARAN JL PASIRIMPUN SUKAMISKIN</p>
      </div>
    </section>

    <!-- Tentang Kami -->
    <section class="container mx-auto px-40 py-16">
      <h2 class="text-center text-3xl font-bold mb-12 uppercase tracking-widest text-gray-900">
        TENTANG KAMI
      </h2>
      <div class="flex flex-col md:flex-row gap-16">
        <div class="md:w-1/2 space-y-10 text-gray-700">
          <div>
            <h3 class="font-bold text-lg mb-3">Lingkungan</h3>
            <p class="border-l-4 border-orange-400 pl-5">
              RW 013 adalah lingkungan yang berada di wilayah Kelurahan Cikadut, Kecamatan Cimenyan, Kabupaten Bandung. Memiliki wilayah yang terdiri dari ±9000 m2 luas tanah warga dan ±781 m2 luas jalan lingkungan. Terdapat ±302 KK dengan jumlah penduduk kurang lebih 1131 Jiwa.
            </p>
          </div>

          <div>
            <h3 class="font-bold text-lg mb-3">Visi & Misi RW 13</h3>
            <div class="mb-6">
              <h4 class="font-semibold mb-1">Visi</h4>
              <p class="border-l-4 border-orange-400 pl-5">Menjadi Lingkungan yang Bersih, Indah dan Beriman</p>
            </div>
            <div>
              <h4 class="font-semibold mb-2">Misi</h4>
              <ul class="list-disc list-inside border-l-4 border-orange-400 pl-5 space-y-2">
                <li>Menjaga kerukunan antar warga dengan meningkatkan silaturahmi</li>
                <li>Meningkatkan kepedulian sosial antar warga</li>
                <li>Meningkatkan kepedulian terhadap lingkungan tempat tinggal</li>
                <li>Bersama seluruh warga menjaga keamanan, ketertiban, kebersihan untuk menciptakan lingkungan yang Aman Sehat</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="md:w-1/2 flex justify-center items-center">
          <img
            :src="getImageUrl(bannerImage || '')"
            alt="Peta Lingkungan"
            class="rounded shadow-lg max-w-full h-auto"
          />
        </div>
      </div>
    </section>
    <section id="tugas-fungsi" class="h-[600px] flex items-center" style="background-color: #FFD966; color: #333333;">
			<div class="container mx-auto">
				<h2 class="text-center text-3xl font-bold mb-12 uppercase tracking-widest">
					TUGAS DAN FUNGSI
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div class="flex items-start space-x-4">
						<i class="pi pi-user" style="font-size: 2.5rem"></i>
						<div>
							<h3 class="text-xl font-semibold mb-2">Administratif Warga</h3>
							<p>
								Membuat Aturan Tata tertib, Pendataan Warga Tetap dan Tidak Tetap,
								Pencatatan Pindah Alamat dan Kependudukan, Pencatatan Warga yang
								Meninggal Dunia, Membuat Agenda Lingkungan.
							</p>
						</div>
					</div>

					<div class="flex items-start space-x-4">
						<i class="pi pi-hourglass" style="font-size: 2.5rem"></i>
						<div>
							<h3 class="text-xl font-semibold mb-2">Pelayanan Warga</h3>
							<p>
								Pengurusan Permintaan Surat Pengantar, Ubah Kartu Keluarga,
								Pengurusan Akta Kelahiran dan Kematian, Membuat Surat Keterangan
								Domisili, Membuat Surat Keterangan Ahli Waris, Sengketa Warga,
								dan lain-lain.
							</p>
						</div>
					</div>

					<div class="flex items-start space-x-4">
						<i class="pi pi-folder-open" style="font-size: 2.5rem"></i>
						<div>
							<h3 class="text-xl font-semibold mb-2">Kegiatan Gotong Royong</h3>
							<p>
								Pelaksanaan Kerja Bakti Massal, Pembangunan dan Kebersihan,
								Perbaikan Saluran Air, Pemasangan Penerangan Lingkungan,
								Ketertiban dan Keamanan Lingkungan.
							</p>
						</div>
					</div>
				</div>
			</div>
  	</section>

  <section
    class="relative bg-cover bg-center py-16"
		id="jumlah-penduduk"
    style=""
  >
    <div class="absolute inset-0" style="background-color: #F9FAFB;"></div>
    <div class="relative z-10 container mx-auto text-center" style="color: #1F2937;">
      <h2 class="text-3xl font-bold mb-12 uppercase tracking-widest">
        JUMLAH PENDUDUK
      </h2>
      <div ref="statsSection" class="grid grid-cols-2 md:grid-cols-6 gap-8 text-center">
				<div v-for="(item, index) in stats" :key="index">
					<div class="flex justify-center mb-4">
						<i class="pi pi-user" style="font-size: 2.5rem"></i>
					</div>
					<div ref="counter" class="text-4xl">{{ item.value }}</div>
					<div class="mt-2">
						<h3 class="text-xl font-bold mb-2">{{ item.label }}</h3>
					</div>
				</div>
			</div>
    </div>
  </section>
	<section class="container mx-auto px-6 py-12">
    <h2 class="text-center text-3xl font-bold mb-12 uppercase tracking-widest text-gray-900">
      BERITA KEGIATAN
    </h2>

    <div class="grid gap-8 md:grid-cols-3">
      <div
        v-for="(item, index) in galleryItems"
        :key="index"
        class="bg-white rounded shadow-md overflow-hidden flex flex-col"
      >
        <img
          :src="getImageUrl(item.image_path)"
          :alt="item.title"
          class="h-48 w-full object-cover"
        />
        <div class="p-4 flex flex-col flex-grow">
          <h3 class="text-sm font-semibold mb-2 line-clamp-2">{{ item.title }}</h3>
          <p class="text-xs text-gray-600 flex-grow line-clamp-3">{{ item.content }}</p>
          <button
            class="mt-4 text-orange-500 text-xs font-semibold border border-orange-500 rounded px-3 py-1 hover:bg-orange-50 self-start"
          >
            BACA SELENGKAPNYA
          </button>
        </div>
      </div>
    </div>
  </section>
    <!-- Sections berikutnya tetap -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '../utils/axios';

const route = useRoute();

const bannerImage = ref('');
const warga = ref([]);
const information = ref([]);
const galleryItems = ref([]);

const stats = [
  { label: 'RT 01', value: 320 },
  { label: 'RT 02', value: 290 },
  { label: 'RT 03', value: 340 },
  { label: 'RT 04', value: 400 },
  { label: 'RT 05', value: 347 },
  { label: 'Total Warga', value: 1697 },
];

const getNews = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get('/news', { params: { page, limit } });
    console.log(response.data.data);
    console.log(response.data.pagination);
  } catch (error) {
    console.error(error);
  }
};

const getImageUrl = (path) =>
  `${import.meta.env.VITE_FILES_URL}${path}`;

const scrollToHash = () => {
  if (route.hash) {
    nextTick(() => {
      const el = document.querySelector(route.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }
};

onMounted(async () => {
  scrollToHash();
  getNews();
  try {
    const [wargaRes, newsRes, infoRes, bannerRes] = await Promise.all([
      apiClient.get('/warga'),
      apiClient.get('/news'),
      apiClient.get('/information'),
      apiClient.get('/banner')
    ]);
    warga.value = wargaRes.data;
    galleryItems.value = newsRes.data.data;
    information.value = infoRes.data.data;
    bannerImage.value = bannerRes.data?.fileUrl || '';
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

watch(() => route.hash, scrollToHash);
</script>
