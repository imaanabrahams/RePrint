<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/NavbarComp.vue'
import Footer from './components/FooterComp.vue'
import DemoDataBanner from './components/DemoDataBanner.vue'
import { useProductsStore } from './stores/productsStores.js'

const route = useRoute()

const isStaffArea = computed(() => route.path.startsWith('/staff') || route.path.startsWith('/hr') || route.path === '/admin')

onMounted(() => {
  useProductsStore().load()
})
</script>

<template>
  <DemoDataBanner v-if="!isStaffArea" />
  <Navbar v-if="!isStaffArea" />
  <main class="app-main">
    <RouterView />
  </main>
  <Footer v-if="!isStaffArea" />
</template>

<style scoped>
.app-main {
  min-height: 70vh;
}
</style>
