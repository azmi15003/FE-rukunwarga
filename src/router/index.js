import { createRouter, createWebHistory } from 'vue-router'
import Home from '../page/Home.vue'
import Organization from '../page/Organization.vue'
import OrganizationForm from '../page/organization/index.vue'
import Login from '@/page/Login.vue'
import Register from '@/page/Register.vue'
import News from '@/page/News.vue'
import ManageNews from '@/page/News/index.vue'
import Information from '@/page/information/index.vue'
import ListInformation from '@/page/Information.vue'
import Warga from '@/page/inhabitant/index.vue'
import DetailWarga from '@/page/DetailWarga.vue'
import Banner from '@/page/banner/index.vue'
import Document from '@/page/Document.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/organization',
    name: 'Organization',
    component: Organization,
    props: true
  },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/berita', name: 'Berita', component: News },
  { path: '/info/penemuan', name: 'PenemuanList', component: ListInformation },
  { path: '/info/iklan', name: 'Iklan', component: ListInformation },
  { path: '/info/kehilangan', name: 'Kehilangan', component: ListInformation },
  { path: '/konten/berita', name: 'Penemuan', component: ManageNews },
  {
    path: '/warga/:rt',
    name: 'WargaDetail',
    component: DetailWarga,
    props: true,
  },
  {
    path: '/konten/informasi',
    name: 'Content Information',
    component: Information,
  },
  {
    path: '/konten/banner',
    name: 'Content Banner',
    component: Banner,
  },
  {
    path: '/konten/dokumen',
    name: 'Content Dokumen',
    component: Document,
  },
  {
    path: '/konten/organisasi',
    name: 'Information',
    component: OrganizationForm,
    props: true,
  },
  {
    path: '/konten/warga',
    name: 'Warga',
    component: Warga,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
